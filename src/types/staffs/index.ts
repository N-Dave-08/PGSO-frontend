export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface StaffResponse {
  isSuccess: boolean;
  message: string;
  staff: Staff[];
}
