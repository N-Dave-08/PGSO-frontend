"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getDepartments } from "@/lib/api/department";
import { DepartmentTable } from "@/components/tables/departments/department-table";
import { Department } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import CreateDepartment from "@/components/modals/create-department";

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<{
    division_id?: number;
  }>();

  const fetchDepartments = useCallback(
    async (filters?: { division_id?: number }) => {
      try {
        const response = await getDepartments(filters);
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
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    },
    []
  );

  useEffect(() => {
    const initialFetch = async () => {
      await fetchDepartments(currentFilters);
      setLoading(false);
    };
    initialFetch();
  }, [fetchDepartments, currentFilters]);

  const handleFilterChange = (filters: { division_id?: number }) => {
    setCurrentFilters(filters);
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <CreateDepartment
        onDepartmentCreated={() => fetchDepartments(currentFilters)}
      />
      <DepartmentTable
        data={departments}
        onDelete={() => fetchDepartments(currentFilters)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
