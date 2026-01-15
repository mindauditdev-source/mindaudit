import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils/cn';
import AuthProvider from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindAudit Spain SLP - Auditoría Profesional',
  description: 'Firma boutique de auditoría que combina rigor profesional con tecnología moderna.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
