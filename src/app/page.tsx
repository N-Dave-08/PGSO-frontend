"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeaturesSection } from "@/components/sections/features-section";
import { SwirlBackground } from "@/components/backgrounds/swirl-bg";
import Navbar from "@/components/navbars/navbar";
import Hero from "@/components/sections/hero";
import Footer from "@/components/sections/footer";

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
      <SwirlBackground particleCount={700} baseHue={10} rangeHue={30} />

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
