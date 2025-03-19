import { RequestService } from "./request-service";
import { CategoryService } from "./category-service";

/**
 * API service instances
 */
export const apiServices = {
  requests: new RequestService(),
  categories: new CategoryService(),
};

/**
 * Export individual services
 */
export { RequestService } from "./request-service";
export { CategoryService } from "./category-service";

/**
 * Default export all services
 */
export default apiServices;
