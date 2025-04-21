"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DivisionTable } from "@/components/tables/divisions/division-table";
import { getDivisions } from "@/lib/api/divisions";
import CreateDivision from "@/components/modals/create-division";
import { Division } from "@/types";
import { Pagination } from "@/types";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

export default function Page() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchDivisions = useCallback(
    async (page: number = 1, search?: string) => {
      try {
        const response = await getDivisions(
          page,
          search ? { search } : undefined
        );
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
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDivisions(pagination.current_page, searchTerm);
  }, [fetchDivisions, searchTerm, pagination.current_page]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchDivisions(page, searchTerm);
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <div className="mb-4">
        <CreateDivision
          onDivisionCreated={() =>
            fetchDivisions(pagination.current_page, searchTerm)
          }
        />
      </div>
      <DivisionTable
        data={divisions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={() => fetchDivisions(pagination.current_page, searchTerm)}
        onSearch={handleSearch}
      />
    </div>
  );
}
