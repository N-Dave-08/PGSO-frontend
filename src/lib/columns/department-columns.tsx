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
import { Division } from "@/types";
import { Department } from "@/types";
import { deleteDepartment } from "@/lib/api/department";
import { toast } from "sonner";
import { useState } from "react";
import EditDepartment from "@/components/modals/edit-department";

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
    accessorKey: "department_name",
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

export const RowContextMenu = ({
  row,
  children,
  onDelete,
}: {
  row: any;
  children: React.ReactNode;
  onDelete: () => Promise<void>;
}) => {
  const handleDelete = async () => {
    try {
      await deleteDepartment(row.id);
      toast.success("Department deleted successfully");
      await onDelete();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete department"
      );
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              navigator.clipboard.writeText(row.id.toString());
              toast.success("Department ID copied to clipboard");
            }}
          >
            Copy Department ID
          </ContextMenuItem>
          <ContextMenuSeparator />
          <EditDepartment
            department={row}
            onDepartmentUpdated={onDelete}
            trigger={
              <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <PenSquare className="mr-2 h-4 w-4" />
                Edit Department
              </ContextMenuItem>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Department
              </ContextMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the department "
                  {row.department_name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
