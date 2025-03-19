"use client";

import React, { useState, useEffect } from "react";
import RequestCards from "@/components/cards/request-cards";
import { getRequests } from "@/lib/api/requests";
import { Request, Pagination } from "@/types";
import { Loader } from "@/components/loader";

export default function Page() {
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
        // console.log('Individual Request:', JSON.stringify(request, null, 2));
        // console.log('Requested By:', request.requested_by);
        // console.log("REQUESTERRRR", request.requested_by_name)

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

      // console.log("Formatted Data:", formattedData);
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
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => fetchRequests()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // console.log("REQUEST DATA", requests);
  return (
    <div className="container mx-auto py-10">
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
