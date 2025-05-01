import api from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import axios from "axios";

export const getDepartmentDropdown = async () => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get("/dropdown/departments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await secureStorage.remove("token");
        await secureStorage.remove("user");
        await secureStorage.remove("sessionCode");
        await secureStorage.remove("role");
        window.dispatchEvent(new Event("authChange"));
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch department options"
      );
    }
    throw error;
  }
};
