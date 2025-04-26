"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Shield, UserCog, Users2, UserCircle } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { columns, RowContextMenu } from "./user-columns";
import { User } from "@/types";

interface UserTableProps {
  data: User[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
  onFilterChange?: (filters: { role_name?: string }) => void;
  onSearch?: (searchTerm: string) => void;
}

function generateFilterOptions() {
  const roleOptions = [
    {
      value: "admin",
      label: "Admin",
      icon: Shield,
    },
    {
      value: "head",
      label: "Head",
      icon: UserCog,
    },
    {
      value: "personnel",
      label: "Personnel",
      icon: Users2,
    },
    {
      value: "staff",
      label: "Staff",
      icon: UserCircle,
    },
  ];

  return {
    roleOptions,
  };
}

export function UserTable({
  data,
  pagination,
  onPageChange,
  onFilterChange,
  onSearch,
}: UserTableProps) {
  const { roleOptions } = generateFilterOptions();
  const [filters, setFilters] = React.useState<{
    role_name?: string;
  }>({});

  const handleFilterChange = React.useCallback(
    (key: "role_name", value: string | undefined) => {
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
    (table: Table<User>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableFacetedFilter
          title="Role"
          options={roleOptions}
          onFilterChange={(value) => handleFilterChange("role_name", value)}
        />
      </DataTableToolbar>
    ),
    [roleOptions, handleFilterChange, onSearch]
  );

  const renderPagination = React.useCallback(
    () => (
      <DataTablePagination
        currentPage={pagination.current_page}
        pageCount={pagination.last_page}
        perPage={pagination.per_page}
        total={pagination.total}
        tableName="user"
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
      rowContextMenu={(row, data) => <RowContextMenu row={row} user={data} />}
    />
  );
}
