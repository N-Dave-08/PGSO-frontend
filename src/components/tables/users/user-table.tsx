"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Shield, UserCog, Users2, UserCircle, Building2 } from "lucide-react";

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
}

function generateFilterOptions(data: User[]) {
  // Generate unique role options with specific icons
  const roleOptions = Array.from(
    new Set(data.map((user) => user.role_name))
  ).map((role) => {
    const roleIcon =
      role === "admin"
        ? Shield
        : role === "head"
        ? UserCog
        : role === "personnel"
        ? Users2
        : UserCircle; // default icon for other roles (like staff)

    return {
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      icon: roleIcon,
    };
  });

  return {
    roleOptions,
  };
}

export function UserTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
}: UserTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { roleOptions } = React.useMemo(
    () => generateFilterOptions(data),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<User>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      >
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roleOptions}
          />
        )}
      </DataTableToolbar>
    ),
    [globalFilter, roleOptions]
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
