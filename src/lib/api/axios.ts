import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  generateSessionFingerprint,
  secureStorage,
} from "@/lib/utils/encryption";

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Creates and configures the API client instance
 */
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false, // Disable credentials for cross-origin requests
  });

  // Add request interceptor
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        // Add session fingerprint
        const fingerprint = await generateSessionFingerprint();
        config.headers["X-Session-Fingerprint"] = fingerprint;

        // Add session code if available
        const sessionCode = await secureStorage.get("sessionCode");
        if (sessionCode) {
          config.headers["X-Session-Code"] = sessionCode;
        }

        // Add authorization token if available
        const token = await secureStorage.get("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      } catch (error) {
        // If there's an error accessing secure storage, clear auth data
        await secureStorage.remove("token");
        await secureStorage.remove("sessionCode");
        await secureStorage.remove("user");
        window.dispatchEvent(new Event("authChange"));
        return Promise.reject(new Error("Failed to access secure storage"));
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Attempt to refresh token
            const sessionCode = await secureStorage.get("sessionCode");
            const response = await apiClient.post("/refresh-token", {
              sessionCode,
            });

            const { token } = response.data;
            await secureStorage.set("token", token);

            // Update token in original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            // Process queued requests
            processQueue(null, token);

            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as Error);

            // Clear auth data and redirect to login
            await secureStorage.remove("token");
            await secureStorage.remove("sessionCode");
            await secureStorage.remove("user");
            localStorage.removeItem("role");
            window.dispatchEvent(new Event("authChange"));
            window.location.href = "/";

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // Queue failed requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      // Handle CORS errors
      if (
        error.message.includes("Network Error") ||
        error.response?.status === 0
      ) {
        console.error("CORS or Network Error:", {
          url: originalRequest.url,
          method: originalRequest.method,
          headers: originalRequest.headers,
        });
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Create singleton instance
const api = createApiClient();

export default api;

// Helper functions
export const getAuthHeaders = async (
  contentType = "application/json"
): Promise<Record<string, string>> => {
  const token = await secureStorage.get("token");
  const sessionCode = await secureStorage.get("sessionCode");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": contentType,
  };

  if (sessionCode) {
    headers["X-Session-Code"] = sessionCode;
  }

  return headers;
};

// Generic error handler
export const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Clear auth and redirect handled by interceptor
      return new Error("Session expired. Please login again.");
    }

    // Handle validation errors
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(
        error.response.data.errors as Record<string, string[]>
      ).flat();
      return new Error(validationErrors[0] || "Validation failed");
    }

    // Handle message in response
    if (error.response?.data?.message) {
      return new Error(String(error.response.data.message));
    }

    // General error based on status code
    if (error.response?.status === 500) {
      return new Error("Internal server error. Please try again later.");
    }

    return new Error(error.message || "API request failed");
  }

  // Non-axios errors
  return error instanceof Error
    ? error
    : new Error("An unknown error occurred");
};
