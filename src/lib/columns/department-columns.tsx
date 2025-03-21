import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PenSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Division } from "@/types";
import { Department } from "@/types";

export const columns: ColumnDef<Department>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "acronym",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Acronym
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("acronym")}</div>
    ),
  },
  {
    accessorKey: "divisions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Divisions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const divisions = row.getValue("divisions") as Division[];
      return (
        <div className="capitalize">
          {divisions.map((div) => div.division_name).join(", ")}
        </div>
      );
    },
  },
];

export const RowContextMenu = ({ row }: { row: React.ReactNode }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy Department ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Department
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Department
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
