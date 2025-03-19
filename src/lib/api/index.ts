/**
 * API Services
 */
import apiServices from "./services";

/**
 * Core API utilities
 */
import api, { getAuthHeaders, handleApiError } from "./axios";

/**
 * Re-export services
 */
export * from "./services";

/**
 * Core API client
 */
export { api, getAuthHeaders, handleApiError };

/**
 * Default export API services
 */
export default apiServices;
