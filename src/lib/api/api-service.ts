import api, { getAuthHeaders, handleApiError } from "./axios";

/**
 * Generic API service to handle common request patterns
 */
export class ApiService {
  /**
   * Base URL segment for all requests within this service
   */
  protected baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  /**
   * Get resource with optional query params
   */
  async get<
    T,
    P extends Record<string, string | number | boolean> = Record<string, never>
  >(endpoint: string, params?: P): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await api.get(url, {
        params,
        headers: await getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Post data to endpoint
   */
  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await api.post(url, data, {
        headers: await getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Put data to endpoint
   */
  async put<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await api.put(url, data, {
        headers: await getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete resource
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await api.delete(url, {
        headers: await getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Upload file with form data
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await api.post(url, formData, {
        headers: {
          ...(await getAuthHeaders("multipart/form-data")),
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Build full URL with base URL
   */
  private buildUrl(endpoint: string): string {
    // Ensure no double slashes
    if (
      this.baseUrl &&
      !this.baseUrl.endsWith("/") &&
      !endpoint.startsWith("/")
    ) {
      return `${this.baseUrl}/${endpoint}`;
    }

    if (
      this.baseUrl &&
      this.baseUrl.endsWith("/") &&
      endpoint.startsWith("/")
    ) {
      return `${this.baseUrl}${endpoint.substring(1)}`;
    }

    return `${this.baseUrl}${endpoint}`;
  }
}
