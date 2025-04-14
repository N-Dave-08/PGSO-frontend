import api from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import axios from "axios";
import { User } from "@/types/users";

export interface UsersResponse {
  user: User[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getUsers = async (page: number = 1): Promise<UsersResponse> => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get(`/admin/users?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Raw API Response:", response.data);
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
