import { ApiService } from "../api-service";
import { StaffResponse } from "@/types/staffs";

/**
 * Service for managing staff data
 */
export class StaffService extends ApiService {
  constructor() {
    super("/admin/department");
  }

  /**
   * Get all staff
   */
  async getStaff(): Promise<StaffResponse> {
    return this.post<StaffResponse>("/staff");
  }
}
