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
  onPerPageChange?: (perPage: number) => void;
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
  onPerPageChange,
  onFilterChange,
  onSearch,
}: UserTableProps) {
  const { roleOptions } = generateFilterOptions();

  const renderToolbar = React.useCallback(
    (table: Table<User>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableFacetedFilter
          title="Role"
          options={roleOptions}
          onFilterChange={(value) => onFilterChange?.({ role_name: value })}
        />
      </DataTableToolbar>
    ),
    [roleOptions, onFilterChange, onSearch]
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
      rowContextMenu={(row, data) => <RowContextMenu row={row} user={data} />}
    />
  );
}
