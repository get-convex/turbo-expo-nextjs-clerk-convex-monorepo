"use client";

import Header from "@/components/Header";
import Benefits from "@/components/home/Benefits";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />

      {/* Simple CTA Footer */}
      <section className="py-20 md:py-32 bg-accent text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Start Cooking Smarter Today
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of home cooks using AI to perfect their recipes
          </p>
          <Link href="/recipes">
            <button className="bg-white text-accent font-display font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container text-center text-text-secondary">
          <p className="text-sm">
            © 2024 RecipeAI. Built with love for home cooks.
          </p>
        </div>
      </footer>
    </main>
  );
}
