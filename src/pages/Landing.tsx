import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-blue selection:text-white">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}