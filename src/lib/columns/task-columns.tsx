import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash,
  Users,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UpdateTask } from "@/components/modals/update-task";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Task } from "@/helpers/table-data/task-data";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Request Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignees
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignees = row.getValue("assignedTo") as string[];
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Users className="h-4 w-4 mr-2" />
              {assignees.length} {assignees.length === 1 ? "person" : "people"}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Assigned To:</h4>
              <div className="text-sm">
                {assignees.map((assignee, index) => (
                  <p key={index} className="capitalize">
                    {assignee}
                  </p>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "in_progress"
              ? "secondary"
              : "destructive"
          }
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "requestor",
    header: "Requestor",
    cell: ({ row }) => {
      const requestor = row.getValue("requestor") as {
        name: string;
        department: string;
        division: string;
      };

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className="p-0">
              {requestor.name}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{requestor.name}</h4>
              <div className="text-sm">
                <p>Department: {requestor.department}</p>
                <p>Division: {requestor.division}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "dateRequested",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Requested
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateRequested"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return (
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="h-8 w-8 p-0 flex items-center justify-center">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => navigator.clipboard.writeText(task.taskId)}
            >
              Copy Task ID
            </ContextMenuItem>
            <ContextMenuSeparator />
            <UpdateTask task={task} />
            <ContextMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    },
  },
];

interface RowContextMenuProps {
  row: React.ReactNode;
  task: Task;
}

export const RowContextMenu = ({ row, task }: RowContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => navigator.clipboard.writeText(task.taskId)}
        >
          Copy Task ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <UpdateTask task={task} />
        <ContextMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
