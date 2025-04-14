import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./use-auth";
import { canAccessRoute } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";

export function useProtectedRoute(allowedRoles?: UserRole[]) {
  const { isAuthenticated, user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    if (allowedRoles && !canAccessRoute(role, pathname)) {
      router.back();
      return;
    }
  }, [isAuthenticated, user, role, router, pathname, isLoading, allowedRoles]);

  return { isAuthenticated, user, role, isLoading };
}
