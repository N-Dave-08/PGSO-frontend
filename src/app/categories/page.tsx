"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function Categories() {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <div>
      <h1 className="text-lg font-bold">Categories</h1>
      <p className="text-sm">Exploring Diversity in Every Segment</p>
    </div>
  );
}
