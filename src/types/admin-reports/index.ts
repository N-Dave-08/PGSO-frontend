export interface AdminReportPersonnel {
  id: number;
  name: string;
  email: string;
}

export interface AdminReportTeamLead {
  id: number;
  full_name: string;
  email: string;
}

export interface AdminReportRequestedBy {
  id: number;
  full_name: string;
  division: string;
  department: string | null;
}

export interface AdminReportRequest {
  id: number;
  control_no: string;
  request_title: string;
  description: string;
  file_path: string | null;
  file_url: string | null;
  file_completion: string | null;
  file_completion_url: string | null;
  category_id: number | null;
  category_name: string | null;
  personnel: AdminReportPersonnel[];
  team_lead: AdminReportTeamLead | null;
  feedback: string | null;
  rating: number | null;
  status: string;
  requested_by: AdminReportRequestedBy;
  date_requested: string;
  date_completed: string | null;
}

export interface AdminReportsResponse {
  isSuccess: boolean;
  message: string;
  data: AdminReportRequest[];
}
