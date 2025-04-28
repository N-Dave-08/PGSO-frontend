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
import CreateDivision from "@/components/modals/division/create-division";

interface DivisionTableProps {
  data: Division[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onDelete: () => Promise<void>;
  onSearch?: (searchTerm: string) => void;
  onDivisionCreated: () => void;
}

export function DivisionTable({
  data,
  pagination,
  onPageChange,
  onDelete,
  onSearch,
  onDivisionCreated,
}: DivisionTableProps) {
  const renderToolbar = React.useCallback(
    (table: Table<Division>) => (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <DataTableToolbar table={table} onSearch={onSearch} />
        </div>
        <div className="ml-4">
          <CreateDivision onDivisionCreated={onDivisionCreated} />
        </div>
      </div>
    ),
    [onSearch, onDivisionCreated]
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
      rowContextMenu={(row, data) => (
        <RowContextMenu row={data} onDelete={onDelete}>
          {row}
        </RowContextMenu>
      )}
    />
  );
}
