"use client";

import React, { useEffect, useState } from "react";
import { UserTable } from "@/components/tables/user-table";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
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
      const formattedData = usersData.map((user: User): User => {
        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar: user.avatar,
          role_name: user.role_name,
          department_name: user.department_name || "N/A",
          division_name: user.division_name || "N/A",
          department_id: user.department_id,
          division_id: user.division_id,
          age: user.age,
          gender: user.gender,
          number: user.number,
          is_archived: user.is_archived === "0" ? "Active" : "Archived",
          status: user.status,
        };
      });
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
    return <DataTableSkeleton />;
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
