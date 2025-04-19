"use client";

import React, { useEffect, useState } from "react";
import { UserTable } from "@/components/tables/users/user-table";
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
  const [currentFilters, setCurrentFilters] = useState<{
    role_name?: string;
  }>();
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchUsers = async (
    page: number = 1,
    filters?: { role_name?: string }
  ) => {
    try {
      const response = await getUsers(page, filters);
      const usersData = response.user || [];
      const formattedData = usersData.map((user: User): User => {
        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar: user.avatar,
          role_name: user.role_name,
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
    fetchUsers(1, currentFilters);
  }, [currentFilters]);

  const handlePageChange = (page: number) => {
    fetchUsers(page, currentFilters);
  };

  const handleFilterChange = (filters: { role_name?: string }) => {
    setCurrentFilters(filters);
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <UserTable
      data={users}
      pagination={pagination}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
    />
  );
}
