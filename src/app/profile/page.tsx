"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";

export default function Profile() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUser = await secureStorage.get("user");
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

    initializeData();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Profile</h1>
    </div>
  );
}
