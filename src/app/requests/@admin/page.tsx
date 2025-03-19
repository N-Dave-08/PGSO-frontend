"use client";

import { useEffect, useState } from "react";
import { getRequests } from "@/lib/api/requests";
import RequestCards from "@/components/cards/request-cards";
import { Request } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      const requestData = response.requests || [];

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
      // Don't redirect here, just show an error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
    <div className="">
      <RequestCards requests={requests} onRequestUpdate={fetchRequests} />
    </div>
  );
}
