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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { create } from "zustand";

// Store to track which column is expanded
interface ExpandedColumnStore {
  expandedColumn: string | null;
  setExpandedColumn: (column: string | null) => void;
}

const useExpandedColumn = create<ExpandedColumnStore>((set) => ({
  expandedColumn: null,
  setExpandedColumn: (column) => set({ expandedColumn: column }),
}));

// Reusable expandable cell component
function ExpandableCell({
  content,
  columnId,
  baseWidth,
  expandedWidth,
  compressedWidth,
  className = "",
}: {
  content: React.ReactNode;
  columnId: string;
  baseWidth: string;
  expandedWidth: string;
  compressedWidth: string;
  className?: string;
}) {
  const { expandedColumn, setExpandedColumn } = useExpandedColumn();
  const isExpanded = expandedColumn === columnId;
  const isAnyExpanded = expandedColumn !== null;

  const width = isExpanded
    ? expandedWidth
    : isAnyExpanded
    ? compressedWidth
    : baseWidth;

  return (
    <div
      className={cn(
        "truncate transition-all duration-200 cursor-pointer",
        `w-[${width}]`,
        className
      )}
      onClick={() => setExpandedColumn(isExpanded ? null : columnId)}
      title={typeof content === "string" ? content : undefined}
    >
      {content}
    </div>
  );
}

function CompressibleCell({
  content,
  baseWidth,
  compressedWidth,
  className = "",
}: {
  content: React.ReactNode;
  baseWidth: string;
  compressedWidth: string;
  className?: string;
}) {
  const { expandedColumn } = useExpandedColumn();
  const isAnyExpanded = expandedColumn !== null;

  return (
    <div
      className={cn(
        "truncate transition-all duration-200",
        `w-[${isAnyExpanded ? compressedWidth : baseWidth}]`,
        className
      )}
    >
      {content}
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
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
      <ExpandableCell
        content={
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        }
        columnId="select"
        baseWidth="40px"
        expandedWidth="50px"
        compressedWidth="30px"
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
    cell: ({ row }) => (
      <ExpandableCell
        content={row.getValue("id")}
        columnId="id"
        baseWidth="50px"
        expandedWidth="70px"
        compressedWidth="40px"
      />
    ),
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
        <ExpandableCell
          content={
            <Avatar>
              {avatarUrl && (
                <AvatarImage src={avatarUrl} alt={row.original.first_name} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          }
          columnId="avatar"
          baseWidth="50px"
          expandedWidth="70px"
          compressedWidth="40px"
        />
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
      return (
        <ExpandableCell
          content={name}
          columnId="fullName"
          baseWidth="120px"
          expandedWidth="200px"
          compressedWidth="80px"
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <ExpandableCell
          content={email}
          columnId="email"
          baseWidth="100px"
          expandedWidth="200px"
          compressedWidth="100px"
        />
      );
    },
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.role_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <ExpandableCell
          content={
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
          }
          columnId="role"
          baseWidth="75px"
          expandedWidth="75px"
          compressedWidth="75px"
        />
      );
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => (
      <ExpandableCell
        content={row.getValue("age") || "N/A"}
        columnId="age"
        baseWidth="35px"
        expandedWidth="35px"
        compressedWidth="35px"
      />
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <ExpandableCell
          content={gender || "N/A"}
          columnId="gender"
          baseWidth="70px"
          expandedWidth="70px"
          compressedWidth="70px"
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => (
      <ExpandableCell
        content={row.getValue("number")}
        columnId="number"
        baseWidth="90px"
        expandedWidth="100px"
        compressedWidth="50px"
      />
    ),
  },
  {
    accessorKey: "department",
    accessorFn: (row) => row.department_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return (
        <ExpandableCell
          content={department || "N/A"}
          columnId="department"
          baseWidth="120px"
          expandedWidth="250px"
          compressedWidth="80px"
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "division",
    accessorFn: (row) => row.division_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const division = row.getValue("division") as string;
      return (
        <ExpandableCell
          content={division || "N/A"}
          columnId="division"
          baseWidth="150px"
          expandedWidth="300px"
          compressedWidth="100px"
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <ExpandableCell
          content={
            <Badge variant={status === "Active" ? "default" : "destructive"}>
              {status}
            </Badge>
          }
          columnId="status"
          baseWidth="90px"
          expandedWidth="120px"
          compressedWidth="60px"
        />
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
