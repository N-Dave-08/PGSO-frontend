import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Division } from "@/types";
import { deleteDivision } from "@/lib/api/divisions";
import { toast } from "sonner";
import EditDivision from "@/components/modals/division/edit-division";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  {
    accessorKey: "staff",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
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
                    {member.first_name} {member.last_name}
                  </div>
                ))
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "personnel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personnel" />
    ),
    cell: ({ row }) => {
      const personnel =
        (row.getValue("personnel") as Division["personnel"]) || [];
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost">{personnel.length} members</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              {personnel.length === 0 ? (
                <div className="">No members</div>
              ) : (
                personnel.map((member) => (
                  <div key={member.id} className="text-sm">
                    {member.first_name} {member.last_name}
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

export const RowContextMenu = ({
  row,
  children,
  onDelete,
}: {
  row: Division;
  children: React.ReactNode;
  onDelete: () => Promise<void>;
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDivision(row.id);
      toast.success("Division deleted successfully");
      await onDelete();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete division"
      );
    }
  };

  const handleEditComplete = async () => {
    try {
      setShowEditModal(false);
      await onDelete();
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);
    } catch (error) {
      console.error("Error updating division:", error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(row.id.toString());
            toast.success("Division ID copied to clipboard");
          }}
        >
          Copy Division ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setShowEditModal(true);
          }}
        >
          <PenSquare className="mr-2 h-4 w-4" />
          <span>Edit Division</span>
        </ContextMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Division
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive the division &quot;{row.division_name}&quot;.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
      {showEditModal && (
        <Dialog
          open={showEditModal}
          onOpenChange={(open) => {
            setShowEditModal(open);
            if (!open) {
              setTimeout(() => {
                document.body.style.pointerEvents = "";
              }, 0);
            }
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Division</DialogTitle>
              <DialogDescription>
                Update the division details below.
              </DialogDescription>
            </DialogHeader>
            <EditDivision
              division={row}
              onDivisionUpdated={handleEditComplete}
            />
          </DialogContent>
        </Dialog>
      )}
    </ContextMenu>
  );
};
