"use client";

import React, { useEffect, useState } from "react";
import { DivisionTable } from "@/components/tables/divisions/division-table";
import { getDivisions } from "@/lib/api/divisions";
import CreateDivision from "@/components/modals/create-division";
import { Division } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

export default function Page() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDivisions = async () => {
    try {
      const response = await getDivisions();
      const divisionsData = response.divisions || [];
      const formattedData = divisionsData.map(
        (division: Division): Division => ({
          id: division.id,
          division_name: division.division_name,
          office_location: division.office_location,
          staff: division.staff || [],
          department_id: division.department_id,
          created_at: division.created_at,
        })
      );

      setDivisions(formattedData);
    } catch (error) {
      console.error("Failed to fetch divisions:", error);
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
      <div className="mb-4">
        <CreateDivision onDivisionCreated={fetchDivisions} />
      </div>
      <DivisionTable data={divisions} onDelete={fetchDivisions} />
    </div>
  );
}
