import api from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import axios from "axios";

export const getDepartments = async () => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get("/admin/department", {
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
        error.response?.data?.message || "Failed to fetch departments"
      );
    }
    throw error;
  }
};

export const createDepartment = async (
  departmentName: string,
  acronym: string,
  divisionIds: number[]
) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/department/create",
      {
        department_name: departmentName,
        acronym,
        division_id: divisionIds,
      },
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
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
    }
    throw error;
  }
};
