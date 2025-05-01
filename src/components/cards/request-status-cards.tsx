"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  ClipboardList,
  UserSquare2,
  ListChecks,
  FileStack,
} from "lucide-react";
import { RequestsByStatus } from "@/types";

interface RequestStatusCardsProps {
  statusData: RequestsByStatus;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "for feedback":
      return <MessageSquare className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "for process":
      return <FileStack className="h-4 w-4" />;
    case "for assignment":
      return <UserSquare2 className="h-4 w-4" />;
    case "queued":
      return <ListChecks className="h-4 w-4" />;
    case "for review":
      return <ClipboardList className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "for feedback":
      return "text-blue-600";
    case "pending":
      return "text-yellow-600";
    case "completed":
      return "text-green-600";
    case "for process":
      return "text-purple-600";
    case "for assignment":
      return "text-orange-600";
    case "queued":
      return "text-cyan-600";
    case "for review":
      return "text-indigo-600";
    default:
      return "text-gray-600";
  }
};

export function RequestStatusCards({ statusData }: RequestStatusCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(statusData).map(([status, count]) => (
        <Card key={status}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{status}</CardTitle>
            <div className={getStatusColor(status)}>
              {getStatusIcon(status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground">Total requests</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
