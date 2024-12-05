import axios from 'axios';

export interface Category {
    id: number;
    name: string;
}

interface CategoryResponse {
    isSuccess: boolean;
    message: string;
    data: Category[];
}

export const getCategories = async (): Promise<CategoryResponse> => {
    try {
        const response = await axios.get<CategoryResponse>('https://server.pgso.bpc-bsis4d.com/public/api/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}
