"use client";

import { useEffect, useState } from "react";
import { getRequests } from "@/lib/api/requests";
import RequestCards from "@/components/cards/request-cards";
import { Request, Pagination } from "@/types";
import CreateRequest from "@/components/modals/create-request";
import RequestCardSkeleton from "@/components/loaders/request-card-sekeleton";

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchRequests = async (page: number = 1) => {
    try {
      const isInitialLoad = page === 1;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getRequests(page, 6); // Fetch 6 items per page
      const requestData = response.requests || [];
      const paginationData = response.pagination;

      const formattedData = requestData.map((request: Request): Request => {
        return {
          id: request.id,
          control_no: request.control_no,
          request_title: request.request_title,
          description: request.description,
          file_path: request.file_path,
          file_url: request.file_url,
          file_completion: request.file_completion,
          file_completion_url: request.file_completion_url,
          category_id: request.category_id,
          category_name: request.category_name,
          team_lead: request.team_lead,
          personnel: request.personnel || [],
          feedback: request.feedback,
          rating: request.rating,
          status: request.status,
          date_requested: request.date_requested,
          date_completed: request.date_completed,
          requested_by: request.requested_by,
          note: request.note || null,
        };
      });

      if (isInitialLoad) {
        setRequests(formattedData);
      } else {
        setRequests((prev) => [...prev, ...formattedData]);
      }

      setPagination(paginationData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setError("Failed to load requests. Please try again.");
      // Don't redirect here, just show an error message
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (
      pagination &&
      pagination.current_page < pagination.last_page &&
      !loadingMore
    ) {
      fetchRequests(pagination.current_page + 1);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <RequestCardSkeleton />
      </div>
    );
  }

  return (
    <div className="">
      <CreateRequest onRequestCreated={() => fetchRequests(1)} />
      <RequestCards
        requests={requests}
        onRequestUpdate={() => fetchRequests(1)}
        pagination={pagination || undefined}
        onLoadMore={handleLoadMore}
        loading={loadingMore}
      />
    </div>
  );
}
