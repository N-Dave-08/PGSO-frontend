"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { columns, RowContextMenu } from "./department-columns";
import { Department } from "@/types";

type DepartmentWithActions = Department & { onDelete: () => Promise<void> };

interface DepartmentTableProps {
  data: Department[];
  onDelete: () => Promise<void>;
}

export function DepartmentTable({ data, onDelete }: DepartmentTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const renderToolbar = React.useCallback(
    (table: Table<DepartmentWithActions>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    ),
    [globalFilter]
  );

  const tableData = React.useMemo(
    () =>
      data.map((department) => ({
        ...department,
        onDelete,
      })),
    [data, onDelete]
  );

  return (
    <DataTable
      data={tableData}
      columns={columns}
      renderToolbar={renderToolbar}
      rowContextMenu={(row, data) => (
        <RowContextMenu row={row} department={data} onDelete={data.onDelete} />
      )}
    />
  );
}
