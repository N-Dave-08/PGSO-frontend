"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function Categories() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const userRole = localStorage.getItem("role");

      if (!storedUser) {
        router.replace("/");
        return;
      }

      if (userRole !== "admin") {
        router.back();
        return;
      }

      // Parse user data safely
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        router.replace("/");
      }
    } catch (e) {
      console.error("Error in categories page:", e);
      setError("An error occurred while loading the page");
    }
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-gray-600">Exploring Diversity in Every Segment</p>
    </div>
  );
}
