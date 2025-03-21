import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PenSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Audit } from "@/helpers/table-data/audit-data";

export const columns: ColumnDef<Audit>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? true : false)
        }
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
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      return <div>{timestamp}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "actionPerformed",
    header: "Action Performed",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("actionPerformed")}</div>
    ),
  },
  {
    accessorKey: "statusBefore",
    header: "Status Before",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("statusBefore")}</div>
    ),
  },
  {
    accessorKey: "statusAfter",
    header: "Status After",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("statusAfter")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const audit = row.original;

      return (
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="h-8 w-8 p-0 flex items-center justify-center">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => navigator.clipboard.writeText(audit.id)}
            >
              Copy Audit ID
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <PenSquare className="mr-2 h-4 w-4" />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    },
  },
];

export const RowContextMenu = ({ row }: { row: React.ReactNode }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy Audit ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Audit
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Audit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
