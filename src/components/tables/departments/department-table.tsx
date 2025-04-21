"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { columns, RowContextMenu } from "./department-columns";
import { Department, Division } from "@/types";
import { getDivisions } from "@/lib/api/divisions";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";

interface DepartmentTableProps {
  data: Department[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onDelete: () => Promise<void>;
  onFilterChange?: (filters: { division_id?: number; search?: string }) => void;
}

export function DepartmentTable({
  data,
  pagination,
  onPageChange,
  onDelete,
  onFilterChange,
}: DepartmentTableProps) {
  const [divisions, setDivisions] = React.useState<Division[]>([]);

  React.useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await getDivisions();
        if (response.divisions) {
          setDivisions(response.divisions);
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  const handleSearch = React.useCallback(
    (searchTerm: string) => {
      onFilterChange?.({ search: searchTerm });
    },
    [onFilterChange]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Department & { onDelete: () => Promise<void> }>) => (
      <DataTableToolbar table={table} onSearch={handleSearch}>
        <DataTableFacetedFilter
          title="Division"
          options={divisions.map((division) => ({
            label: division.division_name,
            value: division.id.toString(),
          }))}
          onFilterChange={(value) =>
            onFilterChange?.({
              division_id: value ? parseInt(value) : undefined,
            })
          }
          optionsIcon={Building2}
        />
      </DataTableToolbar>
    ),
    [divisions, onFilterChange, handleSearch]
  );

  const renderPagination = React.useCallback(
    () =>
      pagination &&
      onPageChange && (
        <DataTablePagination
          currentPage={pagination.current_page}
          pageCount={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          tableName="department"
          onPageChange={onPageChange}
        />
      ),
    [pagination, onPageChange]
  );

  const tableData = React.useMemo(
    () =>
      data.map((department) => ({
        ...department,
        onDelete,
      })),
    [data, onDelete]
  );

  return (
    <DataTable
      data={tableData}
      columns={columns}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
      rowContextMenu={(row, data) => (
        <RowContextMenu row={row} department={data} onDelete={data.onDelete} />
      )}
    />
  );
}
