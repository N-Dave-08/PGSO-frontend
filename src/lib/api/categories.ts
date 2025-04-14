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
  page: number = 1
): Promise<CategoriesResponse> => {
  try {
    const headers = await getAuthHeaders();
    const response = await api.get(`/categories?page=${page}`, { headers });
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
