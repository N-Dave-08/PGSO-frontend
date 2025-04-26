"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
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
  onFilterChange?: (filters: {
    status?: string;
    category?: string;
    search?: string;
  }) => void;
}

export function AccomplishmentTable({
  data,
  pagination,
  onPageChange,
  onDelete,
  onSearch,
  onFilterChange,
}: AccomplishmentTableProps) {
  const [filters, setFilters] = React.useState<{
    status?: string;
    category?: string;
    search?: string;
  }>({});

  const statusOptions = [
    { label: "For Feedback", value: "For Feedback" },
    { label: "Completed", value: "Completed" },
  ];

  const categoryOptions = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((item) => item.category_name))
    );
    return uniqueCategories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [data]);

  const handleFilterChange = React.useCallback(
    (key: "status" | "category" | "search", value: string | undefined) => {
      const newFilters = {
        ...filters,
        [key]: value,
      };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Accomplishment>) => (
      <DataTableToolbar
        table={table}
        onSearch={(value) => {
          handleFilterChange("search", value);
          onSearch?.(value);
        }}
      >
        <DataTableFacetedFilter
          title="Status"
          options={statusOptions}
          onFilterChange={(value) => handleFilterChange("status", value)}
        />
        <DataTableFacetedFilter
          title="Category"
          options={categoryOptions}
          onFilterChange={(value) => handleFilterChange("category", value)}
        />
      </DataTableToolbar>
    ),
    [handleFilterChange, onSearch, statusOptions, categoryOptions]
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
