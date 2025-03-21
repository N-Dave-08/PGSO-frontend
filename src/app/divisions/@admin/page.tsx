"use client";

import React, { useEffect, useState } from "react";
import { DivisionTable } from "@/components/tables/division-table";
import { getDivisions } from "@/lib/api/divisions";
import CreateDivision from "@/components/modals/create-division";
import { Division } from "@/types";

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
          created_at: division.created_at || new Date().toISOString(),
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Divisions</h1>
        <CreateDivision onDivisionCreated={fetchDivisions} />
      </div>
      <DivisionTable data={divisions} />
    </div>
  );
}
