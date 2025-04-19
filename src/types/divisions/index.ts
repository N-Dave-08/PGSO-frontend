import { Staff } from "@/types";

export interface Division {
  id: number;
  division_name: string;
  office_location: string;
  department_id: number;
  created_at: string;
  staff: Staff[];
}

export interface CreateDivisionRequest {
  division_name: string;
  office_location: string;
  staff_id: number[];
  category_id: number;
}
