"use client";

import React, { useEffect, useState } from "react";
import { UserTable } from "@/components/tables/user-table";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";

interface TableUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  division: string;
  status: string;
  profile_img: string | null;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function Page() {
  const [users, setUsers] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchUsers = async (page: number = 1) => {
    try {
      const response = await getUsers(page);
      const usersData = response.user || [];
      const formattedData = usersData.map((user: User): TableUser => {
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role_name,
          department: user.department_name || "N/A",
          division: user.division_name || "N/A",
          status: user.is_archived === "0" ? "Active" : "Archived",
          profile_img: user.profile_img,
        };
      });

      console.log("Formatted Data:", formattedData);
      setUsers(formattedData);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserTable
        data={users}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
