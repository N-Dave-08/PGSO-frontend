"use client";

import UserSidebar from "@/components/sidebars/user-sidebar";
import { useAuth } from "@/hooks/use-auth";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      {isAuthenticated && <UserSidebar />}
      <main className={`flex-1 ${isAuthenticated ? "p-6" : ""}`}>
        {children}
      </main>
    </div>
  );
}
