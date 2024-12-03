"use client"

import { useEffect, useState } from "react";
import UserSidebar from "@/components/sidebars/UserSidebar";
import { usePathname, useRouter } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);

    // Add custom event listener for auth changes
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Handle loading state
  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center w-full">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && <UserSidebar />}
      {children}
    </>
  );
}