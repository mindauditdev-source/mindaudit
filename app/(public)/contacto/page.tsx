import { Metadata } from 'next';
import { ContactContent } from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con MindAudit® Spain SLP. Resolvemos tus dudas en auditoría y consultoría.',
};

export default function ContactoPage() {
  return <ContactContent />;
}
