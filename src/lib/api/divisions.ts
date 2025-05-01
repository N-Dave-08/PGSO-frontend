import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import type { CreateDivisionRequest } from "@/types/divisions";
import { Division } from "@/types";

export const createDivision = async (data: CreateDivisionRequest) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/division/create",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: data,
      });
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Division creation failed: ${errorMessage}`);
    }
    // Handle non-axios errors
    const err = error as Error;
    throw new Error(`Division creation failed: ${err.message}`);
  }
};

export const getDivisions = async (
  page: number = 1,
  filters?: { search?: string }
) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/divisions?page=${page}`,
      filters || {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("No data received from the API");
    }

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
      throw new Error(
        error.response?.data?.message || "Failed to fetch divisions"
      );
    }
    throw error;
  }
};

export const deleteDivision = async (id: number) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      await secureStorage.remove("user");
      await secureStorage.remove("sessionCode");
      await secureStorage.remove("role");
      window.dispatchEvent(new Event("authChange"));
      window.location.href = "/";
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/division/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      await secureStorage.remove("token");
      await secureStorage.remove("user");
      await secureStorage.remove("sessionCode");
      await secureStorage.remove("role");
      window.dispatchEvent(new Event("authChange"));
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete division"
      );
    }
    throw error;
  }
};

export const updateDivision = async (
  id: number,
  data: {
    division_name: string;
    office_location: string;
    staff_id: number[];
    department_id: number;
  }
) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/division/update/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      throw new Error("No response data received");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Division update error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: data,
      });

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

      throw new Error(error.message || "Failed to update division");
    }
    // Handle non-axios errors
    const err = error as Error;
    throw new Error(`Division update failed: ${err.message}`);
  }
};

export const getDivisionsByDepartment = async () => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/department/division`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("No data received from the API");
    }

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await secureStorage.remove("token");
        await secureStorage.remove("user");
        await secureStorage.remove("sessionCode");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch divisions"
      );
    }
    throw error;
  }
};

export const getAllDivisions = async () => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    let allDivisions: Division[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await getDivisions(currentPage);

      if (!response?.divisions) {
        throw new Error("No data received from the API");
      }

      const divisionsArray = Object.values(response.divisions) as Division[];
      allDivisions = [...allDivisions, ...divisionsArray];

      // Check if we've reached the last page
      if (currentPage >= (response.last_page || 1)) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }

    return {
      divisions: allDivisions,
      isSuccess: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await secureStorage.remove("token");
        await secureStorage.remove("user");
        await secureStorage.remove("sessionCode");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch all divisions"
      );
    }
    throw error;
  }
};
