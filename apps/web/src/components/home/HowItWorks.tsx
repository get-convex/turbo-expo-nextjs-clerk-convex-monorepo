import { Link2, Clipboard, Bookmark } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-32 bg-brand-beige">
      <div className="container text-center space-y-16">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-brand-black tracking-tight">Just save it</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Found it on Instagram? Pinned it last month? Just save it in RecipeAI and never lose it again.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-8 text-left hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-brand-blue-light rounded-2xl flex items-center justify-center shrink-0">
              <Link2 className="w-10 h-10 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">Copy the recipe link from anywhere</span>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-8 text-left hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-brand-orange-light rounded-2xl flex items-center justify-center shrink-0">
              <Clipboard className="w-10 h-10 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">Paste the link in RecipeAI</span>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-8 text-left hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-brand-purple-light rounded-2xl flex items-center justify-center shrink-0">
              <Bookmark className="w-10 h-10 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">Recipe saved and organized</span>
          </div>
        </div>
      </div>
    </section>
  );
}
