import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash, PenSquare, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Request } from "@/helpers/table-data/request-data"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import RequestModal from "@/components/modals/request-modal"

export const columns: ColumnDef<Request>[] = [
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
    accessorKey: "controlNum",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Control No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("controlNum")}</div>,
  },
  {
    accessorKey: "requestedBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requested By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("requestedBy")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <div className="capitalize">{row.getValue("priority")}</div>,
  },
  {
    accessorKey: "assignTo",
    header: "Personnels Assigned",
    cell: ({ row }) => {
      const divisions = row.getValue("assignTo") as string[]
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
                <User />
                {divisions.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {divisions.map((staff, index) => (
              <div key={index}>{staff}</div>
            ))}
          </PopoverContent>
        </Popover>
      )
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status")

  //     return status === "pending" ? (
  //       <RequestModal TriggerName="Pending" StepNum={1} />
  //     ) : status === "rejected" ? (
  //       <RequestModal TriggerName="Rejected" />
  //     ) : status === "to assign" ? (
  //       <RequestModal TriggerName="To Assign" StepNum={2} />
  //     ) : status === "waiting" ? (
  //       <RequestModal TriggerName="Waiting For Completion" StepNum={3} />
  //     ) : status === "for feedback" ? (
  //       <RequestModal TriggerName="For Feedback" StepNum={4} />
  //     ) : status === "completed" ? (
  //       <Badge variant="success">Completed</Badge>
  //     ) : ''
  //   },
  // },
  {
    accessorKey: "requested",
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
      const date = new Date(row.getValue("requested"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const department = row.original

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
              onClick={() => navigator.clipboard.writeText(department.id)}
            >
              Copy Department ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PenSquare />
              Edit
            </DropdownMenuItem>
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

