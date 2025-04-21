"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  columns,
  RowContextMenu,
} from "@/components/tables/categories/category-columns";
import { Category } from "@/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { Pagination } from "@/types";

interface CategoryTableProps {
  data: Category[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onDelete: () => Promise<void>;
  onSearch?: (searchTerm: string) => void;
}

export function CategoryTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
  onDelete,
  onSearch,
}: CategoryTableProps) {
  const renderToolbar = React.useCallback(
    (table: Table<Category>) => (
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
        tableName="category"
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    ),
    [pagination, onPageChange, onPerPageChange]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
      rowContextMenu={(row, data) => (
        <RowContextMenu row={row} category={data} onDelete={onDelete} />
      )}
    />
  );
}
