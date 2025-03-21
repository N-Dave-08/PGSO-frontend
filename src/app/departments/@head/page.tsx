"use client";

import React, { useEffect, useState } from "react";
import { getDepartments } from "@/lib/api/department";
import { DepartmentTable } from "@/components/tables/department-table";
import { Department } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <DepartmentTable data={departments} />
    </div>
  );
}
