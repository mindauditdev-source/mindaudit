import { Hero } from '@/components/landing/Hero';
import { Accreditations } from '@/components/landing/Accreditations';
import { ServicesLandingSection } from '@/components/landing/ServicesLandingSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Accreditations />
      <ServicesLandingSection />
      <WhyChooseUs />
      <TrustedBy />
      <CTASection />
    </>
  );
}
