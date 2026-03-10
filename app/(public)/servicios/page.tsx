import { Metadata } from 'next';
import { ServicesSection } from '@/components/landing/ServicesSection';

export const metadata: Metadata = {
  title: 'Servicios de Auditoría',
  description: 'Descubre nuestra gama de servicios de auditoría profesional: auditoría de cuentas, consultoría financiera y soluciones tecnológicas avanzadas para empresas.',
};

export default function ServicesPage() {
  return <ServicesSection />;
}
