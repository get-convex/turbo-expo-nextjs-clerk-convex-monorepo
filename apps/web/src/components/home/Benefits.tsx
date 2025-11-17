import { Brain, Zap, History, Globe } from "lucide-react";

const features = [
  {
    title: "AI-Powered Extraction",
    description: "Paste any recipe and watch AI instantly parse ingredients and instructions with perfect accuracy.",
    icon: Brain,
  },
  {
    title: "Instant Import",
    description: "Save recipes from YouTube, Instagram, or any website with a single click.",
    icon: Globe,
  },
  {
    title: "Smart Variations",
    description: "Track every cooking session. AI helps you modify and improve recipes over time.",
    icon: Zap,
  },
  {
    title: "Version History",
    description: "Never lose a great modification. Every variation is saved with notes and ratings.",
    icon: History,
  },
];

const Benefits = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
            Why RecipeAI?
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Intelligent features that transform how you cook
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card group hover:shadow-xl transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-accent" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
