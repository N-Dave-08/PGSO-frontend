import { ApiService } from "../api-service";
import {
  CreateRequestData,
  CreateRequestResponse,
  AssessRequestData,
  RequestStatusResponse,
  RequestsResponse,
  Request,
} from "@/types";

/**
 * Service for managing requests
 */
export class RequestService extends ApiService {
  constructor() {
    // Set the base URL segment for all request endpoints
    super("/request");
  }

  /**
   * Get all requests
   */
  async getRequests(): Promise<RequestsResponse> {
    const response = await this.get<RequestsResponse>("list");

    // Return with defaults if no data
    return {
      requests: response?.requests || [],
      pagination: response?.pagination || {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      },
      isSuccess: response?.isSuccess,
      message: response?.message,
    };
  }

  /**
   * Get a single request by ID
   */
  async getRequestById(id: number): Promise<Request> {
    return this.get<Request>(`${id}`);
  }

  /**
   * Create a new request
   */
  async createRequest(data: CreateRequestData): Promise<CreateRequestResponse> {
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

    // Use upload method which handles form data with files
    return this.upload<CreateRequestResponse>("create", formData);
  }

  /**
   * Approve a request
   */
  async approveRequest(id: number): Promise<RequestStatusResponse> {
    return this.post<RequestStatusResponse>(`accept/${id}`);
  }

  /**
   * Reject a request
   */
  async rejectRequest(
    id: number,
    note?: string
  ): Promise<RequestStatusResponse> {
    return this.post<RequestStatusResponse>(`reject/${id}`, { note });
  }

  /**
   * Assess a request
   */
  async assessRequest(
    id: number,
    data: AssessRequestData
  ): Promise<{ isSuccess: boolean; message: string }> {
    return this.post<{ isSuccess: boolean; message: string }>(
      `assess/${id}`,
      data
    );
  }
}
