"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DivisionTable } from "@/components/tables/divisions/division-table";
import { getDivisions } from "@/lib/api/divisions";
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

        if (!response?.divisions) {
          console.error("Invalid response format:", response);
          setDivisions([]);
          return;
        }

        // Convert the divisions object to an array and type it as Division[]
        const divisionsArray = Object.values(response.divisions) as Division[];

        // Set the divisions array from the response
        setDivisions(divisionsArray);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total,
          per_page: response.per_page,
        });
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
        setDivisions([]);
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
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <DivisionTable
        data={divisions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={() => fetchDivisions(pagination.current_page, searchTerm)}
        onSearch={handleSearch}
        onDivisionCreated={() =>
          fetchDivisions(pagination.current_page, searchTerm)
        }
      />
    </div>
  );
}
