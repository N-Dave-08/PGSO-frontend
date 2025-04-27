"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { columns } from "./request-columns";
import { Request } from "@/types";
import RequestDetailsModal from "@/components/modals/request-details";

interface RequestTableProps {
  data: Request[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
}

export function RequestTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: RequestTableProps) {
  const renderToolbar = React.useCallback(
    (table: Table<Request>) => (
      <DataTableToolbar table={table} onSearch={onSearch} />
    ),
    [onSearch]
  );

  const renderPagination = React.useCallback(
    () => (
      <DataTablePagination
        currentPage={pagination.current_page}
        pageCount={pagination.last_page}
        perPage={pagination.per_page}
        total={pagination.total}
        tableName="request"
        onPageChange={onPageChange}
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
      rowContextMenu={(row, rowData) => (
        <RequestDetailsModal request={rowData} trigger={row} />
      )}
    />
  );
}
