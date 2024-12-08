'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/navbars/Navbar";
import Capabilities from "@/components/sections/Capabilities";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      router.push('/dashboard')
    }
  }, [router])


  return (
    <main className="min-h-screen">test
      <Navbar />
      <Hero />
      <Capabilities />
      <Process />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
