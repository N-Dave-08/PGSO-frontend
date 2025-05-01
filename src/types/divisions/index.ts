export interface Division {
  id: number;
  division_name: string;
  office_location: string;
  department_id: number | null;
  department_name: string | null;
  staff: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateDivisionRequest {
  division_name: string;
  office_location: string;
  staff_id: number[];
  department_id: number;
}
