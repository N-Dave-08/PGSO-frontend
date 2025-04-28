export interface Division {
  division_id: number;
  division_name: string;
  office_location: string;
}

export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  division: Division;
}

export interface Department {
  id: number;
  department_name: string;
}

export interface StaffResponse {
  isSuccess: boolean;
  message: string;
  department: Department;
  staff: Staff[];
}

export interface CreateStaffRequest {
  first_name: string;
  last_name: string;
  email: string;
  number: string;
  division_id: number;
}
