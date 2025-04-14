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
  staff: Array<{
    id: number;
    name: string;
    position: string;
  }>;
  category_id: number;
  department_id: number;
}
