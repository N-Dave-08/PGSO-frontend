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
import { Badge } from "@/components/ui/badge";
import { Division, Department } from "@/types";
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("department_name")}</div>
    ),
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
    filterFn: (row, id, filterValue: string[]) => {
      const divisions = row.getValue("divisions") as Division[];
      return divisions.some((division) =>
        filterValue.includes(division.division_name)
      );
    },
    cell: ({ row }) => {
      const divisions = row.getValue("divisions") as Division[];
      return (
        <div className="flex flex-wrap gap-1">
          {divisions.map((division) => (
            <Badge key={division.id} variant="secondary">
              {division.division_name}
            </Badge>
          ))}
        </div>
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
