import { Metadata } from 'next';
import PresupuestoContent from '@/components/contact/PresupuestoContent';

export const metadata: Metadata = {
  title: 'Solicitar Presupuesto',
  description: 'Solicita un presupuesto personalizado para tus servicios de auditoría y consultoría. Rápido, transparente y adaptado a tus necesidades.',
};

export default function PresupuestoPage() {
  return <PresupuestoContent />;
}
