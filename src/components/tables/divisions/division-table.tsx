"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  columns,
  RowContextMenu,
} from "@/components/tables/divisions/division-columns";
import { Division } from "@/types";

interface DivisionTableProps {
  data: Division[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onDelete: () => Promise<void>;
}

export function DivisionTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
  onDelete,
}: DivisionTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const renderToolbar = React.useCallback(
    (table: Table<Division>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    ),
    [globalFilter]
  );

  const renderPagination = React.useCallback(
    () =>
      pagination && (
        <DataTablePagination
          currentPage={pagination.current_page}
          pageCount={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          tableName="division"
          onPageChange={(page) => onPageChange?.(page)}
          onPerPageChange={(perPage) => onPerPageChange?.(perPage)}
        />
      ),
    [pagination, onPageChange, onPerPageChange]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={pagination}
      onPageChange={onPageChange}
      onPerPageChange={onPerPageChange}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
      rowContextMenu={(row, data) => (
        <RowContextMenu row={data} onDelete={onDelete}>
          {row}
        </RowContextMenu>
      )}
    />
  );
}
