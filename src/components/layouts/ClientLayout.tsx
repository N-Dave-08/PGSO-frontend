"use client"

import UserSidebar from "@/components/sidebars/UserSidebar"
import { useAuth } from "@/hooks/use-auth"

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const {isAuthenticated} = useAuth()



  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center w-full">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full">
      {isAuthenticated && <UserSidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}