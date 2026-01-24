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
  // ========== AUDITORÍA DE CUENTAS ==========
  {
    id: 'annual-accounts',
    name: 'Auditoría de Cuentas Anuales individuales y grupos',
    slug: 'auditoria-cuentas-anuales',
    shortDescription: 'Auditoría de cuentas anuales con rigor y transparencia',
    description: 'Auditoría completa de estados financieros para garantizar la fiabilidad de la información contable de su empresa, tanto para cuentas individuales como grupos consolidados.',
    icon: 'Building2',
    featured: true,
    category: 'financial',
  },
  {
    id: 'public-sector',
    name: 'Auditoría de Cuentas de empresas del sector Público',
    slug: 'auditoria-sector-publico',
    shortDescription: 'Auditoría especializada en entidades públicas',
    description: 'Auditoría de cuentas de empresas y organismos del sector público con conocimiento específico de la normativa y fiscalización pública.',
    icon: 'Globe',
    featured: false,
    category: 'financial',
  },
  {
    id: 'limited-review',
    name: 'Revisiones Limitadas',
    slug: 'revisiones-limitadas',
    shortDescription: 'Revisión limitada de estados financieros',
    description: 'Proporcionamos un nivel de seguridad moderado sobre la información financiera intermedia o específica mediante procedimientos de revisión analítica.',
    icon: 'Search',
    featured: false,
    category: 'financial',
  },
  {
    id: 'agreed-procedures',
    name: 'Auditoría de procedimientos acordados',
    slug: 'auditoria-procedimientos-acordados',
    shortDescription: 'Procedimientos específicos según necesidades',
    description: 'Aplicación de procedimientos de auditoría de naturaleza específica acordados previamente con el cliente sobre partidas concretas de los estados financieros.',
    icon: 'Settings',
    featured: false,
    category: 'financial',
  },

  // ========== AUDITORÍAS ESPECIALIZADAS ==========
  {
    id: 'ecoembes',
    name: 'Auditoría Ecoembes',
    slug: 'auditoria-ecoembes',
    shortDescription: 'Auditoría especializada en envases y reciclaje',
    description: 'Certificación obligatoria de la Declaración de Envases para empresas adheridas a Ecoembes, garantizando el cumplimiento normativo.',
    icon: 'CheckCircle2',
    featured: true,
    category: 'special',
  },
  {
    id: 'biofuels',
    name: 'Auditoría Biocarburantes',
    slug: 'auditoria-biocarburantes',
    shortDescription: 'Auditoría especializada en biocarburantes',
    description: 'Verificación de la sostenibilidad y cumplimiento de criterios para el sector de los biocarburantes según la normativa vigente.',
    icon: 'Zap',
    featured: false,
    category: 'special',
  },
  {
    id: 'sicbios',
    name: 'Auditoría SICBIOS',
    slug: 'auditoria-sicbios',
    shortDescription: 'Auditoría del sistema de información de biocarburantes',
    description: 'Auditoría técnica del Sistema de Información de Biocarburantes (SICBIOS) para garantizar la veracidad de los datos reportados.',
    icon: 'ShieldCheck',
    featured: false,
    category: 'special',
  },
  {
    id: 'cores',
    name: 'Auditoría CORES',
    slug: 'auditoria-cores',
    shortDescription: 'Auditoría de reservas estratégicas',
    description: 'Informes de auditoría relacionados con la Corporación de Reservas Estratégicas de Productos Petrolíferos.',
    icon: 'Layers',
    featured: false,
    category: 'special',
  },

  // ========== INFORMES ESPECIALES Y MERCANTILES ==========
  {
    id: 'grant-audit',
    name: 'Auditoría de Subvenciones',
    slug: 'auditoria-subvenciones',
    shortDescription: 'Verificación de fondos y ayudas públicas',
    description: 'Auditoría especializada para verificar el correcto uso y justificación de subvenciones y ayudas públicas nacionales e internacionales.',
    icon: 'Award',
    featured: true,
    category: 'grants',
  },
  {
    id: 'capital-increase',
    name: 'Informes Especiales de aumento de Capital Social',
    slug: 'informes-aumento-capital',
    shortDescription: 'Informe para ampliaciones de capital',
    description: 'Informes especiales requeridos por la Ley de Sociedades de Capital para aumentos por compensación de créditos o con cargo a reservas.',
    icon: 'FileText',
    featured: false,
    category: 'grants',
  },
  {
    id: 'capital-reduction',
    name: 'Informes por Reducción de Capital Social',
    slug: 'informes-reduccion-capital',
    shortDescription: 'Informe para reducciones de capital',
    description: 'Informes periciales o de auditoría necesarios para la reducción de capital social con el fin de restablecer el equilibrio patrimonial.',
    icon: 'Scale',
    featured: false,
    category: 'grants',
  },
  {
    id: 'banco-espana',
    name: 'Informes Complementarios del Banco de España',
    slug: 'informes-banco-espana',
    shortDescription: 'Informes para entidades financieras',
    description: 'Realización de informes complementarios a la auditoría de cuentas requeridos por el regulador para entidades bajo su supervisión.',
    icon: 'Landmark',
    featured: false,
    category: 'grants',
  },

  // ========== CONSULTORÍA Y TRANSACCIONES ==========
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    slug: 'due-diligence',
    shortDescription: 'Análisis exhaustivo para transacciones',
    description: 'Análisis profundo de la situación financiera y riesgos de una empresa en procesos de compraventa o fusiones corporativas.',
    icon: 'FileSearch',
    featured: true,
    category: 'other',
  },
  {
    id: 'accounting-review',
    name: 'Revisión Contable',
    slug: 'revision-contable',
    shortDescription: 'Revisión y optimización contable',
    description: 'Análisis del sistema contable para verificar su adecuación al Plan General Contable y detectar posibles contingencias.',
    icon: 'Briefcase',
    featured: false,
    category: 'other',
  },
  {
    id: 'financial-verification',
    name: 'Verificación de Estados Financieros',
    slug: 'verificacion-estados-financieros',
    shortDescription: 'Verificación de solidez financiera',
    description: 'Servicios de comprobación de estados financieros para terceros, entidades bancarias o procesos de licitación.',
    icon: 'ShieldCheck',
    featured: false,
    category: 'other',
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
