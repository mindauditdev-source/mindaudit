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
  features?: string[];
  faqs?: { q: string; a: string }[];
}

export const auditServices: AuditService[] = [
  // ========== AUDITORÍA DE CUENTAS ==========
  {
    id: 'annual-accounts',
    name: 'Auditoría de Cuentas Anuales individuales y grupos',
    slug: 'auditoria-cuentas-anuales',
    shortDescription: 'Para despachos que buscan rigor técnico, reputación y valor añadido para sus clientes',
    description: 'En <strong>MindAudit Spain SLP</strong> prestamos servicios de auditoría de cuentas anuales individuales y consolidadas dirigidos exclusivamente a despachos profesionales que desean ofrecer auditoría a sus clientes bajo los estándares normativos de la Ley 22/2015.',
    icon: 'Building2',
    featured: true,
    category: 'financial',
    features: [
      'Especialización exclusiva en auditoría: No competimos con los servicios ofertados. Somos auditores puros.',
      'Trabajo en remoto eficiente: Sin desplazamientos innecesarios. Plataforma digital, intercambio seguro y seguimiento online.',
      'Tecnología e IA aplicada a auditoría: Automatización de análisis, revisión masiva de datos, detección de anomalías y mejora de eficiencia.'
    ]
  },
  {
    id: 'public-sector',
    name: 'Auditoría de Cuentas de empresas del sector Público',
    slug: 'auditoria-sector-publico',
    shortDescription: 'Auditoría especializada en entidades públicas',
    description: 'Especializados en auditorías de entidades del sector público local y autonómico. Especialidad en auditorías de cumplimiento y operativas. Emitimos presupuestos para dar cumplimiento con la Ley de Contratos del sector público con el máximo de detalles y transparencia.',
    icon: 'Building',
    featured: false,
    category: 'financial',
    faqs: [
      {
        q: "¿Podemos contar con vosotros como apoyo técnico para Intervención o para encargos de control financiero?",
        a: "Sí. Actuamos como soporte técnico especializado en trabajos de control financiero permanente, auditorías operativas, revisiones de legalidad y fiscalización de subvenciones o entes dependientes. Nos integramos con el despacho colaborador respetando su relación institucional con la entidad pública, aportando independencia técnica, documentación estructurada y metodología alineada con estándares profesionales."
      },
      {
        q: "¿Por qué elegir MindAudit en el Sector Público?",
        a: "En MindAudit aportamos más de 15 años de experiencia en auditoría, control financiero y fiscalización en entornos públicos y entidades dependientes, trabajando bajo los estándares técnicos y legales aplicables en este sector."
      }
    ]
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
    id: 'banco-de-espana',
    name: 'Banco de España',
    slug: 'banco-de-espana',
    shortDescription: 'Informe complementarios de auditores externos',
    description: 'Informes complementarios a la auditoría de cuentas requeridos por el regulador para entidades bajo su supervisión.',
    icon: 'Landmark',
    featured: false,
    category: 'special',
  },
  {
    id: 'sicbios',
    name: 'Informes SICBIOS',
    slug: 'informes-sicbios',
    shortDescription: 'Certificación de los Biocarburantes',
    description: 'Informes técnicos del Sistema de Información de Biocarburantes (SICBIOS) para garantizar la veracidad de los datos reportados.',
    icon: 'ShieldCheck',
    featured: false,
    category: 'special',
  },
  {
    id: 'cores',
    name: 'Informes CORES',
    slug: 'informes-cores',
    shortDescription: 'Informes periódicos para el sector de hidrocarburos',
    description: 'Informes de auditoría relacionados con la Corporación de Reservas Estratégicas de Productos Petrolíferos.',
    icon: 'Layers',
    featured: false,
    category: 'special',
  },

  // ========== INFORMES ESPECIALES Y MERCANTILES ==========
  {
    id: 'insolvency-report',
    name: 'Informe de mayorías de la Ley Concursal',
    slug: 'informe-mayorias-ley-concursal',
    shortDescription: 'Informe de mayorías de la Ley Concursal',
    description: 'Informe de mayorías de la Ley Concursal',
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
    id: 'grant-audit',
    name: 'Auditoría de Subvenciones',
    slug: 'auditoria-subvenciones',
    shortDescription: 'Verificación de fondos y ayudas públicas',
    description: 'Auditoría especializada para verificar el correcto uso y justificación de subvenciones y ayudas públicas nacionales e internacionales.',
    icon: 'Award',
    featured: true,
    category: 'other',
  }
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
