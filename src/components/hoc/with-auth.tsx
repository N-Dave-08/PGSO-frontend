import { useProtectedRoute } from "@/hooks/use-protected-route";
import type { UserRole } from "@/lib/auth/roles";
interface WithAuthProps {
  allowedRoles?: UserRole[];
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles }: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { isLoading, user } = useProtectedRoute(allowedRoles);

    if (isLoading) {
      return <></>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
