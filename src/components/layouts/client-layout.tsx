"use client";

import UserSidebar from "@/components/sidebars/user-sidebar";
import { useAuth } from "@/hooks/use-auth";
import MobileNav from "@/components/ui/mobile-nav";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full">
        {isAuthenticated && <UserSidebar />}
        <main className={`w-full ${isAuthenticated ? "p-6" : ""}`}>
          {children}
        </main>
      </div>
      {isAuthenticated && <MobileNav />}
    </div>
  );
}
