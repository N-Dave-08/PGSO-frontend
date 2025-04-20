"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Users } from "lucide-react";
import {
  columns,
  RowContextMenu,
} from "@/components/tables/categories/category-columns";
import { Category } from "@/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";

interface CategoryTableProps {
  data: Category[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onDelete: () => Promise<void>;
}

export function CategoryTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
  onDelete,
}: CategoryTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const renderToolbar = React.useCallback(
    (table: Table<Category>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      ></DataTableToolbar>
    ),
    [globalFilter]
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
      pagination={pagination}
      onPageChange={onPageChange}
      onPerPageChange={onPerPageChange}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
      rowContextMenu={(row, data) => (
        <RowContextMenu row={row} category={data} onDelete={onDelete} />
      )}
    />
  );
}
