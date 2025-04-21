import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash,
  Eye,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RequestDetailsModal from "@/components/modals/request-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins for timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

export type Request = {
  id: number;
  control_no: string;
  request_title: string;
  description: string;
  file_path: string | null;
  file_url: string | null;
  file_completion: string | null;
  file_completion_url: string | null;
  category_id: number | null;
  category_name: string | null;
  team_lead: string | null;
  personnel: {
    id: number;
    name: string;
  }[];
  feedback: string | null;
  rating: number | null;
  status: string;
  date_requested: string;
  date_completed: string | null;
  requested_by: RequestedBy;
  note: string | null;
};

export type RequestedBy = {
  id: number;
  first_name: string;
  last_name: string;
  division: string;
  office_location: string;
  department: string;
  division_location: string;
};

interface RequestColumnProps {
  onRequestUpdate?: () => void;
}

export const columns = ({
  onRequestUpdate,
}: RequestColumnProps): ColumnDef<Request>[] => [
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
    accessorKey: "control_no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Control No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("control_no")}</div>
    ),
  },
  {
    accessorKey: "request_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("request_title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "date_requested",
    header: "Date Requested",
    cell: ({ row }) => {
      const date = row.getValue("date_requested") as string | undefined;
      if (!date) return <div className="text-muted-foreground">-</div>;
      return <div>{dayjs(date).tz("Asia/Manila").format("MMM D, YYYY")}</div>;
    },
  },
  {
    accessorKey: "requested_by",
    header: "Requested By",
    cell: ({ row }) => {
      const requester = row.getValue("requested_by");

      if (
        requester &&
        typeof requester === "object" &&
        "first_name" in requester &&
        "last_name" in requester
      ) {
        const typedRequester = requester as RequestedBy;
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-pointer">
                <div className="capitalize">{`${typedRequester.first_name} ${typedRequester.last_name}`}</div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Additional Information</p>
                <div className="text-sm">
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {typedRequester.division_location}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      }

      return <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "requested_by_location",
    header: "Location",
    cell: ({ row }) => {
      const requester = row.getValue("requested_by") as RequestedBy;
      return requester?.division_location ? (
        <div>{requester.division_location}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const requestStatus = row.getValue("status");
      return requestStatus === "Completed" ? (
        <div className="bg-success p-1 rounded-lg text-success-content">
          {requestStatus}
        </div>
      ) : requestStatus === "Pending" ? (
        <div className="bg-neutral p-1 rounded-lg">{requestStatus}</div>
      ) : requestStatus === "Returned" ? (
        <div className="bg-warning text-warning-content p-1 rounded-lg">
          {requestStatus}
        </div>
      ) : requestStatus === "For Completion" ? (
        <div className="bg-info text-info-content p-1 rounded-lg">
          {requestStatus}
        </div>
      ) : requestStatus === "For Feedback" ? (
        <div className="bg-info text-black p-1 rounded-lg">{requestStatus}</div>
      ) : (
        ""
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number | null;
      return rating !== null ? (
        <div>{rating}/5</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: "personnel",
    header: "Assigned Personnel",
    cell: ({ row }) => {
      const personnel = row.getValue("personnel") as {
        id: number;
        name: string;
      }[];
      return personnel && personnel.length > 0 ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer">
              <div>{personnel.length} assigned</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Assigned Personnel</p>
              {personnel.map((person) => (
                <div key={person.id} className="text-sm">
                  {person.name}
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <div className="text-muted-foreground">No personnel assigned</div>
      );
    },
  },
  {
    accessorKey: "date_completed",
    header: "Date Completed",
    cell: ({ row }) => {
      const date = row.getValue("date_completed") as string | undefined;
      if (!date) return <div className="text-muted-foreground">-</div>;
      return <div>{dayjs(date).tz("Asia/Manila").format("MMM D, YYYY")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const request = row.original;

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
              onClick={() =>
                navigator.clipboard.writeText(request.id.toString())
              }
            >
              Copy Request ID
            </DropdownMenuItem>
            <RequestDetailsModal
              request={request}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              }
              onRequestUpdate={onRequestUpdate}
            />
            <DropdownMenuItem>
              <PenSquare className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
