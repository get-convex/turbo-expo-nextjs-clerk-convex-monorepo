"use client";

import Header from "@/components/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-beige">
      <Header />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
