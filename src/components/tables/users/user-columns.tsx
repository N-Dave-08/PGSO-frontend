import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/users";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "avatar",
    header: "Profile",
    cell: ({ row }) => {
      const initials = row.original.first_name[0].toUpperCase();
      const avatarUrl = (row.getValue("avatar") as string)?.replace(
        "/storage/",
        "/"
      );
      return (
        <Avatar>
          {avatarUrl && (
            <AvatarImage src={avatarUrl} alt={row.original.first_name} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "full name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.first_name + " " + row.original.last_name;
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.role_name,
    header: "Role",
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={
            role === "admin"
              ? "destructive"
              : role === "head"
              ? "default"
              : role === "personnel"
              ? "secondary"
              : "outline"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const age = row.getValue("age") as string;
      return <div>{age || "N/A"}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return <div className="capitalize">{gender || "N/A"}</div>;
    },
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
];

export const RowContextMenu = ({
  row,
  user,
}: {
  row: React.ReactNode;
  user: User;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => navigator.clipboard.writeText(user.id.toString())}
        >
          Copy User ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <PenSquare className="mr-2 h-4 w-4" />
          Edit User
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete User
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
