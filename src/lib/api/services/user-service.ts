import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { UserFormValues } from "@/schemas/user-schema";

export class UserService {
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
    };
  }

  async createUser(data: UserFormValues) {
    try {
      const headers = await this.getAuthHeaders();
      console.log("Creating user with headers:", headers);
      console.log("Request data:", data);

      const response = await axios.post(
        `${this.baseUrl}/admin/user/create`,
        data,
        {
          headers,
        }
      );

      console.log("Create user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("User creation error:", error);
      if (axios.isAxiosError(error)) {
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

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        if (error.response?.data?.errors) {
          const validationErrors = Object.values(
            error.response.data.errors
          ).flat();
          throw new Error(validationErrors.join(", "));
        }

        throw new Error(error.message || "Failed to create user");
      }
      const err = error as Error;
      throw new Error(`User creation failed: ${err.message}`);
    }
  }

  async getRoles() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${this.baseUrl}/dropdown/users`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await secureStorage.remove("token");
          await secureStorage.remove("user");
          await secureStorage.remove("sessionCode");
          window.location.href = "/";
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(
          error.response?.data?.message || "Failed to fetch roles"
        );
      }
      throw error;
    }
  }
}
