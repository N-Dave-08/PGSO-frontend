"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userRole = localStorage.getItem("role");

    if (!storedUser) {
      router.push("/");
      return;
    }

    if (userRole !== "personnel") {
      router.back();
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Feedback</h1>
      <p className="text-sm">under development</p>
    </div>
  );
}
