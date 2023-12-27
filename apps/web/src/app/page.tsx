import Header from "@/components/Header";
import Benefits from "@/components/home/Benefits";
import Footer from "@/components/home/Footer";
import FooterHero from "@/components/home/FooterHero";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Benefits />
      <Testimonials />
      <FooterHero />
      <Footer />
    </main>
  );
}
