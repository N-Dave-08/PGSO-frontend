import axios from "axios";

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

export const createCategory = async (
  data: CreateCategoryData
): Promise<CreateCategoryResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/category/create",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to create category"
      );
    }
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/categories",
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
