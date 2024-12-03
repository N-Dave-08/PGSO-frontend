"use client"

import { useEffect, useState } from "react"
import UserSidebar from "@/components/sidebars/UserSidebar"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isValidRoute, setIsValidRoute] = useState<boolean>(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  useEffect(() => {
    const validRoutes = [
      '/',
      '/dashboard',
      '/audits',
      '/calendar',
      '/categories',
      '/departments',
      '/divisions',
      '/feedback',
      '/profile',
      '/requests',
      '/settings',
      '/staffs',
      '/tasks',
      '/users',
    ]

    const isValid = validRoutes.some(route =>
      pathname === route ||
      (pathname.startsWith(route + '/') && route !== '/')
    )

    setIsValidRoute(isValid)

  }, [pathname])

  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center w-full">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && isValidRoute && <UserSidebar />}
      {isValidRoute ? (
        children
      ) : (
        <div className="h-screen flex items-center justify-center w-full flex-col gap-4">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      )}
    </>
  );
}