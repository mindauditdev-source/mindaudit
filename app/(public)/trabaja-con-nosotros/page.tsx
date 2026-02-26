import { CareersSection } from '@/components/landing/CareersSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trabaja con Nosotros | MindAudit® Spain',
  description: 'Únete a nuestro equipo de auditores y expertos en tecnología. Buscamos talento apasionado por la transparencia financiera.',
};

export default function TrabajaConNosotrosPage() {
  return (
    <div className="pt-20">
      <CareersSection />
    </div>
  );
}
