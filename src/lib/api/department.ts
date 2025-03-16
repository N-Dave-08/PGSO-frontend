import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";

export const getDepartments = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/department"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching divisions:", error);
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
