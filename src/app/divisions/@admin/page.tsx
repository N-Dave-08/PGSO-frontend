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

        if (!response?.divisions?.data) {
          console.error("Invalid response format:", response);
          setDivisions([]);
          return;
        }

        // Convert the object-based data to an array
        const divisionsArray = Object.values(response.divisions.data) as Array<{
          id: number;
          division_name: string;
          office_location: string;
          staff: Array<{
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            number: string;
          }>;
          personnel: Array<{
            id: number;
            first_name: string;
            last_name: string;
            email: string;
          }>;
          department_id: number;
          created_at: string;
        }>;

        const formattedData: Division[] = divisionsArray.map((division) => ({
          id: division.id,
          division_name: division.division_name,
          office_location: division.office_location,
          staff:
            division.staff.map((staff) => ({
              ...staff,
              number: staff.number || "",
              division: {
                division_id: division.id,
                division_name: division.division_name,
                office_location: division.office_location,
              },
            })) || [],
          department_id: division.department_id || 0,
          created_at: division.created_at,
          personnel: division.personnel || [],
        }));

        setDivisions(formattedData);
        setPagination({
          current_page: response.divisions.current_page,
          last_page: response.divisions.last_page,
          total: response.divisions.total,
          per_page: response.divisions.per_page,
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
    fetchDivisions(page, searchTerm);
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
