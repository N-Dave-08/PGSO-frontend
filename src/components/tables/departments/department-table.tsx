"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { columns, RowContextMenu } from "./department-columns";
import { Department } from "@/types";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import CreateDepartment from "@/components/modals/department/create-department";

interface Filters {
  search?: string;
}

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
  onFilterChange?: (filters: Filters) => void;
  onDepartmentCreated: () => Promise<void>;
}

export function DepartmentTable({
  data,
  pagination,
  onPageChange,
  onDelete,
  onFilterChange,
  onDepartmentCreated,
}: DepartmentTableProps) {
  const handleSearch = React.useCallback(
    (searchTerm: string) => {
      onFilterChange?.({ search: searchTerm });
    },
    [onFilterChange]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Department & { onDelete: () => Promise<void> }>) => (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <DataTableToolbar table={table} onSearch={handleSearch} />
        </div>
        <div className="ml-4">
          <CreateDepartment onDepartmentCreated={onDepartmentCreated} />
        </div>
      </div>
    ),
    [handleSearch, onDepartmentCreated]
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
