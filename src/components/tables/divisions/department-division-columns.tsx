"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

interface DepartmentDivision {
  id: number;
  division_name: string;
  office_location: string;
}

export const columns: ColumnDef<DepartmentDivision>[] = [
  {
    accessorKey: "division_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("division_name")}</div>
    ),
  },
  {
    accessorKey: "office_location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Office Location" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("office_location")}</div>
    ),
  },
];
