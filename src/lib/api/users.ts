import api from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import axios from "axios";
import type { UsersResponse } from "@/types/users";

export const getUsers = async (
  page: number = 1,
  filters?: {
    role_name?: string;
    search?: string;
    gender?: string;
  }
): Promise<UsersResponse> => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.post(
      `/admin/users?page=${page}`,
      filters || {}, // Send empty object if no filters
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await secureStorage.remove("token");
        await secureStorage.remove("user");
        await secureStorage.remove("sessionCode");
        localStorage.removeItem("role");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await secureStorage.remove("token");
    await secureStorage.remove("user");
    await secureStorage.remove("sessionCode");
    await secureStorage.remove("role");
    window.dispatchEvent(new Event("authChange"));
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
