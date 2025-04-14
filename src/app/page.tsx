"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeaturesSection } from "@/components/sections/features-section";
import Navbar from "@/components/navbars/navbar";
import Hero from "@/components/sections/hero";
import Footer from "@/components/sections/footer";
import { secureStorage } from "@/lib/utils/encryption";
import DiagonalPatternBg from "@/components/backgrounds/diagonal-pattern-bg";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await secureStorage.get("user");
        if (user) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <DiagonalPatternBg />
      </div>

      {/* Header */}
      <Navbar />

      <main className="flex-1 relative z-10">
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
