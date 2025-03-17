"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/sidebars/user-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/loader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reset states when auth changes
    setLoading(true);
    setVisible(false);

    // First delay for loader
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      // Second delay for fade-in
      const visibilityTimeout = setTimeout(() => {
        setVisible(true);
      }, 300);
      return () => clearTimeout(visibilityTimeout);
    }, 500);

    return () => clearTimeout(loadingTimeout);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div
        className={`transition-opacity duration-300 w-full ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex w-full">
          {isAuthenticated && <UserSidebar />}
          <main className={`w-full ${isAuthenticated ? "p-6" : ""}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
