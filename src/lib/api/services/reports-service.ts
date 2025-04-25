import { ApiService } from "../api-service";
import { ReportsResponse } from "@/types/reports";

/**
 * Service for managing reports data
 */
export class ReportsService extends ApiService {
  constructor() {
    super("/request/head");
  }

  /**
   * Get all reports for head
   */
  async getReports(): Promise<ReportsResponse> {
    return this.get<ReportsResponse>("/reports");
  }
}
