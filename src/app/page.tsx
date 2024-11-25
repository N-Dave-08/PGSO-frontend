import Hero from "@/components/sections/Hero";
import Navbar from "@/components/Navbar";
import Capabilities from "@/components/sections/Capabilities";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative">
        <Hero />
        <Capabilities />
        <Process />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
