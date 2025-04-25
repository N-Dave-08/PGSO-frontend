"use client";

import { ReportRequest } from "@/types/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ReportsTableProps {
  data: ReportRequest[];
}

export function ReportsTable({ data }: ReportsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Control No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Date Completed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.control_no}</TableCell>
              <TableCell>{request.request_title}</TableCell>
              <TableCell>{request.category_name}</TableCell>
              <TableCell>
                {request.requested_by.first_name}{" "}
                {request.requested_by.last_name}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "For Feedback"
                      ? "default"
                      : request.status === "Completed"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(request.date_requested)}</TableCell>
              <TableCell>
                {request.date_completed
                  ? formatDate(request.date_completed)
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:text-primary"
                >
                  <Link href={`/requests/${request.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Request</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
