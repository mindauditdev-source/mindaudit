import { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce a MindAudit® Spain SLP. Nuestra misión, valores y el equipo de profesionales dedicados a la excelencia en auditoría y consultoría tecnológica.',
};

export default function SobreNosotrosPage() {
  return <AboutContent />;
}
