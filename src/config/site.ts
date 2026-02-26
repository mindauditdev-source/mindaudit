/**
 * Configuración general del sitio MindAudit Spain
 */

export const siteConfig = {
  name: 'MindAudit® Spain SLP',
  shortName: 'MindAudit®',
  description:
    'Firma boutique de auditoría que combina rigor profesional con tecnología moderna para ofrecer servicios de auditoría transparentes y eficientes en toda España a través de <strong>MindAudit® Spain</strong>.',
  tagline: 'Rigor. Transparencia. Tecnología al servicio de la excelencia en auditoría.',
  url: 'https://www.mindaudit.es',
  
  // Información de contacto
  contact: {
    email: 'info@mindaudit.es',
    phone: '+34 900 933 233', // Por confirmar
    address: {
      street: 'Gran Via Carles III nº98 10ª Planta',
      city: 'Barcelona',
      postalCode: '08028',
      country: 'España',
    },
  },

  // Emails corporativos
  emails: {
    info: 'info@mindaudit.es',
    compliance: 'compliance@mindaudit.es',
    esilva: 'esilva@mindaudit.es',
    vgarcia: 'vgarcia@mindaudit.es',
  },

  // Información legal
  legal: {
    roac: 'SOXXXX', // Por definir
    companyName: 'MIND AUDIT SPAIN SLP',
    cif: '', // Por definir
  },

  // Redes sociales
  social: {
    linkedin: 'https://www.linkedin.com/company/mindaudit-spain',
    twitter: 'https://twitter.com/mindauditspain',
    facebook: '', // Opcional
    instagram: '', // Opcional
  },

  // Integraciones
  integrations: {
    calendly: {
      url: '', // Por configurar
      enabled: true,
    },
    trustpilot: {
      url: '', // Por configurar
      enabled: true,
    },
    analytics: {
      googleAnalyticsId: '', // Por configurar
      enabled: false,
    },
  },

  // Estadísticas destacadas (para landing page)
  stats: {
    auditsCompleted: 300,
    yearsExperience: 18,
    clientSatisfaction: 98,
    regions: 14, // CCAA en España
  },

  // SEO
  seo: {
    defaultTitle: 'MindAudit Spain SLP - Auditoría Profesional',
    titleTemplate: '%s | MindAudit Spain',
    defaultDescription:
      'Firma boutique de auditoría que combina rigor profesional con tecnología moderna. Servicios de auditoría financiera, subvenciones, Ecoembes y Due Diligence en toda España.',
    keywords: [
      'auditoría',
      'auditoría financiera',
      'auditoría de cuentas',
      'auditoría España',
      'auditoría Barcelona',
      'auditoría subvenciones',
      'Ecoembes',
      'Due Diligence',
      'ROAC',
      'auditor',
      'despacho profesional',
    ],
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: 'MindAudit Spain SLP',
      images: [
        {
          url: '/images/og-image.jpg', // Por crear
          width: 1200,
          height: 630,
          alt: 'MindAudit Spain - Auditoría Profesional',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mindauditspain',
      creator: '@mindauditspain',
    },
  },

  // Configuración de la aplicación
  app: {
    maxFileUploadSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
    ],
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 100,
    },
  },

  // Features flags (para activar/desactivar funcionalidades)
  features: {
    magicLink: true,
    emailPassword: true,
    calendlyIntegration: true,
    trustpilotWidget: true,
    darkMode: false, // Por implementar
    notifications: true,
    fileUpload: true,
    chat: false, // Futuro
  },
} as const;

export type SiteConfig = typeof siteConfig;
