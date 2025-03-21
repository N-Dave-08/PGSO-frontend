export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  department_id: number;
  department_name: string;
  division_id: number;
  division_name: string;
  profile_img: string | null;
  is_archived: string;
  age: string;
  gender: string;
  number: number;
}
