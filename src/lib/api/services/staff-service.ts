import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { StaffResponse, CreateStaffRequest } from "@/types/staffs";

/**
 * Service for managing staff data
 */
export class StaffService {
  private baseUrl: string;

  constructor() {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error("API base URL is not configured");
    }
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  private async getAuthHeaders() {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private async handleAuthError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await secureStorage.remove("token");
        await secureStorage.remove("user");
        await secureStorage.remove("sessionCode");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(error.response?.data?.message || "Operation failed");
    }
    throw error;
  }

  /**
   * Get all staff
   */
  async getStaff(): Promise<StaffResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${this.baseUrl}/admin/department/staff`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      return await this.handleAuthError(error);
    }
  }

  /**
   * Create a new staff member
   */
  async createStaff(data: CreateStaffRequest): Promise<StaffResponse> {
    try {
      const headers = await this.getAuthHeaders();
      console.log("Creating staff with headers:", headers);
      console.log("Request data:", data);

      const response = await axios.post(`${this.baseUrl}/create/staff`, data, {
        headers,
      });

      console.log("Create staff response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Staff creation error:", error);
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          data: data,
        });

        if (error.response?.status === 401) {
          await secureStorage.remove("token");
          await secureStorage.remove("user");
          await secureStorage.remove("sessionCode");
          window.location.href = "/";
          throw new Error("Session expired. Please login again.");
        }

        // If there's a specific error message from the API, use it
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        // If there's validation errors
        if (error.response?.data?.errors) {
          const validationErrors = Object.values(
            error.response.data.errors
          ).flat();
          throw new Error(validationErrors.join(", "));
        }

        throw new Error(error.message || "Failed to create staff");
      }
      // Handle non-axios errors
      const err = error as Error;
      throw new Error(`Staff creation failed: ${err.message}`);
    }
  }

  /**
   * Get divisions for dropdown
   */
  async getDivisions(): Promise<{
    isSuccess: boolean;
    divisions: { id: number; division_name: string }[];
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(
        `${this.baseUrl}/admin/department/dropdown/division`,
        { headers }
      );
      return response.data;
    } catch (error) {
      return await this.handleAuthError(error);
    }
  }
}
