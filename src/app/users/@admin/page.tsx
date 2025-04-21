"use client";

import React, { useEffect, useState, useCallback } from "react";
import { UserTable } from "@/components/tables/users/user-table";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Pagination } from "@/types";
import { ApiError } from "@/types/api";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchUsers = useCallback(
    async (page: number = 1, search?: string, role?: string) => {
      try {
        const filters: { search?: string; role_name?: string } = {};
        if (search) filters.search = search;
        if (role) filters.role_name = role;

        const response = await getUsers(page, filters);
        const usersData = response.user || [];
        const formattedData = usersData.map(
          (user: User): User => ({
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
          })
        );

        setUsers(formattedData);
        setPagination(response.pagination);
        setError(null);
      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError.message !== "No users found.") {
          setError(apiError.message || "Failed to fetch users");
        }
        setUsers([]);
        setPagination({
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 1,
        });
      }
    },
    []
  );

  useEffect(() => {
    const initialFetch = async () => {
      await fetchUsers(pagination.current_page, searchTerm, roleFilter);
      setLoading(false);
    };
    initialFetch();
  }, [fetchUsers, searchTerm, roleFilter, pagination.current_page]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: { role_name?: string }) => {
    setRoleFilter(filters.role_name);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, searchTerm, roleFilter);
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <UserTable
        data={users}
        pagination={pagination}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
