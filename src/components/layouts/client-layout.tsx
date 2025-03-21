"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/sidebars/user-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/loaders/loader";
import MobileNav from "@/components/ui/mobile-nav";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reset visibility when auth changes
    setVisible(false);

    // Set visible immediately after component mounts
    // or when auth state changes
    const visibilityTimeout = setTimeout(() => {
      setVisible(true);
    }, 10); // Minimal delay to ensure state update occurs after render

    return () => clearTimeout(visibilityTimeout);
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen w-full">
      <div
        className={`transition-opacity duration-300 w-full ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex w-full">
          {isAuthenticated && <UserSidebar />}
          <main
            className={`w-full ${isAuthenticated ? "p-6 pb-20 md:pb-6" : ""}`}
          >
            {children}
          </main>
        </div>
        {isAuthenticated && <MobileNav />}
      </div>
    </div>
  );
}
