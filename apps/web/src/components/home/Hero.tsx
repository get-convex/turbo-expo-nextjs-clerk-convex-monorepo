import Link from "next/link";
import { Star, ChefHat } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-brand-orange pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            All your favorite recipes, finally in one place.
          </h1>

          <Link href="#" className="inline-block">
            <button className="bg-black text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-xl cursor-pointer">
              Get the App
            </button>
          </Link>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-white">
                <span className="text-3xl font-bold">4.9</span>
                <span className="text-xl opacity-80">/5</span>
              </div>
              <div className="flex gap-1 text-white my-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="fill-white w-4 h-4" />
                ))}
              </div>
              <span className="text-white/80 text-sm font-medium">Average rating</span>
            </div>

            <div className="w-px h-12 bg-white/20"></div>

            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">+100K</span>
              <span className="text-white/80 text-sm font-medium mt-1">Imported recipes</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center lg:justify-end">
          {/* CSS Phone Mockup */}
          <div className="relative w-[320px] h-[650px] bg-black rounded-[50px] border-[12px] border-black shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-2xl z-20"></div>
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar">
              {/* Mock App UI */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold font-display text-black">RecipeAI</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-gray p-4 rounded-2xl space-y-2">
                    <div className="text-xs text-gray-500">All recipes</div>
                    <div className="font-bold text-xl text-black">42 recipes</div>
                    <div className="flex -space-x-2 pt-2">
                      <div className="w-8 h-8 rounded-full bg-red-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white"></div>
                    </div>
                  </div>
                  <div className="bg-brand-gray p-4 rounded-2xl space-y-2">
                    <div className="text-xs text-gray-500">Breakfast</div>
                    <div className="font-bold text-xl text-black">8 recipes</div>
                    <div className="w-full h-12 bg-yellow-100 rounded-lg mt-2"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0"></div>
                      <div>
                        <div className="font-bold text-black">Delicious Recipe {i}</div>
                        <div className="text-xs text-gray-500">20 mins • Easy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none text-black">
        <ChefHat size={600} />
      </div>
    </section>
  );
}
