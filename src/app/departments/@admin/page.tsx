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

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await getDepartments();
      const departmentsData = response.departments || [];
      const formattedData = departmentsData.map(
        (department: Department): Department => ({
          department_name: department.department_name,
          acronym: department.acronym,
          divisions: department.divisions || [],
          id: department.id,
        })
      );
      setDepartments(formattedData);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  }, []);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchDepartments();
      setLoading(false);
    };
    initialFetch();
  }, [fetchDepartments]);

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <CreateDepartment onDepartmentCreated={fetchDepartments} />
      <DepartmentTable data={departments} onDelete={fetchDepartments} />
    </div>
  );
}
