import Link from "next/link";
import { Youtube, Instagram, Music2 } from "lucide-react";

export default function FooterHero() {
  return (
    <section className="bg-brand-orange py-32 relative overflow-hidden">
      {/* Green Banner */}
      <div className="absolute top-0 left-0 right-0 bg-[#98FB98] py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs font-bold text-black mx-8 tracking-widest">
              HIRING AMBASSADORS
            </span>
          ))}
        </div>
      </div>

      <div className="container text-center pt-12">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 leading-tight tracking-tight">
          Try RecipeAI for free<br />
          on iOS and Android
        </h2>

        <Link href="#" className="inline-block mb-32">
          <button className="bg-black text-white font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-xl cursor-pointer">
            Get the App
          </button>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-white/90 text-sm font-bold pt-12 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-t-2 border-black rounded-full"></div>
            </div>
            <span>© RecipeAI 2025 - All right reserved</span>
          </div>

          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Ambassador Program</Link>
            <Link href="#" className="hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Music2 className="w-5 h-5 text-white" />
            </Link>
            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </Link>
            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Youtube className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
