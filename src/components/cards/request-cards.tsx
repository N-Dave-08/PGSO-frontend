"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Request } from "@/types";
import RequestDetailsModal from "@/components/modals/request-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from "react-intersection-observer";
import { useRequestDetailStore } from "@/store/request-detail-store";

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
  const [localRequests, setLocalRequests] = React.useState(requests);
  const { subscribeToUpdates } = useRequestDetailStore();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Initialize local requests when props change
  React.useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  // Subscribe to request updates
  React.useEffect(() => {
    const unsubscribe = subscribeToUpdates((updatedRequest: Request) => {
      setLocalRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === updatedRequest.id ? updatedRequest : request
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToUpdates]);

  const filteredData = React.useMemo(() => {
    if (!globalFilter) return localRequests;

    return localRequests.filter((request) => {
      const searchStr = globalFilter.toLowerCase();
      return (
        request.control_no.toLowerCase().includes(searchStr) ||
        request.request_title.toLowerCase().includes(searchStr) ||
        request.description.toLowerCase().includes(searchStr) ||
        request.status.toLowerCase().includes(searchStr) ||
        request.requested_by.first_name.toLowerCase().includes(searchStr) ||
        request.requested_by.last_name.toLowerCase().includes(searchStr)
      );
    });
  }, [globalFilter, localRequests]);

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
                      className={
                        request.status === "Completed"
                          ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                          : request.status === "Pending"
                          ? "bg-neutral-500 hover:bg-neutral-500 text-white"
                          : request.status === "For Process"
                          ? "bg-blue-600 hover:bg-blue-600 text-white"
                          : request.status === "For Assignment"
                          ? "bg-violet-500 hover:bg-violet-500 text-white"
                          : request.status === "Queued"
                          ? "bg-cyan-500 hover:bg-cyan-500 text-white"
                          : request.status === "For Review"
                          ? "bg-amber-500 hover:bg-amber-500 text-white"
                          : request.status === "For Feedback"
                          ? "bg-yellow-500 hover:bg-yellow-500 text-black"
                          : request.status === "Returned"
                          ? "bg-red-500 hover:bg-red-500 text-white"
                          : "bg-neutral-500 hover:bg-neutral-500 text-white"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{request.request_title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.requested_by.first_name} ${request.requested_by.last_name}`}
                          alt={`${request.requested_by.first_name} ${request.requested_by.last_name}`}
                        />
                        <AvatarFallback>
                          {request.requested_by.first_name[0]}
                          {request.requested_by.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {request.requested_by.first_name}{" "}
                          {request.requested_by.last_name}
                        </p>
                        <p className="text-muted-foreground">
                          {request.requested_by.division_location}
                        </p>
                      </div>
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
