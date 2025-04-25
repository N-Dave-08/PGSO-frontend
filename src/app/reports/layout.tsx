"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasAccess } from "@/lib/auth/roles";

interface LayoutProps {
  children: React.ReactNode;
  head: React.ReactNode;
}

export default function Layout({ children, head }: LayoutProps) {
  const { role } = useAuth();

  const renderContent = () => {
    if (hasAccess(role, ["head"])) return head;
    return null;
  };

  return (
    <main className="w-full">
      {children}
      {renderContent()}
    </main>
  );
}
