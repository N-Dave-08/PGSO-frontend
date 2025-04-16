"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasAccess } from "@/lib/auth/roles";

interface LayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
}

export default function Layout({ children, admin }: LayoutProps) {
  const { role } = useAuth();

  const renderContent = () => {
    if (hasAccess(role, ["admin"])) return admin;
    return null;
  };

  return (
    <>
      {children}
      {renderContent()}
    </>
  );
}
