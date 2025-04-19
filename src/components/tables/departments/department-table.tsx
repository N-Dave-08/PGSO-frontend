"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { columns, RowContextMenu } from "./department-columns";
import { Department } from "@/types";

type DepartmentWithActions = Department & { onDelete: () => Promise<void> };

interface DepartmentTableProps {
  data: Department[];
  onDelete: () => Promise<void>;
}

function generateFilterOptions(data: Department[]) {
  // Get unique division names from all departments
  const allDivisions = new Set<string>();
  data.forEach((department) => {
    department.divisions.forEach((division) => {
      allDivisions.add(division.division_name);
    });
  });

  const divisionOptions = Array.from(allDivisions).map((name) => ({
    value: name,
    label: name,
    icon: Building2,
  }));

  return {
    divisionOptions,
  };
}

export function DepartmentTable({ data, onDelete }: DepartmentTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { divisionOptions } = React.useMemo(
    () => generateFilterOptions(data),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<DepartmentWithActions>) => (
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      >
        {table.getColumn("divisions") && (
          <DataTableFacetedFilter
            column={table.getColumn("divisions")}
            title="Divisions"
            options={divisionOptions}
          />
        )}
      </DataTableToolbar>
    ),
    [globalFilter, divisionOptions]
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
