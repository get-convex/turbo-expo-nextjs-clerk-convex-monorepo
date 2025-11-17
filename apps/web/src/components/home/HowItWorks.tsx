import { Copy, Sparkles, ChefHat, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Copy,
    title: "Paste or Import",
    description: "Copy any recipe from anywhere or import from your favorite sites",
  },
  {
    number: 2,
    icon: Sparkles,
    title: "AI Extracts",
    description: "Our AI instantly structures ingredients and instructions perfectly",
  },
  {
    number: 3,
    icon: ChefHat,
    title: "Cook & Adapt",
    description: "Follow along, make changes, and let AI suggest improvements",
  },
  {
    number: 4,
    icon: TrendingUp,
    title: "Track Progress",
    description: "Save variations, rate results, and perfect recipes over time",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary">
            From discovery to mastery in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent -z-10" />
                )}

                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-accent/20 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-accent" strokeWidth={2} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
