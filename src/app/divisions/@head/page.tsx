"use client";

import React, { useEffect, useState } from "react";
import { DepartmentDivisionTable } from "@/components/tables/divisions/department-division-table";
import { getDivisionsByDepartment } from "@/lib/api/divisions";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

interface Department {
  id: number;
  department_name: string;
}

interface DepartmentDivision {
  id: number;
  division_name: string;
  office_location: string;
}

export default function Page() {
  const [divisions, setDivisions] = useState<DepartmentDivision[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDivisions = async () => {
    try {
      const response = await getDivisionsByDepartment(); // Using department ID 1 as per the API response
      if (response.isSuccess) {
        setDepartment(response.department);
        setDivisions(response.divisions);
      }
    } catch (error) {
      console.error("Failed to fetch divisions:", error);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      {department && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {department.department_name}
          </h2>
        </div>
      )}
      <DepartmentDivisionTable data={divisions} />
    </div>
  );
}
