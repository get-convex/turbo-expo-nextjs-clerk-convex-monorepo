"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "On which devices can I use RecipeAI?",
    answer: "RecipeAI is available on iOS, Android, and Web. Your recipes sync instantly across all your devices."
  },
  {
    question: "Where can I save recipes from?",
    answer: "You can save recipes from any website, Instagram, TikTok, YouTube, and more. Just paste the link!"
  },
  {
    question: "Is RecipeAI free to use?",
    answer: "Yes! RecipeAI is free to download and use. We also offer a premium subscription for advanced AI features."
  },
  {
    question: "Can I edit a recipe after saving it?",
    answer: "Absolutely. You can edit ingredients, instructions, and even use AI to modify the recipe to your taste."
  },
  {
    question: "How can I customize my collections?",
    answer: "You can create unlimited collections, add custom covers, and organize your recipes exactly how you want."
  },
  {
    question: "Can I share recipes with friends?",
    answer: "Yes, you can easily share recipes or entire collections with friends and family."
  },
  {
    question: "Can I access my recipes on multiple devices?",
    answer: "Yes, your account syncs across all devices where you're logged in."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-brand-beige">
      <div className="container max-w-3xl">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-brand-black tracking-tight">
          Any question?
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl font-bold text-black">{faq.question}</span>
                <Plus
                  className={`w-6 h-6 text-black transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="p-6 pt-0 text-gray-600 text-lg leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="#" className="text-black font-bold underline underline-offset-4 hover:text-brand-orange transition-colors">
            Need help? Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
