export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  avatar: string | null;
  is_archived: string;
  age: string;
  gender: string;
  number: number;
  status: string;
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
