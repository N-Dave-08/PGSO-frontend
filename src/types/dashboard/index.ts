export interface DashboardCategoryData {
  id: number;
  category_name: string;
  description: string;
  requests_count: number;
  created_at: string;
  updated_at: string;
  is_archived: number;
}

export interface DashboardCategoriesResponse {
  isSuccess: boolean;
  categories: DashboardCategoryData[];
}

export interface RequestsByStatus {
  [key: string]: number;
}

export interface DashboardStatusResponse {
  isSuccess: boolean;
  requests_by_status: RequestsByStatus;
}

export interface MonthlyRequests {
  [key: string]: number;
}

export interface DashboardMonthlyResponse {
  isSuccess: boolean;
  monthly_requests: MonthlyRequests;
}

export interface ManpowerCategoryData extends DashboardCategoryData {
  personnel_count: number;
}

export interface DashboardManpowerResponse {
  isSuccess: boolean;
  manpower_by_category: ManpowerCategoryData[];
}

export interface ManpowerStat {
  category_name: string;
  manpower_count: number;
}

export interface DashboardSummaryResponse {
  isSuccess: boolean;
  total_requests_by_category: DashboardCategoryData[];
  total_requests_by_status: RequestsByStatus;
  monthly_requests: MonthlyRequests;
  manpower_stats: ManpowerStat[];
}
