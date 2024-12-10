'use client'

import React, { useState, useEffect } from 'react'
import { RequestTable } from '@/components/tables/request-table'
import { getRequests } from '@/lib/api/requests'

interface ApiRequest {
  id: number
  request_title: string
  control_no: string
  description: string
  location_name: string
  category_id: number
  category_name: string
  feedback: string
  status: string
  file_url?: string
  date_requested: string
}

interface TableRequest {
  id: number
  request_title: string
  control_no: string
  description: string
  location_name: string
  category_id: number
  category_name: string
  feedback: string
  status: string
  file_url?: string
  date_requested: string
}

// {
//   "isSuccess": true,
//   "message": "Requests retrieved successfully.",
//   "requests": [
//       {
//           "id": 1,
//           "control_no": "2024-001",
//           "request_title": "Aircon sira",
//           "description": "ayaw lumamig",
//           "location_name": "2nd floor ng CIT building",
//           "category_id": null,
//           "category_name": null,
//           "feedback": null,
//           "status": "For Review",
//           "file_url": "http://127.0.0.1:8000/requests/Request-2024-001-20241209001414.jpg",
//           "requested_by": {
//               "id": 7,
//               "first_name": "Warren Delas",
//               "last_name": "Cruz",
//               "division": "sample sample",
//               "office_location": "sample",
//               "department": "Office of the Governor"
//           },
//           "date_requested": "2024-12-09 00:14:14"
//       },
//       {
//           "id": 2,
//           "control_no": "2024-002",
//           "request_title": "Aircon sira",
//           "description": "ayaw lumamig",
//           "location_name": "2nd floor ng CIT building",
//           "category_id": null,
//           "category_name": null,
//           "feedback": null,
//           "status": "Pending",
//           "file_url": "http://127.0.0.1:8000/requests/Request-2024-002-20241209001445.jpg",
//           "requested_by": {
//               "id": 7,
//               "first_name": "Warren Delas",
//               "last_name": "Cruz",
//               "division": "sample sample",
//               "office_location": "sample",
//               "department": "Office of the Governor"
//           },
//           "date_requested": "2024-12-09 00:14:45"
//       },

export default function Page() {
  const [requests, setRequests] = useState<TableRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      const requestData = response.requests || [];
      const formattedData = requestData.map((request: ApiRequest): TableRequest => ({
        id: request.id,
        request_title: request.request_title,
        control_no: request.control_no,
        description: request.description,
        location_name: request.location_name,
        category_id: request.category_id,
        category_name: request.category_name,
        feedback: request.feedback,
        status: request.status,
        file_url: request.file_url,
        date_requested: request.date_requested,
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