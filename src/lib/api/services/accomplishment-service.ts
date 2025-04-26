import { ApiService } from "../api-service";
import { AccomplishmentResponse } from "@/types";

/**
 * Service for managing accomplishment data
 */
export class AccomplishmentService extends ApiService {
  constructor() {
    super("/request");
  }

  /**
   * Get all reports for head
   */
  async getAccomplishments(): Promise<AccomplishmentResponse> {
    return this.get<AccomplishmentResponse>("/accomplishment");
  }
}
