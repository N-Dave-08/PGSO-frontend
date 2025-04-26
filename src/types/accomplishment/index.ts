export interface Personnel {
  id: number;
  name: string;
  email: string;
}

export interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Accomplishment {
  id: number;
  control_no: string;
  request_title: string;
  description: string;
  file_path: string | null;
  file_url: string | null;
  file_completion: string | null;
  file_completion_url: string | null;
  category_id: number;
  category_name: string;
  personnel: Personnel[];
  feedback: string | null;
  rating: number | null;
  status: string;
  requested_by: RequestedBy;
  date_requested: string;
  date_completed: string | null;
}

export interface AccomplishmentResponse {
  isSuccess: boolean;
  message: string;
  data: Accomplishment[];
}
