import { ApiService } from "../api-service";
import {
  DashboardCategoriesResponse,
  DashboardStatusResponse,
  DashboardMonthlyResponse,
  DashboardManpowerResponse,
  DashboardSummaryResponse,
} from "@/types";

/**
 * Service for managing dashboard data
 */
export class DashboardService extends ApiService {
  constructor() {
    super("/dashboard");
  }

  /**
   * Get requests by category statistics
   */
  async getRequestsByCategory(): Promise<DashboardCategoriesResponse> {
    const response = await this.get<DashboardCategoriesResponse>(
      "requests-by-category"
    );
    return {
      isSuccess: response?.isSuccess ?? false,
      categories: response?.categories ?? [],
    };
  }

  /**
   * Get requests by status statistics
   */
  async getRequestsByStatus(): Promise<DashboardStatusResponse> {
    const response = await this.get<DashboardStatusResponse>(
      "requests-by-status"
    );
    return {
      isSuccess: response?.isSuccess ?? false,
      requests_by_status: response?.requests_by_status ?? {},
    };
  }

  /**
   * Get monthly requests statistics
   */
  async getMonthlyRequests(): Promise<DashboardMonthlyResponse> {
    const response = await this.get<DashboardMonthlyResponse>(
      "monthly-requests"
    );
    return {
      isSuccess: response?.isSuccess ?? false,
      monthly_requests: response?.monthly_requests ?? {},
    };
  }

  /**
   * Get manpower by category statistics
   */
  async getManpowerByCategory(): Promise<DashboardManpowerResponse> {
    const response = await this.get<DashboardManpowerResponse>(
      "manpower-by-category"
    );
    return {
      isSuccess: response?.isSuccess ?? false,
      manpower_by_category: response?.manpower_by_category ?? [],
    };
  }

  /**
   * Get complete dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const response = await this.get<DashboardSummaryResponse>("summary");
    return {
      isSuccess: response?.isSuccess ?? false,
      total_requests_by_category: response?.total_requests_by_category ?? [],
      total_requests_by_status: response?.total_requests_by_status ?? {},
      monthly_requests: response?.monthly_requests ?? {},
      manpower_stats: response?.manpower_stats ?? [],
    };
  }
}
