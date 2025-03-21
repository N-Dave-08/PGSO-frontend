"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/types/auth";

export default function Users() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userRole = localStorage.getItem("role");

    if (!storedUser) {
      router.push("/");
      return;
    }

    if (userRole !== "admin") {
      router.back();
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }
}
