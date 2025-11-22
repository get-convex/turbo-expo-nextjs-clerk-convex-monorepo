import Header from "@/components/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import FooterHero from "@/components/home/FooterHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-beige">
      <Header />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FooterHero />
    </main>
  );
}
