"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { secureStorage } from "@/lib/utils/encryption";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
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
        console.error("Error retrieving dashboard data:", error);
        router.push("/");
      }
    };

    initializeDashboard();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Dashboard, {user.email}
      </h1>
      <p>Your role is: {role}</p>
    </div>
  );
}
