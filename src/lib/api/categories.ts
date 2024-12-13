import axios from 'axios';

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

export const createCategory = async (data: CreateCategoryData): Promise<CreateCategoryResponse> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }
        console.log('Creating category with data:', data);
        const response = await axios.post<CreateCategoryResponse>(
            '/api/category/create/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to create category');
        }
        throw error;
    }
}

export const getCategories = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const response = await axios.post(`${baseUrl}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}