"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ReportRequest } from "@/types/reports";
import { formatDate } from "@/lib/utils/format";

export const columns: ColumnDef<ReportRequest>[] = [
  {
    accessorKey: "control_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Control No." />
    ),
  },
  {
    accessorKey: "request_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "requested_by",
    header: "Requested By",
    cell: ({ row }) => {
      const requestedBy = row.original.requested_by;
      return <div>{requestedBy.full_name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "For Feedback"
              ? "secondary"
              : status === "Completed"
              ? "default"
              : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_requested",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Requested" />
    ),
    cell: ({ row }) => formatDate(row.getValue("date_requested")),
  },
  {
    accessorKey: "date_completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Completed" />
    ),
    cell: ({ row }) => {
      const dateCompleted = row.getValue("date_completed") as string | null;
      return dateCompleted ? formatDate(dateCompleted) : "N/A";
    },
  },
];
