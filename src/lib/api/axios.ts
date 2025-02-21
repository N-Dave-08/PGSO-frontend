import axios, { AxiosError } from "axios";
import { generateSessionFingerprint, secureStorage } from "@/lib/utils/encryption";

const BASE_URL = "https://server.pgso.bpc-bsis4d.com/public/api";

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

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add session fingerprint
    const fingerprint = await generateSessionFingerprint();
    config.headers["X-Session-Fingerprint"] = fingerprint;

    // Add session code if available
    const sessionCode = await secureStorage.get("sessionCode");
    if (sessionCode) {
      config.headers["X-Session-Code"] = sessionCode;
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add authorization token if available
    const token = await secureStorage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("Starting Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
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
          const response = await api.post("/refresh-token", {
            sessionCode: await secureStorage.get("sessionCode"),
          });

          const { token } = response.data;
          await secureStorage.set("token", token);

          // Update token in original request
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Process queued requests
          processQueue(null, token);
          
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          
          // Clear auth data
          await secureStorage.remove("token");
          await secureStorage.remove("sessionCode");
          await secureStorage.remove("user");

          // Dispatch auth change event
          window.dispatchEvent(new Event("authChange"));

          // Redirect to login
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

    return Promise.reject(error);
  }
);

export default api;
