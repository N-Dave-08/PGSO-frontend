"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasAccess } from "@/lib/auth/roles";

interface LayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  head: React.ReactNode;
  staff: React.ReactNode;
  personnel: React.ReactNode;
}

export default function Layout({
  children,
  admin,
  head,
  staff,
  personnel,
}: LayoutProps) {
  const { role } = useAuth();

  const renderContent = () => {
    if (hasAccess(role, ["admin"])) return admin;
    if (hasAccess(role, ["head"])) return head;
    if (hasAccess(role, ["staff"])) return staff;
    if (hasAccess(role, ["personnel"])) return personnel;
    return null;
  };

  return (
    <main className="w-full">
      {children}
      {renderContent()}
    </main>
  );
}
