"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";

export default function Layout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
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

  const renderContent = () => {
    if (role === "admin") {
      return admin;
    }
    return null;
  };

  return (
    <>
      {children}
      {renderContent()}
    </>
  );
}
