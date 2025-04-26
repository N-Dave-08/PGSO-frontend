export interface PersonnelDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Accomplishment {
  id: number;
  control_no: string;
  request_title: string;
  description: string;
  file_path: string | null;
  file_completion: string | null;
  category_id: number;
  feedback: string | null;
  rating: number | null;
  status: string;
  date_requested: string;
  date_completed: string;
  personnel_ids: string;
  requested_by_id: number;
  requested_by_first_name: string;
  requested_by_last_name: string;
  category_name: string;
  personnel_details: PersonnelDetail[];
}

export interface AccomplishmentResponse {
  isSuccess: boolean;
  message: string;
  data: Accomplishment[];
}
