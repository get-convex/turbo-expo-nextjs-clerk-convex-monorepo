'use client';

import Header from '@/components/Header';
import Benefits from '@/components/home/Benefits';
import Footer from '@/components/home/Footer';
import FooterHero from '@/components/home/FooterHero';
import Hero from '@/components/home/Hero';
import Testimonials from '@/components/home/Testimonials';
import { api, useQuery } from '@notes/db';

export default function Home() {
  const tasks = useQuery(api.notes.getNotes, {});
  console.log({ tasks });

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
