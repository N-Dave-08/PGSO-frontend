"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { columns } from "./accomplishment-columns";
import { Accomplishment } from "@/types";

interface AccomplishmentTableProps {
  data: Accomplishment[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onDelete?: () => Promise<void>;
  onSearch?: (searchTerm: string) => void;
}

export function AccomplishmentTable({
  data,
  pagination,
  onPageChange,
  onDelete,
  onSearch,
}: AccomplishmentTableProps) {
  const renderToolbar = React.useCallback(
    (table: Table<Accomplishment>) => (
      <DataTableToolbar table={table} onSearch={onSearch} />
    ),
    [onSearch]
  );

  const renderPagination = React.useCallback(
    () =>
      pagination && (
        <DataTablePagination
          currentPage={pagination.current_page}
          pageCount={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          tableName="accomplishment"
          onPageChange={(page) => onPageChange?.(page)}
        />
      ),
    [pagination, onPageChange]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
    />
  );
}
