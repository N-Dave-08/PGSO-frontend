"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function Layout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/");
    }
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
