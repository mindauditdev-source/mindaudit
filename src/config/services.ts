/**
 * Configuración de servicios de auditoría de MindAudit Spain
 */

export interface AuditService {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  featured: boolean;
  category: 'financial' | 'grants' | 'special' | 'other';
}

export const auditServices: AuditService[] = [
  // ========== SERVICIOS DESTACADOS ==========
  {
    id: 'financial-audit',
    name: 'Auditoría Financiera',
    slug: 'auditoria-financiera',
    shortDescription: 'Auditoría de cuentas anuales con rigor y transparencia',
    description: 'Auditoría completa de estados financieros para garantizar la fiabilidad de la información contable de su empresa.',
    icon: 'TrendingUp',
    featured: true,
    category: 'financial',
  },
  {
    id: 'grant-audit',
    name: 'Auditoría de Subvenciones',
    slug: 'auditoria-subvenciones',
    shortDescription: 'Verificación de cumplimiento de subvenciones públicas',
    description: 'Auditoría especializada para verificar el correcto uso y justificación de subvenciones y ayudas públicas.',
    icon: 'Award',
    featured: true,
    category: 'grants',
  },
  {
    id: 'ecoembes-audit',
    name: 'Auditoría Ecoembes',
    slug: 'auditoria-ecoembes',
    shortDescription: 'Auditoría especializada en envases y reciclaje',
    description: 'Auditoría específica para empresas adheridas al sistema de gestión de residuos de envases Ecoembes.',
    icon: 'Recycle',
    featured: true,
    category: 'special',
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    slug: 'due-diligence',
    shortDescription: 'Análisis exhaustivo para operaciones corporativas',
    description: 'Análisis detallado de la situación financiera, legal y operativa de una empresa para operaciones de M&A.',
    icon: 'Search',
    featured: true,
    category: 'other',
  },

  // ========== OTROS SERVICIOS ==========
  {
    id: 'annual-accounts-audit',
    name: 'Auditoría de Cuentas Anuales',
    slug: 'auditoria-cuentas-anuales',
    shortDescription: 'Auditoría de cuentas individuales y consolidadas',
    description: 'Auditoría de cuentas anuales individuales y de grupos empresariales según normativa vigente.',
    icon: 'FileText',
    featured: false,
    category: 'financial',
  },
  {
    id: 'public-sector-audit',
    name: 'Auditoría del Sector Público',
    slug: 'auditoria-sector-publico',
    shortDescription: 'Auditoría especializada en entidades públicas',
    description: 'Auditoría de cuentas de empresas del sector público con conocimiento específico de la normativa aplicable.',
    icon: 'Building',
    featured: false,
    category: 'financial',
  },
  {
    id: 'limited-review',
    name: 'Revisiones Limitadas',
    slug: 'revisiones-limitadas',
    shortDescription: 'Revisión limitada de estados financieros',
    description: 'Revisión limitada que proporciona un nivel de seguridad moderado sobre la información financiera.',
    icon: 'ClipboardCheck',
    featured: false,
    category: 'financial',
  },
  {
    id: 'agreed-procedures',
    name: 'Procedimientos Acordados',
    slug: 'procedimientos-acordados',
    shortDescription: 'Procedimientos específicos según necesidades',
    description: 'Aplicación de procedimientos específicos acordados con el cliente para verificar aspectos concretos.',
    icon: 'ListChecks',
    featured: false,
    category: 'other',
  },
  {
    id: 'biofuels-audit',
    name: 'Auditoría Biocarburantes',
    slug: 'auditoria-biocarburantes',
    shortDescription: 'Auditoría especializada en biocarburantes',
    description: 'Auditoría específica para empresas del sector de biocarburantes y energías renovables.',
    icon: 'Fuel',
    featured: false,
    category: 'special',
  },
  {
    id: 'sicbios-audit',
    name: 'Auditoría SICBIOS',
    slug: 'auditoria-sicbios',
    shortDescription: 'Auditoría del sistema de información de biocarburantes',
    description: 'Auditoría del Sistema de Información de Biocarburantes y otros combustibles renovables.',
    icon: 'Database',
    featured: false,
    category: 'special',
  },
  {
    id: 'cores-audit',
    name: 'Auditoría CORES',
    slug: 'auditoria-cores',
    shortDescription: 'Auditoría de reservas estratégicas de productos petrolíferos',
    description: 'Auditoría relacionada con la Corporación de Reservas Estratégicas de Productos Petrolíferos.',
    icon: 'Droplet',
    featured: false,
    category: 'special',
  },
  {
    id: 'capital-increase-credit',
    name: 'Informe Aumento Capital por Compensación',
    slug: 'informe-aumento-capital-creditos',
    shortDescription: 'Informe especial para aumento de capital',
    description: 'Informe especial de aumento de capital social por compensación de créditos según normativa mercantil.',
    icon: 'TrendingUp',
    featured: false,
    category: 'other',
  },
  {
    id: 'capital-increase-reserves',
    name: 'Informe Aumento Capital por Reservas',
    slug: 'informe-aumento-capital-reservas',
    shortDescription: 'Informe especial para aumento de capital',
    description: 'Informe especial de aumento de capital social con cargo a reservas según normativa mercantil.',
    icon: 'ArrowUpCircle',
    featured: false,
    category: 'other',
  },
  {
    id: 'capital-reduction',
    name: 'Informe Reducción Capital',
    slug: 'informe-reduccion-capital',
    shortDescription: 'Informe especial para reducción de capital',
    description: 'Informe especial por reducción de capital social para compensar pérdidas según normativa mercantil.',
    icon: 'ArrowDownCircle',
    featured: false,
    category: 'other',
  },
  {
    id: 'bank-of-spain-report',
    name: 'Informes Banco de España',
    slug: 'informes-banco-espana',
    shortDescription: 'Informes complementarios para entidades financieras',
    description: 'Informes complementarios requeridos por el Banco de España para entidades del sector financiero.',
    icon: 'Landmark',
    featured: false,
    category: 'financial',
  },
  {
    id: 'accounting-review',
    name: 'Revisión Contable',
    slug: 'revision-contable',
    shortDescription: 'Revisión de la contabilidad y procesos',
    description: 'Revisión detallada de la contabilidad y procesos contables para identificar mejoras y riesgos.',
    icon: 'Calculator',
    featured: false,
    category: 'other',
  },
  {
    id: 'financial-verification',
    name: 'Verificación de Estados Financieros',
    slug: 'verificacion-estados-financieros',
    shortDescription: 'Verificación de información financiera específica',
    description: 'Verificación de estados financieros y hechos concretos según necesidades específicas del cliente.',
    icon: 'CheckCircle',
    featured: false,
    category: 'financial',
  },
];

/**
 * Obtiene los servicios destacados
 */
export function getFeaturedServices(): AuditService[] {
  return auditServices.filter(service => service.featured);
}

/**
 * Obtiene un servicio por su slug
 */
export function getServiceBySlug(slug: string): AuditService | undefined {
  return auditServices.find(service => service.slug === slug);
}

/**
 * Obtiene servicios por categoría
 */
export function getServicesByCategory(
  category: AuditService['category']
): AuditService[] {
  return auditServices.filter(service => service.category === category);
}

/**
 * Categorías de servicios
 */
export const serviceCategories = [
  {
    id: 'financial',
    name: 'Auditoría Financiera',
    description: 'Servicios de auditoría de estados financieros',
  },
  {
    id: 'grants',
    name: 'Subvenciones',
    description: 'Auditoría de subvenciones y ayudas públicas',
  },
  {
    id: 'special',
    name: 'Auditorías Especiales',
    description: 'Servicios especializados por sector',
  },
  {
    id: 'other',
    name: 'Otros Servicios',
    description: 'Informes especiales y servicios complementarios',
  },
] as const;
