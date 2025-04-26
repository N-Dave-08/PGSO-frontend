import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileText } from "lucide-react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Division, Accomplishment } from "@/types";
import { deleteDivision } from "@/lib/api/divisions";
import { toast } from "sonner";
import EditDivision from "@/components/modals/division/edit-division";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Accomplishment>[] = [
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
    accessorKey: "control_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Control No." />
    ),
  },
  {
    accessorKey: "request_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="line-clamp-1">{description}</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              <p className="text-sm">{description}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "For Feedback" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_requested",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Requested" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date_requested") as string;
      return format(new Date(date), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "date_completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Completed" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date_completed") as string;
      return date ? format(new Date(date), "MMM dd, yyyy") : "-";
    },
  },
  {
    accessorKey: "requested_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested By" />
    ),
    cell: ({ row }) => {
      return `${row.original.requested_by_first_name} ${row.original.requested_by_last_name}`;
    },
  },
];

export const RowContextMenu = ({
  row,
  children,
}: {
  row: Accomplishment;
  children: React.ReactNode;
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(row.control_no);
            toast.success("Control number copied to clipboard");
          }}
        >
          Copy Control No.
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setShowDetailsModal(true);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </ContextMenuItem>
        {row.file_path && (
          <ContextMenuItem
            onSelect={(e) => {
              e.preventDefault();
              window.open(row.file_path!, "_blank");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>View File</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
      {showDetailsModal && (
        <Dialog
          open={showDetailsModal}
          onOpenChange={(open) => {
            setShowDetailsModal(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accomplishment Details</DialogTitle>
              <DialogDescription>
                View the complete details of this accomplishment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Control No.</h4>
                <p className="text-sm">{row.control_no}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Title</h4>
                <p className="text-sm">{row.request_title}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm">{row.description}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Category</h4>
                <p className="text-sm">{row.category_name}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <Badge
                  variant={
                    row.status === "For Feedback" ? "default" : "secondary"
                  }
                >
                  {row.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Requested By</h4>
                <p className="text-sm">
                  {row.requested_by_first_name} {row.requested_by_last_name}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Date Requested</h4>
                <p className="text-sm">
                  {format(new Date(row.date_requested), "MMM dd, yyyy")}
                </p>
              </div>
              {row.date_completed && (
                <div className="space-y-2">
                  <h4 className="font-medium">Date Completed</h4>
                  <p className="text-sm">
                    {format(new Date(row.date_completed), "MMM dd, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ContextMenu>
  );
};
