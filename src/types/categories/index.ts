export interface CategoryPersonnel {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  category_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  personnel: {
    id: number;
    name: string;
    is_team_lead: number;
  }[];
}

export interface CreateCategoryData {
  category_name: string;
  description: string;
  personnel_ids: number[];
  teamlead_ids: number[];
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
