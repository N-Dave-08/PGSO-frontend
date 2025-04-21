import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash, UserRoundIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Division, Department, Head } from "@/types";
import { deleteDepartment } from "@/lib/api/department";
import { toast } from "sonner";
import EditDepartment from "@/components/modals/edit-department";

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
    accessorKey: "department_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("department_name")}</div>
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
    header: "Divisions",
    cell: ({ row }) => {
      const divisions = row.getValue("divisions") as Division[];
      return (
        <div className="flex flex-wrap gap-1 max-w-[550px]">
          {divisions.map((division) => (
            <Badge key={division.id} variant="secondary">
              {division.division_name}
            </Badge>
          ))}
        </div>
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
          <UserRoundIcon className="w-4 h-4" />
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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(department.id.toString());
            toast.success("Department ID copied to clipboard");
          }}
        >
          Copy Department ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <EditDepartment
          department={department}
          onDepartmentUpdated={onDelete}
          trigger={
            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
              <PenSquare className="mr-2 h-4 w-4" />
              <span>Edit Department</span>
            </ContextMenuItem>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Department</span>
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                department and remove its data from the server.
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
  );
};
