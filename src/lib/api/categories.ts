import api, { getAuthHeaders, handleApiError } from "./axios";

export interface CategoryPersonnel {
  id: number;
  name: string;
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

/**
 * Creates a new category
 */
export const createCategory = async (
  data: CreateCategoryData
): Promise<CreateCategoryResponse> => {
  try {
    const response = await api.post("/admin/category/create", data, {
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
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/dropdown/categories", {
      headers: await getAuthHeaders(),
    });

    // Return empty array if no data
    return response.data?.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};
