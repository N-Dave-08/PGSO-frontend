export interface CategoryPersonnel {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  category_name: string;
  description: string;
  personnel: {
    id: number;
    name: string;
  }[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
  personnelIds: number[];
}

export interface CreateCategoryResponse {
  isSuccess: boolean;
  message: string;
  category: Category;
}
