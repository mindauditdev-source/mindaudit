import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils/cn';
import AuthProvider from '@/components/providers/AuthProvider';
import { Toaster } from 'sonner';

const satoshi = localFont({
  src: [
    {
      path: '../public/Fonts/WEB/fonts/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../public/Fonts/WEB/fonts/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MindAudit® Spain SLP - Auditoría Profesional',
  description: 'Firma boutique de auditoría que combina rigor profesional con tecnología moderna.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(satoshi.variable, "scroll-smooth")}>
      <body className="min-h-screen bg-background antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
