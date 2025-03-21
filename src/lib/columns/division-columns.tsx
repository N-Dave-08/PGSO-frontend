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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Division } from "@/types";

export const columns: ColumnDef<Division>[] = [
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
    accessorKey: "division_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Division
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "office_location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Office Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "staff",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const staff = row.getValue("staff") as Division["staff"];
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost">{staff.length} members</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              {staff.length === 0 ? (
                <div className="">No members</div>
              ) : (
                staff.map((member) => (
                  <div key={member.id} className="text-sm">
                    {member.name}
                  </div>
                ))
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];

export const RowContextMenu = ({ row }: { row: React.ReactNode }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy Division ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Division
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Division
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
