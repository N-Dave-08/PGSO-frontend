import { ApiService } from "../api-service";
import { AdminReportsResponse } from "@/types/admin-reports";

/**
 * Service for managing admin reports data
 */
export class AdminReportsService extends ApiService {
  constructor() {
    super("/request/admin");
  }

  /**
   * Get all reports for admin
   */
  async getReports(): Promise<AdminReportsResponse> {
    return this.get<AdminReportsResponse>("/reports");
  }
}
