"use client";

import React, { useState, useEffect } from "react";
import RequestCards from "@/components/cards/request-cards";
import { getRequests } from "@/lib/api/requests";
import { Request } from "@/types";
import { Loader } from "@/components/loader";
import CreateRequest from "@/components/modals/create-request";

export default function Page() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      const requestData = response.requests || [];

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
      setRequests(formattedData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
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
      <CreateRequest />
      <RequestCards requests={requests} onRequestUpdate={fetchRequests} />
    </div>
  );
}
