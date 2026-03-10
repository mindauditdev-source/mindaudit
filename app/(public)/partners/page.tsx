import { Metadata } from 'next';
import { PartnersContent } from '@/components/partners/PartnersContent';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Únete a nuestra red de partners. Colabora con MindAudit® Spain SLP para ofrecer servicios de auditoría de alta calidad.',
};

export default function PartnersPage() {
  return <PartnersContent />;
}
