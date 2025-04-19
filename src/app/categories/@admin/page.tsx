"use client";

import React, { useEffect, useState } from "react";
import { CategoryTable } from "@/components/tables/categories/category-table";
import { getCategories } from "@/lib/api/categories";
import { getUsers } from "@/lib/api/users";
import CreateCategory from "@/components/modals/create-category";
import { User } from "@/types/users";
import { Category } from "@/types/categories";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchCategories = async (page: number = 1) => {
    try {
      const response = await getCategories(page);
      setCategories(response.categories);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      let allUsers: User[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await getUsers(currentPage);
        const users = response.user || [];
        allUsers = [...allUsers, ...users];

        // Check if there are more pages
        if (response.pagination.current_page < response.pagination.last_page) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }

      console.log("All users fetched:", allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllUsers();
  }, []);

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  const formattedPersonnel = users
    .filter((user) => {
      console.log("User role:", user.role_name);
      return user.role_name === "personnel";
    })
    .map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

  console.log("Formatted personnel:", formattedPersonnel);

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <div className="mb-4">
        <CreateCategory
          onCategoryCreated={handleCategoryCreated}
          personnel={formattedPersonnel}
        />
      </div>
      <CategoryTable
        data={categories}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={fetchCategories}
      />
    </div>
  );
}
