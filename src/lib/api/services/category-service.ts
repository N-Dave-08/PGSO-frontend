import { ApiService } from "../api-service";
import {
  Category,
  CreateCategoryData,
  CreateCategoryResponse,
} from "../categories";

/**
 * Service for managing categories
 */
export class CategoryService extends ApiService {
  constructor() {
    // Use admin prefix for admin endpoints, no prefix for public endpoints
    super("");
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await this.get<{ data: Category[] }>(
      "dropdown/categories"
    );

    // Return empty array if no data
    return response?.data || [];
  }

  /**
   * Create a new category
   */
  async createCategory(
    data: CreateCategoryData
  ): Promise<CreateCategoryResponse> {
    return this.post<CreateCategoryResponse>("admin/category/create", data);
  }

  /**
   * Delete a category
   */
  async deleteCategory(
    id: number
  ): Promise<{ isSuccess: boolean; message: string }> {
    return this.delete<{ isSuccess: boolean; message: string }>(
      `admin/category/delete/${id}`
    );
  }

  /**
   * Update a category
   */
  async updateCategory(
    id: number,
    data: CreateCategoryData
  ): Promise<{ isSuccess: boolean; message: string; category: Category }> {
    return this.put<{
      isSuccess: boolean;
      message: string;
      category: Category;
    }>(`admin/category/update/${id}`, data);
  }
}
