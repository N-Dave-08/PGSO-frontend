export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: string | null;
  role_name: string;
  division?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}
