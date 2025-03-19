import api, { getAuthHeaders, handleApiError } from "./axios";
import {
  CreateRequestData,
  CreateRequestResponse,
  AssessRequestData,
  RequestStatusResponse,
  RequestsResponse
} from "@/types";

/**
 * Fetches the list of requests
 */
export const getRequests = async (page?: number, perPage?: number): Promise<RequestsResponse> => {
  try {
    const headers = await getAuthHeaders();
    const params: Record<string, any> = {};
    
    if (page) params.page = page;
    if (perPage) params.per_page = perPage;

    const response = await api.get("/request/list", { 
      headers,
      params 
    });

    // Return data with defaults if empty
    return {
      requests: response.data?.requests || [],
      pagination: response.data?.pagination || {
        total: response.data?.total || 0,
        per_page: perPage || 10,
        current_page: page || 1,
        last_page: Math.ceil((response.data?.total || 0) / (perPage || 10))
      },
      isSuccess: response.data?.isSuccess,
      message: response.data?.message
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Creates a new request
 */
export const createRequest = async (
  data: CreateRequestData
): Promise<CreateRequestResponse> => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("request_title", data.request_title);
    formData.append("description", data.description);
    if (data.file_path) {
      formData.append("file_path", data.file_path);
    }
    if (data.category_id) {
      formData.append("category_id", data.category_id.toString());
    }

    // Send request
    const response = await api.post("/request/create", formData, {
      headers: {
        ...(await getAuthHeaders("multipart/form-data")),
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Updates a request status (approve/reject)
 */
export const updateRequestStatus = async (
  requestId: number,
  status: "Approved" | "Rejected",
  note?: string
): Promise<RequestStatusResponse> => {
  try {
    const endpoint = status === "Approved" 
      ? `/request/accept/${requestId}` 
      : `/request/reject/${requestId}`;
    
    const payload = status === "Rejected" ? { note } : {};

    const response = await api.post(
      endpoint,
      payload,
      { headers: await getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Assesses a request
 */
export const assessRequest = async (
  requestId: number,
  data: AssessRequestData
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    const response = await api.post(`/request/assess/${requestId}`, data, {
      headers: await getAuthHeaders(),
    });
    
    return {
      isSuccess: true,
      message: response.data.message,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};
