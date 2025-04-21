import { RequestService } from "./request-service";
import { CategoryService } from "./category-service";
import { DashboardService } from "./dashboard-service";

/**
 * API service instances
 */
export const apiServices = {
  requests: new RequestService(),
  categories: new CategoryService(),
  dashboard: new DashboardService(),
};

/**
 * Export individual services
 */
export { RequestService } from "./request-service";
export { CategoryService } from "./category-service";
export { DashboardService } from "./dashboard-service";

/**
 * Default export all services
 */
export default apiServices;
