import axios from 'axios';
import api from './axios';

export interface RequestedBy {
    id: number;
    first_name: string;
    last_name: string;
    division: string;
    department: string;
    office_location: string;
}

export interface Request {
    id: number;
    control_no: string;
    request_title: string;
    description: string;
    category: string | null;
    file_url: string;
    status: string;
    requested_by: RequestedBy;
    date_requested: string;
    note: string | null;
}

export interface CreateRequestData {
    request_title: string;
    description: string;
    file_path?: File;
}

export interface CreateRequestResponse {
    isSuccess: boolean;
    message: string;
    request: Request;
}

export interface AssessRequestData {
  category_id: number;
  personnel_ids: number[];
}

export interface RequestStatusResponse {
  isSuccess: boolean;
  message: string;
  request?: {
    id: number;
    control_no: string;
    status: string;
    note: string;
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
      division: string;
      office_location: string;
    };
    date_rejected?: string;
  };
}

export const getRequests = async () => {
  try {
    const response = await api.post('/request/list');
    
    // Return empty array if no data
    return {
      requests: response.data?.requests || [],
      total: response.data?.total || 0
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Unauthorized access. Please login again.');
    }
    console.error('Error fetching requests:', error);
    throw error;
  }
}

export const createRequest = async (data: CreateRequestData): Promise<CreateRequestResponse> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const formData = new FormData();
        formData.append('request_title', data.request_title);
        formData.append('description', data.description);
        if (data.file_path) {
            formData.append('file_path', data.file_path);
        }

        const response = await api.post('/request/create', formData, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data;
            // Check if we have validation errors
            if (errorData && typeof errorData === 'object') {
                if ('errors' in errorData) {
                    const validationErrors = Object.values(errorData.errors as Record<string, string[]>).flat();
                    throw new Error(validationErrors[0] || 'Validation failed');
                }
                if ('message' in errorData) {
                    throw new Error(String(errorData.message));
                }
            }
            throw new Error('Failed to create request');
        }
        throw error;
    }
};

export const updateRequestStatus = async (requestId: number, status: 'Approved' | 'Rejected'): Promise<RequestStatusResponse> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const endpoint = status === 'Approved' 
            ? `/request/accept/${requestId}`
            : `/request/reject/${requestId}`;

        const response = await api.post(
            endpoint,
            status === 'Rejected' ? { note: localStorage.getItem('rejectionNote') } : {},
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data;
            if (errorData && typeof errorData === 'object') {
                if ('message' in errorData) {
                    throw new Error(String(errorData.message));
                }
            }
            throw new Error(`Failed to ${status.toLowerCase()} request`);
        }
        throw error;
    }
};

export const assessRequest = async (requestId: number, data: AssessRequestData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/request/assess/${requestId}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      isSuccess: true,
      message: response.data.message
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to assess request');
    }
    throw error;
  }
};