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
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{requestedBy.full_name}</span>
          <span className="text-sm text-muted-foreground">
            {requestedBy.department}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "requested_by.division",
    header: "Division",
    cell: ({ row }) => {
      const requestedBy = row.original.requested_by;
      return <div>{requestedBy.division}</div>;
    },
  },
  {
    accessorKey: "personnel",
    header: "Personnel",
    cell: ({ row }) => {
      const personnel = row.original.personnel;
      return <div>{personnel.map((p) => p.name).join("; ")}</div>;
    },
  },
  {
    accessorKey: "team_lead",
    header: "Team Lead",
    cell: ({ row }) => {
      const teamLead = row.original.team_lead;
      return <div>{teamLead ? teamLead.full_name : "N/A"}</div>;
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
