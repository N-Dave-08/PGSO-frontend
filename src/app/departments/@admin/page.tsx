"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DepartmentTable } from "@/components/tables/departments/department-table";
import { getDepartments } from "@/lib/api/department";
import { Department } from "@/types";
import { Pagination } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

interface Filters {
  search?: string;
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchDepartments = useCallback(
    async (page: number = 1, filters?: Filters) => {
      try {
        setLoading(true);
        const response = await getDepartments(page, filters);

        if (!response?.departments) {
          console.error("Invalid response format:", response);
          setDepartments([]);
          return;
        }

        setDepartments(response.departments);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total,
          per_page: response.per_page,
        });
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDepartments(pagination.current_page, currentFilters);
  }, [fetchDepartments, pagination.current_page, currentFilters]);

  const handleFilterChange = useCallback((filters: Filters) => {
    setCurrentFilters(filters);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  }, []);

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <DepartmentTable
        data={departments}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={async () => {
          await fetchDepartments(pagination.current_page, currentFilters);
        }}
        onFilterChange={handleFilterChange}
        onDepartmentCreated={async () => {
          await fetchDepartments(pagination.current_page, currentFilters);
        }}
      />
    </div>
  );
}
