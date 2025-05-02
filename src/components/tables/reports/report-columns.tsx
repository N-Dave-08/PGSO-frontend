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
          className={
            status === "Completed"
              ? "bg-emerald-500 hover:bg-emerald-500 text-white"
              : status === "Pending"
              ? "bg-neutral-500 hover:bg-neutral-500 text-white"
              : status === "For Process"
              ? "bg-blue-600 hover:bg-blue-600 text-white"
              : status === "For Assignment"
              ? "bg-violet-500 hover:bg-violet-500 text-white"
              : status === "Queued"
              ? "bg-cyan-500 hover:bg-cyan-500 text-white"
              : status === "For Review"
              ? "bg-amber-500 hover:bg-amber-500 text-white"
              : status === "For Feedback"
              ? "bg-yellow-500 hover:bg-yellow-500 text-black"
              : status === "Returned"
              ? "bg-red-500 hover:bg-red-500 text-white"
              : "bg-neutral-500 hover:bg-neutral-500 text-white"
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
