import { Hero } from '@/components/landing/Hero';
import { Accreditations } from '@/components/landing/Accreditations';
import { ServicesLandingSection } from '@/components/landing/ServicesLandingSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { TrustpilotSection } from '@/components/landing/TrustpilotSection';
import { FAQ } from '@/components/landing/FAQ';
import { CTASection } from '@/components/landing/CTASection';
import { CareersCTA } from '@/components/landing/CareersCTA';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Accreditations />
      <ServicesLandingSection />
      <WhyChooseUs />
      <TrustedBy />
      <TrustpilotSection />
      <FAQ />
      <CTASection />
      <CareersCTA />
    </>
  );
}
