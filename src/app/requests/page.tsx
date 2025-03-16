"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { secureStorage } from "@/lib/utils/encryption";

export default function Requests() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await secureStorage.get("user");
        const userRole = localStorage.getItem("role");

        if (!storedUser) {
          router.push("/");
          return;
        }

        if (
          userRole !== "admin" &&
          userRole !== "head" &&
          userRole !== "staff"
        ) {
          router.back();
          return;
        }

        setUser(storedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Requests</h1>
      <p className="text-sm">Streamlining Your Needs Efficiently</p>
    </div>
  );
}
