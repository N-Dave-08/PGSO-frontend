"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  // Use refs to store the latest values without causing rerenders
  const currentFiltersRef = useRef(currentFilters);
  const paginationRef = useRef(pagination);
  const isInitialLoadRef = useRef(true);

  // Update refs when state changes
  useEffect(() => {
    currentFiltersRef.current = currentFilters;
    paginationRef.current = pagination;
  }, [currentFilters, pagination]);

  const fetchDepartments = useCallback(
    async (page: number = 1, filters?: Filters) => {
      try {
        const response = await getDepartments(page, filters);

        if (!response?.departments) {
          console.error("Invalid response format:", response);
          setDepartments([]);
          return;
        }

        setDepartments(response.departments);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      } finally {
        if (isInitialLoadRef.current) {
          setInitialLoading(false);
          isInitialLoadRef.current = false;
        }
      }
    },
    []
  );

  // Memoize the handlers to prevent unnecessary rerenders
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

  const handleRefresh = useCallback(async () => {
    await fetchDepartments(
      paginationRef.current.current_page,
      currentFiltersRef.current
    );
  }, [fetchDepartments]);

  useEffect(() => {
    fetchDepartments(pagination.current_page, currentFilters);
  }, [fetchDepartments, pagination.current_page, currentFilters]);

  if (initialLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <DepartmentTable
        data={departments}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleRefresh}
        onFilterChange={handleFilterChange}
        onDepartmentCreated={handleRefresh}
      />
    </div>
  );
}
