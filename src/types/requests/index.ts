export interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
  division: string;
  department: string;
  office_location: string;
}

export interface RequestPersonnel {
  id: number;
  name: string;
}

export interface Request {
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
  note: string | null;
  personnel: RequestPersonnel[];
  feedback: string | null;
  rating: number | null;
  status: string;
  date_requested: string;
  date_completed: string | null;
  requested_by: RequestedBy;
}

export interface CreateRequestData {
  request_title: string;
  description: string;
  file_path?: File;
  category_id?: number;
}

export interface CreateRequestResponse {
  isSuccess: boolean;
  message: string;
  request: Request;
}

export interface AssessRequestData {
  category_id: number;
  personnel_ids: number[];
  status?: string;
  remarks?: string;
}

export interface RequestStatusResponse {
  isSuccess: boolean;
  message: string;
  request: {
    id: number;
    control_no: string;
    status: string;
    note: string | null;
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
      division: string;
      office_location: string;
    };
    date_rejected?: string;
  };
}
