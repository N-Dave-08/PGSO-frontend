export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  avatar: string | null;
  is_archived: string;
  number: number;
  status: string;
  age?: string;
  gender?: string;
}

export interface UsersResponse {
  user: User[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface UserResponse {
  isSuccess: boolean;
  message: string;
  user: {
    id: number;
    first_name: string;
    middle_initial: string | null;
    last_name: string;
    number: string;
    email: string;
    designation: string | null;
    role_name: string;
    division_id: number | null;
    department_id: number | null;
    avatar: string | null;
  };
}
