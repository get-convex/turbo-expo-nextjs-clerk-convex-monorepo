"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white">
          <ChefHat className="h-8 w-8" strokeWidth={2.5} />
          <span className="font-display text-2xl font-bold tracking-tight">Recify</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-white/90">
            <Link href="#" className="hover:text-white transition-colors">AMBASSADORS</Link>
            <Link href="#" className="hover:text-white transition-colors">HIRING AMBASSADORS</Link>
          </nav>

          <Link
            href="#"
            className="bg-white text-brand-orange font-bold px-6 py-2.5 rounded-full text-sm hover:scale-105 transition-transform"
          >
            Get the App
          </Link>
        </div>
      </div>
    </header>
  );
}
