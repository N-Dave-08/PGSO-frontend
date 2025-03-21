import api, { getAuthHeaders, handleApiError } from "./axios";
import { secureStorage } from "@/lib/utils/encryption";
import axios from "axios";

export interface CategoryPersonnel {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  category_name: string;
  description: string;
  personnel: CategoryPersonnel[];
}

export interface CreateCategoryData {
  category_name: string;
  description: string;
  personnel_ids: number[];
}

export interface CreateCategoryResponse {
  isSuccess: boolean;
  message: string;
  category: Category;
}

export interface CategoriesResponse {
  isSuccess: boolean;
  message: string;
  categories: Category[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

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
  page: number = 1
): Promise<CategoriesResponse> => {
  try {
    const token = await secureStorage.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get<CategoriesResponse>(
      `/categories?page=${page}`,
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
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
    throw error;
  }
};
