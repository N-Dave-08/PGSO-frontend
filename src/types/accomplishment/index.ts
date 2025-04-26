export interface AccomplishmentPersonnel {
  id: number;
  name: string;
  email: string;
}

export interface AccomplishmentRequestedBy {
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
  personnel: AccomplishmentPersonnel[];
  feedback: string | null;
  rating: number | null;
  status: string;
  requested_by: AccomplishmentRequestedBy;
  date_requested: string;
  date_completed: string | null;
}

export interface AccomplishmentResponse {
  isSuccess: boolean;
  message: string;
  data: Accomplishment[];
}
