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
import { Category } from "@/types";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { deleteCategory } from "@/lib/api/categories";
import { toast } from "sonner";

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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.category_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <div className="capitalize">{category}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "personnel",
    header: "Personnel",
    filterFn: (row, id, filterValue: string[]) => {
      const personnel = row.getValue("personnel") as { name: string }[];
      return personnel.some((person) => filterValue.includes(person.name));
    },
    cell: ({ row }) => {
      const personnel = row.getValue("personnel") as { name: string }[];
      return (
        <div className="flex flex-wrap gap-1">
          {personnel.map((person, index) => (
            <Badge key={index} variant="secondary">
              {person.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
];

// Add a row action menu component that will be used in the table
export const RowContextMenu = ({
  row,
  category,
  onDelete,
}: {
  row: React.ReactNode;
  category: Category;
  onDelete: () => Promise<void>;
}) => {
  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await onDelete();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(category.id.toString());
            toast.success("Category ID copied to clipboard");
          }}
        >
          Copy Category ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Category
        </ContextMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Category
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive the category "{category.category_name}". This
                action cannot be undone.
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
    </ContextMenu>
  );
};
