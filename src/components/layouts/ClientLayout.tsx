"use client"

import { useEffect, useState } from "react"
import UserSidebar from "@/components/sidebars/UserSidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

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

  // useEffect(() => {
  //   const validRoutes = [
  //     '/',
  //     '/dashboard',
  //     '/audits',
  //     '/calendar',
  //     '/categories',
  //     '/departments',
  //     '/divisions',
  //     '/feedback',
  //     '/profile',
  //     '/requests',
  //     '/settings',
  //     '/staffs',
  //     '/tasks',
  //     '/users',
  //   ]

    // const isValid = validRoutes.some(route =>
    //   pathname === route ||
    //   (pathname.startsWith(route + '/') && route !== '/')
    // )

  //   setIsValidRoute(isValid)

  // }, [pathname])

  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center w-full">Loading...</div>;
  }

  return (
    <>
      {
        isAuthenticated ? <UserSidebar /> : ""
      }

      {children}
      
    </>
  );
}