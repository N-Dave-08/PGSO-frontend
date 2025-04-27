"use client";

import { RequestTable } from "@/components/tables/requests/request-table";
import { RequestService } from "@/lib/api/services/request-service";
import { Request } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import { useCallback, useEffect, useState } from "react";
import { Pagination } from "@/types";

export default function Reports() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const requestService = new RequestService();
      const response = await requestService.getRequests();
      if (response.isSuccess && response.requests) {
        setRequests(response.requests);
        setPagination(response.pagination);
      } else {
        setError("No requests data available");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Filter requests based on search term
  const filteredRequests = requests.filter((request) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      request.control_no.toLowerCase().includes(searchLower) ||
      request.request_title.toLowerCase().includes(searchLower) ||
      request.category_name?.toLowerCase().includes(searchLower) ||
      request.status.toLowerCase().includes(searchLower) ||
      `${request.requested_by.first_name} ${request.requested_by.last_name}`
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Get paginated data
  const startIndex = (pagination.current_page - 1) * pagination.per_page;
  const endIndex = startIndex + pagination.per_page;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Update pagination based on filtered results
  const totalPages = Math.ceil(filteredRequests.length / pagination.per_page);
  const currentPagination = {
    ...pagination,
    total: filteredRequests.length,
    last_page: totalPages,
  };

  return (
    <RequestTable
      data={paginatedRequests}
      pagination={currentPagination}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
    />
  );
}
