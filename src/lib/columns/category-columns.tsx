import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PenSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Category } from "@/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category_name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "personnel",
    header: "Personnel",
    cell: ({ row }) => {
      const personnel = row.getValue("personnel") as Category["personnel"];
      const teamLeads = personnel.filter((person) => person.is_team_lead === 1);
      const regularPersonnel = personnel.filter(
        (person) => person.is_team_lead === 0
      );

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer">
              <div className="flex items-center space-x-2">
                <span>{personnel.length} members</span>
                {teamLeads.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {teamLeads.length} team lead
                    {teamLeads.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-4">
              {teamLeads.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Team Leads</h4>
                  <div className="space-y-1">
                    {teamLeads.map((lead) => (
                      <div key={lead.id} className="text-sm">
                        {lead.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {regularPersonnel.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Personnel</h4>
                  <div className="space-y-1">
                    {regularPersonnel.map((person) => (
                      <div key={person.id} className="text-sm">
                        {person.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];

// Add a row action menu component that will be used in the table
export const RowContextMenu = ({ row }: { row: React.ReactNode }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
