import axios from 'axios';

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

export const getRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'https://server.pgso.bpc-bsis4d.com/public/api/request/list',
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Return empty array if no data
    return {
      requests: response.data?.requests || [],
      message: response.data?.message || 'No requests found'
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        requests: [],
        message: 'No requests found'
      };
    }
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

        const response = await axios.post<CreateRequestResponse>(
            'https://server.pgso.bpc-bsis4d.com/public/api/request/create',
            formData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

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

export const updateRequestStatus = async (requestId: number, status: 'Approved' | 'Rejected'): Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const endpoint = status === 'Approved' 
            ? `https://server.pgso.bpc-bsis4d.com/public/api/request/accept/${requestId}`
            : `https://server.pgso.bpc-bsis4d.com/public/api/request/reject/${requestId}`;

        const response = await axios.post(
            endpoint,
            {},
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
    const response = await axios.post(
      `https://server.pgso.bpc-bsis4d.com/public/api/request/assess/${requestId}`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
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