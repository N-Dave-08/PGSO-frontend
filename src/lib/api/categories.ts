import api, { getAuthHeaders, handleApiError } from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import {
  CreateCategoryData,
  CreateCategoryResponse,
  CategoriesResponse,
} from "@/types/categories";
import axios from "axios";
/**
 * Creates a new category
 */
export const createCategory = async (
  data: CreateCategoryData
): Promise<CreateCategoryResponse> => {
  try {
    const response = await api.post("/category/create", data, {
      headers: await getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Gets all categories
 */
export const getCategories = async (
  page: number = 1,
  filters?: { search?: string }
): Promise<CategoriesResponse> => {
  try {
    const headers = await getAuthHeaders();
    const response = await api.post(`/categories?page=${page}`, filters || {}, {
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await secureStorage.remove("token");
      await secureStorage.remove("user");
      await secureStorage.remove("sessionCode");
      await secureStorage.remove("role");
      window.dispatchEvent(new Event("authChange"));
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }
    // Generic error message to avoid leaking implementation details
    throw new Error("Unable to fetch categories. Please try again later.");
  }
};

export const deleteCategory = async (id: number) => {
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete/category/${id}`,
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
        error.response?.data?.message || "Failed to delete category"
      );
    }
    throw error;
  }
};

export const updateCategory = async (
  categoryId: number,
  data: {
    category_name: string;
    description: string;
    personnel_ids: number[];
    teamlead_ids: number[];
  }
) => {
  try {
    const response = await fetch(`/category/update/${categoryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
