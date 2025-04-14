"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";

export default function Users() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUser = await secureStorage.get("user");
        const storedRole = await secureStorage.get("role");

        if (!storedUser) {
          router.push("/");
          return;
        }

        if (storedRole !== "admin") {
          router.back();
          return;
        }

        setUser(storedUser);
      } catch (error) {
        console.error("Error retrieving user data:", error);
        router.push("/");
      }
    };

    initializeData();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users Page</h1>
    </div>
  );
}
