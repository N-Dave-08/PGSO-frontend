"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/navbars/Navbar";
import Footer from "@/components/sections/Footer";
import { FeaturesSection } from "@/components/sections/FeaturesSection";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Feature Cards */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
