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
    console.log("Creating category with data:", data);
    const response = await axios.post(
      "https://server.pgso.bpc-bsis4d.com/public/api/admin/category/create",
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
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Log the request details for debugging
    console.log(
      "Making request to categories API with token:",
      token.substring(0, 10) + "..."
    );

    const response = await axios.post(
      "https://server.pgso.bpc-bsis4d.com/public/api/categories",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        // Add timeout and validate SSL certificate
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 300,
      }
    );

    if (!response.data) {
      throw new Error("No data received from the API");
    }

    console.log("Categories API Response:", {
      status: response.status,
      statusText: response.statusText,
      dataLength: response.data?.categories?.length || 0,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("API Error Response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout - server took too long to respond");
      }
    }
    throw error;
  }
};
