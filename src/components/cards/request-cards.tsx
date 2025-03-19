"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Request } from "@/types";
import RequestDetailsModal from "@/components/modals/request-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from "react-intersection-observer";

interface RequestCardsProps {
  requests: Request[];
  onRequestUpdate?: () => void;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onLoadMore?: () => void;
  loading?: boolean;
}

export default function RequestCards({
  requests,
  onRequestUpdate,
  pagination,
  onLoadMore,
  loading = false,
}: RequestCardsProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // First deduplicate the requests array by ID
  const uniqueRequests = React.useMemo(() => {
    const uniqueMap = new Map();
    requests.forEach(request => {
      if (!uniqueMap.has(request.id)) {
        uniqueMap.set(request.id, request);
      }
    });
    return Array.from(uniqueMap.values());
  }, [requests]);

  // Then apply the filter on the deduplicated array
  const filteredData = React.useMemo(() => {
    return uniqueRequests.filter((request) => {
      const searchTerm = globalFilter.toLowerCase();
      return (
        request.control_no.toLowerCase().includes(searchTerm) ||
        request.request_title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.status.toLowerCase().includes(searchTerm) ||
        request.requested_by.first_name.toLowerCase().includes(searchTerm) ||
        request.requested_by.last_name.toLowerCase().includes(searchTerm)
      );
    });
  }, [uniqueRequests, globalFilter]);

  // Trigger loading more when scrolling to bottom
  React.useEffect(() => {
    if (
      inView &&
      !loading &&
      pagination &&
      pagination.current_page < pagination.last_page
    ) {
      onLoadMore?.();
    }
  }, [inView, loading, pagination, onLoadMore]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search requests..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((request) => (
          <RequestDetailsModal
            key={request.id}
            request={request}
            onRequestUpdate={onRequestUpdate}
            trigger={
              <Card className="hover:bg-neutral/50 hover:-translate-y-1 cursor-pointer transition-all rounded-3xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      {request.control_no}
                    </CardTitle>
                    <Badge
                      variant={
                        request.status === "Pending"
                          ? "default"
                          : request.status === "In Progress"
                          ? "secondary"
                          : request.status === "Completed"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">{request.request_title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.description}
                  </p>
                  <div className="mt-4 text-sm flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt="user" />
                      <AvatarFallback className="rounded-lg">
                        {request.requested_by.first_name.charAt(0)}
                        {request.requested_by.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-muted-foreground">
                        {request.requested_by.first_name}{" "}
                        {request.requested_by.last_name}
                      </p>
                      <p className="text-muted-foreground">
                        Department: {request.requested_by.department}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }
          />
        ))}
      </div>

      {/* Load more trigger element */}
      <div ref={ref} className="w-full py-8 flex justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">
              Loading more requests...
            </p>
          </div>
        ) : pagination && pagination.current_page < pagination.last_page ? (
          <p className="text-sm text-muted-foreground">Scroll for more</p>
        ) : requests.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            No more requests to load
          </p>
        ) : null}
      </div>

      {pagination && (
        <div className="text-center text-sm text-muted-foreground mt-2 mb-6">
          Showing {requests.length} of {pagination.total} requests
        </div>
      )}
    </div>
  );
}
