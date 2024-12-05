import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { UpdateTask } from "@/components/modals/update-task"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task } from "@/helpers/table-data/task-data"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

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
        cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
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
            )
        },
        cell: ({ row }) => {
            const assignees = row.getValue("assignedTo") as string[]
            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="ghost" className="p-0">
                            <Users className="h-4 w-4 mr-2" />
                            {assignees.length} {assignees.length === 1 ? 'person' : 'people'}
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Assigned To:</h4>
                            <div className="text-sm">
                                {assignees.map((assignee, index) => (
                                    <p key={index} className="capitalize">{assignee}</p>
                                ))}
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )
        },
    },
    {
        accessorKey: "status",
        header: "status",
        cell: ({ row }) => <div>{row.getValue("status")}</div>
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <div>{row.getValue("location")}</div>
    },
    {
        accessorKey: "requestor",
        header: "Requestor",
        cell: ({ row }) => {
            const requestor = row.getValue("requestor") as {
                name: string
                department: string
                division: string
            }
            
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
            )
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
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("dateRequested"))
            return <div>{date.toLocaleString()}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const task = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(task.taskId)}
                        >
                            Copy Task ID
                        </DropdownMenuItem>
                        <UpdateTask task={task} />
                        <DropdownMenuItem>
                            <Trash />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
