"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getDepartments } from "@/lib/api/department";
import { DepartmentTable } from "@/components/tables/departments/department-table";
import { Department } from "@/types";
import { Pagination } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<{
    division_id?: number;
  }>();
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchDepartments = useCallback(
    async (page: number = 1, filters?: { division_id?: number }) => {
      try {
        const response = await getDepartments(page, filters);
        const departmentsData = response.departments || [];
        const formattedData = departmentsData.map(
          (department: Department): Department => ({
            department_name: department.department_name,
            acronym: department.acronym,
            divisions: department.divisions || [],
            id: department.id,
            staff: department.staff || [],
            head: department.head || {},
          })
        );
        setDepartments(formattedData);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    },
    []
  );

  useEffect(() => {
    const initialFetch = async () => {
      await fetchDepartments(pagination.current_page, currentFilters);
      setLoading(false);
    };
    initialFetch();
  }, [fetchDepartments, currentFilters, pagination.current_page]);

  const handleFilterChange = (filters: { division_id?: number }) => {
    setCurrentFilters(filters);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchDepartments(page, currentFilters);
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <DepartmentTable
        data={departments}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={() =>
          fetchDepartments(pagination.current_page, currentFilters)
        }
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
