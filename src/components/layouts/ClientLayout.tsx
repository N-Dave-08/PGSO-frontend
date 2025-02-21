"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/sidebars/UserSidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/loader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500); // 0.5 second delay
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  if (loading || isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {isAuthenticated && <UserSidebar />}
      <main className={`${isAuthenticated ? "ml-[16rem]" : ""} flex-1 overflow-x-hidden`}>
        {children}
      </main>
    </div>
  );
}
