export interface ReportPersonnel {
  id: number;
  name: string;
  email: string;
}

export interface ReportTeamLead {
  id: number;
  full_name: string;
  email: string;
}

export interface ReportRequestedBy {
  id: number;
  full_name: string;
  division: string;
  department: string;
  department_acronym: string;
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
  personnel: ReportPersonnel[];
  team_lead: ReportTeamLead | null;
  feedback: string | null;
  rating: number | null;
  status: string;
  requested_by: ReportRequestedBy;
  date_requested: string;
  date_completed: string | null;
}

export interface ReportsResponse {
  isSuccess: boolean;
  message: string;
  requests: ReportRequest[];
}
