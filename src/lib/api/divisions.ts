import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { CreateDivisionRequest } from "@/types/divisions";

export const createDivision = async (data: CreateDivisionRequest) => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    console.log("Creating division with data:", data);
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

export const getDivisions = async () => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/divisions",
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
