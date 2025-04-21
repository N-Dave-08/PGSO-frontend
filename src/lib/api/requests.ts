import api, { getAuthHeaders, handleApiError } from "./axios";
import {
  CreateRequestData,
  CreateRequestResponse,
  AssessRequestData,
  RequestStatusResponse,
  RequestsResponse,
} from "@/types";
import { secureStorage } from "@/lib/utils/encryption";

interface RequestParams {
  page?: number;
  per_page?: number;
}

/**
 * Fetches the list of requests
 */
export const getRequests = async (
  page?: number,
  perPage?: number
): Promise<RequestsResponse> => {
  try {
    const headers = await getAuthHeaders();
    const params: RequestParams = {};

    if (page) params.page = page;
    if (perPage) params.per_page = perPage;

    const response = await api.get("/request/list", {
      headers,
      params,
    });

    // Return data with defaults if empty
    return {
      requests: response.data?.requests || [],
      pagination: response.data?.pagination || {
        total: response.data?.total || 0,
        per_page: perPage || 10,
        current_page: page || 1,
        last_page: Math.ceil((response.data?.total || 0) / (perPage || 10)),
      },
      isSuccess: response.data?.isSuccess,
      message: response.data?.message,
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
    const endpoint =
      status === "Approved"
        ? `/request/accept/${requestId}`
        : `/request/reject/${requestId}`;

    const payload = status === "Rejected" ? { note } : {};

    const response = await api.post(endpoint, payload, {
      headers: await getAuthHeaders(),
    });

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
    if (!requestId || isNaN(Number(requestId))) {
      throw new Error("Invalid request ID");
    }

    // Ensure data has the correct types
    const formattedData = {
      category_id: Number(data.category_id),
      personnel_ids: data.personnel_ids.map((id) => Number(id)),
      status: data.status,
      remarks: data.remarks,
    };

    const response = await api.post(
      `/request/assess/${requestId}`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${await secureStorage.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("No response data received from server");
    }

    return {
      isSuccess: response.data.isSuccess || true,
      message: response.data.message || "Request assessed successfully",
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Assigns a request to a team lead and category
 */
export const assignRequest = async (
  requestId: number,
  data: { category_id: number; team_lead_id: number }
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    if (!requestId || isNaN(Number(requestId))) {
      throw new Error("Invalid request ID");
    }

    const response = await api.post(
      `/request/assign/${requestId}`,
      {
        category_id: Number(data.category_id),
        team_lead_id: Number(data.team_lead_id),
      },
      {
        headers: {
          Authorization: `Bearer ${await secureStorage.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("No response data received from server");
    }

    return {
      isSuccess: response.data.isSuccess || true,
      message: response.data.message || "Request assigned successfully",
    };
  } catch (error) {
    throw handleApiError(error);
  }
};
