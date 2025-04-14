"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { secureStorage } from "@/lib/utils/encryption";

interface LayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  head: React.ReactNode;
  personnel: React.ReactNode;
  staff: React.ReactNode;
}
interface UserType {
  id: number;
  email: string;
}

export default function Layout({
  children,
  admin,
  head,
  personnel,
  staff,
}: LayoutProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedRole = await secureStorage.get("role");
        const storedUser = await secureStorage.get("user");

        setRole(storedRole);
        if (storedUser) {
          setUser(storedUser);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        router.push("/");
      }
    };

    initializeUser();
  }, [router]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isAuthorized = (allowedRoles: string[]) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const renderContent = () => {
    switch (role) {
      case "admin":
        return isAuthorized(["admin"]) ? admin : null;
      case "head":
        return isAuthorized(["head"]) ? head : null;
      case "personnel":
        return isAuthorized(["personnel"]) ? personnel : null;
      case "staff":
        return isAuthorized(["staff"]) ? staff : null;
      default:
        return null;
    }
  };

  return (
    <>
      {children}
      {renderContent()}
    </>
  );
}
