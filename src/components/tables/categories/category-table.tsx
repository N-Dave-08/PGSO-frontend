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
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
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
}

function generateFilterOptions(data: Category[]) {
  // Flatten and get unique personnel names
  const allPersonnel = new Set<string>();
  data.forEach((category) => {
    category.personnel.forEach((person) => {
      allPersonnel.add(person.name);
    });
  });

  const personnelOptions = Array.from(allPersonnel).map((name) => ({
    value: name,
    label: name,
    icon: Users,
  }));

  return {
    personnelOptions,
  };
}

export function CategoryTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
}: CategoryTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { personnelOptions } = React.useMemo(
    () => generateFilterOptions(data),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Category>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      >
        {table.getColumn("personnel") && (
          <DataTableFacetedFilter
            column={table.getColumn("personnel")}
            title="Personnel"
            options={personnelOptions}
          />
        )}
      </DataTableToolbar>
    ),
    [globalFilter, personnelOptions]
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
        <RowContextMenu row={row} category={data} />
      )}
    />
  );
}
