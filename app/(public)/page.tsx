import Image from 'next/image';
import { Hero } from '@/components/landing/Hero';
import { ServicesLandingSection } from '@/components/landing/ServicesLandingSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { FAQ } from '@/components/landing/FAQ';
import { CTASection } from '@/components/landing/CTASection';
import { CareersCTA } from '@/components/landing/CareersCTA';

export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* Nueva Sección: Infografía */}
      <section className="pt-60 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 p-4 md:p-12 bg-slate-50/30">
            <div className="relative aspect-video w-full">
              <Image
                src="/Infografía MindAudit.png"
                alt="Infografía MindAudit"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <ServicesLandingSection />
      <WhyChooseUs />
      <TrustedBy />
      <FAQ />
      <CTASection />
      <CareersCTA />
    </>
  );
}
