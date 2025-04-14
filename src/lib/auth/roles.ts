export type UserRole = "admin" | "head" | "personnel" | "staff";

export interface RoleAccess {
  [key: string]: UserRole[];
}

// Define route access by role
export const ROUTE_ACCESS: RoleAccess = {
  "/dashboard": ["admin", "head", "personnel", "staff"],
  "/users": ["admin"],
  "/divisions": ["admin", "head"],
  "/departments": ["admin", "head"],
  "/staffs": ["admin", "head"],
  "/tasks": ["personnel"],
  "/requests": ["admin", "head", "staff"],
  "/audits": ["admin"],
  "/settings": ["admin", "head", "staff"],
  "/calendar": ["admin", "head", "personnel", "staff"],
  "/feedback": ["admin"],
  "/profile": ["admin", "head", "personnel", "staff"],
};

export const hasAccess = (
  userRole: UserRole | null,
  allowedRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (
  userRole: UserRole | null,
  path: string
): boolean => {
  const allowedRoles = ROUTE_ACCESS[path];
  if (!allowedRoles) return true; // If route is not defined in ROUTE_ACCESS, allow access
  return hasAccess(userRole, allowedRoles);
};
