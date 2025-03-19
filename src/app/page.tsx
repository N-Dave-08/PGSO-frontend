"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeaturesSection } from "@/components/sections/features-section";
import { SwirlBackground } from "@/components/backgrounds/swirl-bg";

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

      <main className="flex-1 relative z-10">
        {/* Hero Section */}

        {/* Feature Cards */}
        <FeaturesSection />
      </main>
    </div>
  );
}
