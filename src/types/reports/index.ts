export interface ReportPersonnel {
  id: number;
  name: string;
  is_team_lead?: boolean;
  team_lead_id?: number;
}

export interface ReportRequestedBy {
  id: number;
  first_name: string;
  last_name: string;
  department?: string;
  division?: string;
  division_location?: string;
}

export interface ReportRequest {
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
  team_lead: { id: number; first_name: string; last_name: string } | null;
  personnel: ReportPersonnel[];
  feedback: string | null;
  rating: number | null;
  status: string;
  requested_by: ReportRequestedBy;
  date_requested: string;
  date_completed: string | null;
  note: string | null;
}

export interface ReportsResponse {
  isSuccess: boolean;
  message: string;
  requests: ReportRequest[];
}
