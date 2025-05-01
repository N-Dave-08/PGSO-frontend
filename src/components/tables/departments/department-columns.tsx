import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash, UserRoundIcon, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Division, Department, Head, Staff } from "@/types";
import { deleteDepartment } from "@/lib/api/department";
import { toast } from "sonner";
import EditDepartment from "@/components/modals/department/edit-department";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<
  Department & { onDelete: () => Promise<void> }
>[] = [
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
    accessorKey: "Department",
    accessorFn: (row) => row.department_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Department")}</div>
    ),
  },
  {
    accessorKey: "acronym",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acronym" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("acronym")}</div>
    ),
  },
  {
    accessorKey: "divisions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Divisions" />
    ),
    cell: ({ row }) => {
      const divisions = row.getValue("divisions") as Division[];
      const maxDisplayDivisions = 3;

      if (!divisions.length) {
        return <div className="text-muted-foreground">No divisions</div>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-wrap gap-1 max-w-[550px]">
                {divisions.slice(0, maxDisplayDivisions).map((division) => (
                  <Badge key={division.id} variant="secondary">
                    {division.division_name}
                  </Badge>
                ))}
                {divisions.length > maxDisplayDivisions && (
                  <Badge variant="outline">
                    +{divisions.length - maxDisplayDivisions} more
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            {divisions.length > maxDisplayDivisions && (
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  {divisions.slice(maxDisplayDivisions).map((division) => (
                    <span key={division.id}>{division.division_name}</span>
                  ))}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "staff",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => {
      const staff = row.getValue("staff") as Staff[];
      return (
        <Badge variant="outline">
          <Users className="w-4 h-4 mr-1" />
          {staff.length} member{staff.length !== 1 ? "s" : ""}
        </Badge>
      );
    },
  },
  {
    accessorKey: "head",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Head" />
    ),
    cell: ({ row }) => {
      const head = row.getValue("head") as Head;
      if (!head?.first_name) {
        return <div className="text-muted-foreground">No head assigned</div>;
      }
      return (
        <Badge variant="outline">
          <UserRoundIcon className="w-4 h-4 mr-1" />
          {head.first_name.charAt(0).toUpperCase() +
            head.first_name.slice(1)}{" "}
          {head.last_name.charAt(0).toUpperCase() + head.last_name.slice(1)}
        </Badge>
      );
    },
  },
];

export const RowContextMenu = ({
  row,
  department,
  onDelete,
}: {
  row: React.ReactNode;
  department: Department;
  onDelete: () => Promise<void>;
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDepartment(department.id);
      toast.success("Department deleted successfully");
      await onDelete();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete department"
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
      console.error("Error updating department:", error);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer"
          >
            <PenSquare className="mr-2 h-4 w-4" />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ContextMenuItem className="cursor-pointer">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  department and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Make changes to the department here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <EditDepartment
            department={department}
            onDepartmentUpdated={handleEditComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
