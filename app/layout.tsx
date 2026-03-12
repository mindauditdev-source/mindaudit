import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils/cn';
import AuthProvider from '@/components/providers/AuthProvider';
import { Toaster } from 'sonner';
import { JsonLd } from '@/components/seo/JsonLd';

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
  metadataBase: new URL('https://www.mindaudit.es'),
  title: {
    default: 'MindAudit® Spain SLP - Auditoría Profesional y Tecnológica',
    template: '%s | MindAudit® Spain'
  },
  description: 'Firma boutique de auditoría en España que combina rigor profesional con tecnología moderna. Expertos en auditoría de cuentas, consultoría y soluciones digitales.',
  keywords: ['auditoría', 'España', 'auditoría de cuentas', 'tecnología', 'consultoría financiera', 'MindAudit'],
  authors: [{ name: 'MindAudit Spain SLP' }],
  creator: 'MindAudit Spain SLP',
  publisher: 'MindAudit Spain SLP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.mindaudit.es',
    siteName: 'MindAudit® Spain',
    title: 'MindAudit® Spain SLP - Auditoría Profesional',
    description: 'Boutique de auditoría que combina rigor con tecnología moderna.',
    images: [
      {
        url: '/og-image.jpg', // Placeholder, verify if exists or create later
        width: 1200,
        height: 630,
        alt: 'MindAudit® Spain SLP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindAudit® Spain SLP - Auditoría Profesional',
    description: 'Boutique de auditoría que combina rigor con tecnología moderna.',
    images: ['/twitter-image.jpg'], // Placeholder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'LZMGo4YLYC1RUvn1FqB_6NXhPqTJ__23G25jvQeq_kk',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
        <JsonLd />
        <Toaster position="top-right" richColors />
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
