import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-surface rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary">AI-Powered Recipe Management</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 animate-slide-up text-text-primary leading-[0.95]">
            Cook with
            <br />
            <span className="text-accent">Intelligence</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            RecipeAI transforms how you discover, save, and perfect your recipes. Paste from anywhere, adapt with AI, track every variation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/recipes">
              <button className="btn-primary flex items-center gap-2 group text-lg">
                Start Cooking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#features">
              <button className="btn-ghost text-lg">
                See How It Works
              </button>
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {["Instant AI Extraction", "Recipe Variations", "Import from Anywhere"].map((feature, index) => (
              <div
                key={feature}
                className="px-5 py-2.5 rounded-full bg-white border border-border text-sm text-text-secondary"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Element - Recipe Card Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-scale-in" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-3xl blur-2xl" />

            {/* Main preview card */}
            <div className="relative card bg-white/80 backdrop-blur-sm p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Recipe info */}
                <div>
                  <div className="inline-flex px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-display font-bold mb-4">
                    AI Extracted
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-3 text-text-primary">
                    Homemade Pasta Carbonara
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Classic Italian pasta dish with crispy pancetta, eggs, and Pecorino Romano.
                  </p>
                  <div className="flex gap-4 text-sm text-text-secondary">
                    <div>
                      <div className="font-display font-bold text-text-primary">30 min</div>
                      <div>Total Time</div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-text-primary">4</div>
                      <div>Servings</div>
                    </div>
                  </div>
                </div>

                {/* Right: Sample ingredients */}
                <div>
                  <h4 className="font-display font-bold text-lg mb-4 text-text-primary">Ingredients</h4>
                  <div className="space-y-3">
                    {[
                      { amount: "400g", item: "Spaghetti" },
                      { amount: "200g", item: "Pancetta, diced" },
                      { amount: "4", item: "Large eggs" },
                      { amount: "100g", item: "Pecorino Romano" },
                    ].map((ingredient, i) => (
                      <div key={i} className="flex items-center gap-3 text-text-secondary">
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        <span className="font-medium text-text-primary">{ingredient.amount}</span>
                        <span>{ingredient.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
