"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { secureStorage } from "@/lib/utils/encryption";
import { LoginUser } from "@/types/auth";

export default function Layout({
  children,
  admin,
  head,
  personnel,
  staff,
}: {
  children?: React.ReactNode;
  admin?: React.ReactNode;
  head?: React.ReactNode;
  personnel?: React.ReactNode;
  staff?: React.ReactNode;
}) {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUser = await secureStorage.get("user");
        const storedRole = await secureStorage.get("role");

        if (storedUser && storedRole) {
          setUser(storedUser);
          setRole(storedRole);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        router.push("/");
      }
    };

    initializeData();
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
