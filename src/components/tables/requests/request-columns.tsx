"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Request } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const columns: ColumnDef<Request>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="line-clamp-1">{description}</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              <p className="text-sm">{description}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "requested_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested By" />
    ),
    cell: ({ row }) => {
      const requestedBy = row.original.requested_by;
      return (
        <div>
          {requestedBy.first_name} {requestedBy.last_name}
          {requestedBy.department && (
            <div className="text-sm text-muted-foreground">
              {requestedBy.department}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "personnel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personnel" />
    ),
    cell: ({ row }) => {
      const personnel = row.getValue("personnel") as Request["personnel"];
      return (
        <div className="flex flex-wrap gap-1">
          {personnel.map((person, index) => (
            <Badge
              key={index}
              variant={person.is_team_lead ? "default" : "secondary"}
            >
              {person.name}
              {person.is_team_lead ? " (Team Lead)" : ""}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "For Assessment"
              ? "default"
              : status === "Completed"
              ? "outline"
              : "secondary"
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
