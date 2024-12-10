'use client'

import React, { useState, useEffect } from 'react'
import { RequestTable } from '@/components/tables/request-table'
import { getRequests } from '@/lib/api/requests'

interface ApiRequest {
  id: number
  control_no: string
  description: string
  location_name: string
  category_id: number
  category_name: string
  feedback: string
  status: string
  file_path?: string
  file_url?: string
  updated_at: string
}

interface TableRequest {
  id: number
  control_no: string
  description: string
  location_name: string
  category_id: number
  category_name: string
  feedback: string
  status: string
  file_path?: string
  file_url?: string
  updated_at: string
}

export default function page() {
  const [requests, setRequests] = useState<TableRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      const requestData = response.requests || [];
      const formattedData = requestData.map((request: ApiRequest): TableRequest => ({
        id: request.id,
        control_no: request.control_no,
        description: request.description,
        location_name: request.location_name,
        category_id: request.category_id,
        category_name: request.category_name,
        feedback: request.feedback,
        status: request.status,
        file_path: request.file_path,
        file_url: request.file_url,
        updated_at: request.updated_at,
      }));

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

  return (
    <div>
      <RequestTable data={requests} />
    </div>
  )
}