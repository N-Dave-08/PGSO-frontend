'use client'

import React, { useState, useEffect } from 'react'
import RequestCards from '@/components/cards/request-cards'
import { getRequests } from '@/lib/api/requests'

interface ApiRequest {
  id: number
  control_no: string
  request_title: string
  description: string
  file_path: string | null
  file_url: string | null
  file_completion: string | null
  file_completion_url: string | null
  category_id: number | null
  category_name: string | null
  personnel: {
    id: number
    name: string
  }[]
  feedback: string | null
  rating: number | null
  status: string
  date_requested: string
  date_completed: string | null
  requested_by: RequestedBy
  note: string | null
}

interface TableRequest {
  id: number
  control_no: string
  request_title: string
  description: string
  file_path: string | null
  file_url: string | null
  file_completion: string | null
  file_completion_url: string | null
  category_id: number | null
  category_name: string | null
  personnel: {
    id: number
    name: string
  }[]
  feedback: string | null
  rating: number | null
  status: string
  date_requested: string
  date_completed: string | null
  requested_by: RequestedBy
  note: string | null
}

interface RequestedBy {
  id: number
  first_name: string
  last_name: string
  division: string
  office_location: string
  department: string
}

export default function Page() {
  const [requests, setRequests] = useState<TableRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      const requestData = response.requests || [];

      const formattedData = requestData.map((request: ApiRequest): TableRequest => {
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
          note: request.note || null
        }
      });

      console.log('Formatted Data:', formattedData);
      setRequests(formattedData);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("REQUEST DATA", requests)
  return (
    <div>
      <RequestCards data={requests} onRequestUpdate={fetchRequests} />
    </div>
  )
}