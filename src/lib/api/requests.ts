import axios from "axios";
import api from "./axios";
import {
  CreateRequestData,
  CreateRequestResponse,
  AssessRequestData,
  RequestStatusResponse,
  AuthHeaders,
} from "@/types";

// Helper function to get auth headers
const getAuthHeaders = (contentType = "application/json"): AuthHeaders => {
  const token = localStorage.getItem("token");
  const sessionCode = localStorage.getItem("sessionCode");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers: AuthHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": contentType,
  };

  if (sessionCode) {
    headers["X-Session-Code"] = sessionCode;
  }

  return headers;
};

export const getRequests = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/list`,
      { headers }
    );

    // Return empty array if no data
    return {
      requests: response.data?.requests || [],
      total: response.data?.total || 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 401 ||
        error.response?.data?.message?.toLowerCase().includes("invalid session")
      ) {
        // Clear auth data and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("sessionCode");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }

      // Handle other specific error cases
      if (error.response?.status === 500) {
        console.error("Server Error:", error.response.data);
        throw new Error("Internal server error. Please try again later.");
      }
    }
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const createRequest = async (
  data: CreateRequestData
): Promise<CreateRequestResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const formData = new FormData();
    formData.append("request_title", data.request_title);
    formData.append("description", data.description);
    if (data.file_path) {
      formData.append("file_path", data.file_path);
    }

    const response = await api.post("/request/create", formData, {
      headers: {
        ...getAuthHeaders("multipart/form-data"),
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      // Check if we have validation errors
      if (errorData && typeof errorData === "object") {
        if ("errors" in errorData) {
          const validationErrors = Object.values(
            errorData.errors as Record<string, string[]>
          ).flat();
          throw new Error(validationErrors[0] || "Validation failed");
        }
        if ("message" in errorData) {
          throw new Error(String(errorData.message));
        }
      }
      throw new Error("Failed to create request");
    }
    throw error;
  }
};

export const updateRequestStatus = async (
  requestId: number,
  status: "Approved" | "Rejected"
): Promise<RequestStatusResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const endpoint =
      status === "Approved"
        ? `/request/accept/${requestId}`
        : `/request/reject/${requestId}`;

    const response = await api.post(
      endpoint,
      status === "Rejected"
        ? { note: localStorage.getItem("rejectionNote") }
        : {},
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      if (errorData && typeof errorData === "object") {
        if ("message" in errorData) {
          throw new Error(String(errorData.message));
        }
      }
      throw new Error(`Failed to ${status.toLowerCase()} request`);
    }
    throw error;
  }
};

export const assessRequest = async (
  requestId: number,
  data: AssessRequestData
) => {
  try {
    const response = await api.post(`/request/assess/${requestId}`, data, {
      headers: getAuthHeaders(),
    });
    return {
      isSuccess: true,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to assess request"
      );
    }
    throw error;
  }
};
