"use client";

import React, { useEffect, useState } from "react";
import { CategoryTable } from "@/components/tables/category-table";
import { getCategories, CategoriesResponse } from "@/lib/api/categories";
import { getUsers } from "@/lib/api/users";
import CreateCategory from "@/components/modals/create-category";
import { User } from "@/types/users";
import { Category } from "@/types/categories";

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

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.user || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  const formattedPersonnel = users
    .filter((user) => user.role_name === "personnel")
    .map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
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
      />
    </div>
  );
}
