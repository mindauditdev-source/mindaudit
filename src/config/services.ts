/**
 * Configuración de servicios de auditoría de MindAudit Spain
 */

export interface AuditService {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
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
    description: 'En <strong>MindAudit® Spain SLP</strong> prestamos servicios de auditoría de cuentas anuales individuales y consolidadas dirigidos exclusivamente a despachos profesionales que desean ofrecer auditoría a sus clientes bajo los estándares normativos de la Ley 22/2015.',
    detailedDescription: 'Nuestro servicio de auditoría de cuentas anuales está diseñado para integrarse como un recurso especializado de su despacho. Actuamos con total independencia técnica, proporcionando la seguridad que sus clientes necesitan y el prestigio que su firma merece. Utilizamos una metodología digital avanzada que nos permite trabajar de forma ágil y coordinada con su equipo, minimizando las interrupciones en la operativa diaria de la empresa auditada.',
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
    detailedDescription: 'En <strong>MindAudit®</strong> contamos con un equipo experto en la normativa específica que rige el sector público. Realizamos auditorías de cuentas, de cumplimiento y operativas para ayuntamientos, entidades locales y organismos autónomos. Nuestra metodología se alinea con los estándares de la Intervención General de la Administración del Estado (IGAE) y los órganos de control externo (OCEX), garantizando la transparencia y la fiscalización rigurosa de los recursos públicos.',
    icon: 'Building',
    featured: false,
    category: 'financial',
    features: [
      'Conocimiento profundo de la normativa contable pública y de presupuestación.',
      'Experiencia en auditorías de cumplimiento y legalidad para entes locales.',
      'Informes estructurados según requerimientos de los órganos de fiscalización.',
      'Soporte técnico especializado para intervenciones locales.'
    ],
    faqs: [
      {
        q: "¿Podemos contar con vosotros como apoyo técnico para Intervención o para encargos de control financiero?",
        a: "Sí. Actuamos como soporte técnico especializado en trabajos de control financiero permanente, auditorías operativas, revisiones de legalidad y fiscalización de subvenciones o entes dependientes. Nos integramos con el despacho colaborador respetando su relación institucional con la entidad pública, aportando independencia técnica, documentación estructurada y metodología alineada con estándares profesionales."
      },
      {
        q: "¿Por qué elegir MindAudit® en el Sector Público?",
        a: "En <strong>MindAudit®</strong> aportamos más de 15 años de experiencia en auditoría, control financiero y fiscalización en entornos públicos y entidades dependientes, trabajando bajo los estándares técnicos y legales aplicables en este sector."
      }
    ]
  },
  {
    id: 'limited-review',
    name: 'Revisiones Limitadas',
    slug: 'revisiones-limitadas',
    shortDescription: 'Revisión limitada de estados financieros',
    description: 'En <strong>MindAudit®</strong> contamos con más de <strong>20 años de experiencia en revisión de estados financieros</strong>, aplicando metodología estructurada bajo estándares profesionales.',
    detailedDescription: 'La revisión limitada es un encargo de aseguramiento que proporciona un nivel moderado de seguridad sobre los estados financieros. Es especialmente útil para periodos intermedios o cuando no se requiere una auditoría completa. En <strong>MindAudit®</strong>, aplicamos procedimientos analíticos y de indagación rigurosos para identificar posibles modificaciones sustanciales que debieran hacerse en las cuentas, optimizando tiempos y costes para la entidad.',
    icon: 'Search',
    featured: false,
    category: 'financial',
    features: [
      'Alcance adaptado de acuerdo con la norma internacional de encargos de revisión (NIER).',
      'Enfoque basado en riesgos y procedimientos analíticos avanzados.',
      'Informe de revisión con conclusiones claras sobre la fiabilidad de la información.',
      'Ideal para requerimientos bancarios o seguimiento interno de socios.'
    ]
  },
  {
    id: 'agreed-procedures',
    name: 'Auditoría de procedimientos acordados',
    slug: 'auditoria-procedimientos-acordados',
    shortDescription: 'Procedimientos específicos según necesidades',
    description: 'Aplicación de procedimientos de auditoría de naturaleza específica acordados previamente con el cliente sobre partidas concretas de los estados financieros.',
    detailedDescription: 'Este servicio permite a los usuarios centrarse en áreas específicas de interés o riesgo. En <strong>MindAudit®</strong>, definimos junto con el cliente los procedimientos exactos a realizar (pruebas de inventario, revisión de deudores, verificación de ventas, etc.). El resultado es un informe de hechos concretos que proporciona datos objetivos sin emitir una opinión de auditoría tradicional, permitiendo al cliente extraer sus propias conclusiones.',
    icon: 'Settings',
    featured: false,
    category: 'financial',
    features: [
      'Flexibilidad total en la definición de los procedimientos a ejecutar.',
      'Informes detallados con los hallazgos específicos encontrados.',
      'Útil para revisiones de cumplimiento de contratos o verificación de activos específicos.',
      'Metodología basada en la norma internacional de servicios relacionados (NISR).'
    ]
  },

  // ========== AUDITORÍAS ESPECIALIZADAS ==========
  {
    id: 'ecoembes',
    name: 'Auditoría Ecoembes',
    slug: 'auditoria-ecoembes',
    shortDescription: 'Auditoría especializada en envases y reciclaje',
    description: 'Certificación obligatoria de la Declaración de Envases para empresas adheridas a Ecoembes, garantizando el cumplimiento normativo.',
    detailedDescription: 'Las empresas que ponen envases en el mercado español tienen la obligación de presentar una declaración anual a Ecoembes. En <strong>MindAudit®</strong>, verificamos la exactitud de los datos reportados (pesos, materiales, unidades) mediante una auditoría técnica especializada. Aseguramos que su empresa cumpla con la normativa de responsabilidad ampliada del productor, evitando sanciones y errores en la liquidación del punto verde.',
    icon: 'CheckCircle2',
    featured: true,
    category: 'special',
    features: [
      'Revisión detallada de los escandallos y fichas técnicas de envases.',
      'Verificación del sistema de reporte y control interno de la compañía.',
      'Emisión de la certificación requerida por Ecoembes bajo estándares oficiales.',
      'Asesoramiento en la optimización de los procesos de declaración.'
    ]
  },
  {
    id: 'banco-de-espana',
    name: 'Banco de España',
    slug: 'banco-de-espana',
    shortDescription: 'Informe complementarios de auditores externos',
    description: 'Informes complementarios a la auditoría de cuentas requeridos por el regulador para entidades bajo su supervisión.',
    detailedDescription: 'Las entidades financieras, de pago y de crédito supervisadas por el Banco de España requieren informes especiales de auditoría externa. En <strong>MindAudit®</strong> nos especializamos en la emisión de estos informes complementarios, revisando aspectos críticos como el cumplimiento normativo, el gobierno corporativo y la solvencia, siempre bajo los estrictos requerimientos del regulador nacional.',
    icon: 'Landmark',
    featured: false,
    category: 'special',
    features: [
      'Experiencia técnica en normativa bancaria y de entidades de pago.',
      'Revisión de procedimientos de control interno específicos para el sector financiero.',
      'Informes dirigidos a la unidad de supervisión del Banco de España.',
      'Confidencialidad y rigor absoluto en el tratamiento de datos sensibles.'
    ]
  },
  {
    id: 'sicbios',
    name: 'Informes SICBIOS',
    slug: 'informes-sicbios',
    shortDescription: 'Certificación de los Biocarburantes',
    description: 'Informes técnicos del Sistema de Información de Biocarburantes (SICBIOS) para garantizar la veracidad de los datos reportados.',
    detailedDescription: 'En el sector energético, la certificación de sostenibilidad de los biocarburantes es esencial. En <strong>MindAudit®</strong> realizamos la auditoría de los datos reportados al Sistema de Información de Biocarburantes (SICBIOS), conforme a los criterios de sostenibilidad y reducción de emisiones de gases de efecto invernadero exigidos por la normativa europea y nacional.',
    icon: 'ShieldCheck',
    featured: false,
    category: 'special',
    features: [
      'Verificación de la cadena de custodia y trazabilidad de los productos.',
      'Auditoría de los ahorros de emisiones de carbono reportados.',
      'Cumplimiento de los estándares de sostenibilidad ISCC o equivalentes.',
      'Informes técnicos validados para la CNMC y el MITECO.'
    ]
  },
  {
    id: 'cores',
    name: 'Informes CORES',
    slug: 'informes-cores',
    shortDescription: 'Informes periódicos para el sector de hidrocarburos',
    description: 'Informes de auditoría relacionados con la Corporación de Reservas Estratégicas de Productos Petrolíferos.',
    detailedDescription: 'Los operadores de productos petrolíferos deben reportar periódicamente sus existencias y ventas a CORES. En <strong>MindAudit®</strong> auditamos estas declaraciones para asegurar que la información suministrada sea veraz y refleje la realidad física y contable de los hidrocarburos. Ayudamos a los operadores a cumplir con sus obligaciones de mantenimiento de reservas estratégicas y de seguridad.',
    icon: 'Layers',
    featured: false,
    category: 'special',
    features: [
      'Auditoría de ventas anuales y cálculo de cuotas de mantenimiento de reservas.',
      'Verificación física y documental de existencias de hidrocarburos.',
      'Informes específicos solicitados por la Corporación CORES.',
      'Conocimiento experto de la normativa del sector de hidrocarburos.'
    ]
  },

  // ========== INFORMES ESPECIALES Y MERCANTILES ==========
  {
    id: 'insolvency-report',
    name: 'Informe de mayorías de la Ley Concursal',
    slug: 'informe-mayorias-ley-concursal',
    shortDescription: 'Garantía en procesos de reestructuración',
    description: 'Certificación de quórum y mayorías necesarias en planes de reestructuración conforme al Texto Refundido de la Ley Concursal.',
    detailedDescription: 'En el marco de los planes de reestructuración, la figura del auditor es clave para certificar que se han alcanzado las mayorías necesarias de los acreedores. En <strong>MindAudit®</strong> realizamos esta verificación de forma independiente y rápida, facilitando la homologación judicial del plan. Analizamos el pasivo afectado y los votos emitidos para dar fe fehaciente del cumplimiento de los requisitos legales exigidos por la legislación concursal.',
    icon: 'Award',
    featured: true,
    category: 'grants',
    features: [
      'Verificación del cómputo de pasivos y créditos afectados por el plan.',
      'Validación de las mayorías por clases de acreedores.',
      'Protocolo de actuación ágil para cumplir con los plazos judiciales.',
      'Apoyo técnico a asesores legales y expertos independientes.'
    ]
  },
  {
    id: 'capital-increase',
    name: 'Informes Especiales de aumento de Capital Social',
    slug: 'informes-aumento-capital',
    shortDescription: 'Informe para ampliaciones de capital',
    description: 'Informes especiales requeridos por la Ley de Sociedades de Capital para aumentos por compensación de créditos o con cargo a reservas.',
    detailedDescription: 'Las ampliaciones de capital que no se realizan mediante aportaciones dinerarias requieren de la intervención de un auditor de cuentas. En <strong>MindAudit®</strong> elaboramos el informe especial que certifica la realidad de los créditos a compensar o la procedencia de la utilización de reservas, requisito indispensable para la inscripción de la escritura pública en el Registro Mercantil.',
    icon: 'FileText',
    featured: false,
    category: 'grants',
    features: [
      'Certificación de la existencia y exigibilidad de los créditos a capitalizar.',
      'Revisión del último balance auditado para aumentos con cargo a reservas.',
      'Coordinación con notaría y registro para una inscripción sin incidencias.',
      'Celeridad en la emisión para no dilatar procesos corporativos.'
    ]
  },
  {
    id: 'capital-reduction',
    name: 'Informes por Reducción de Capital Social',
    slug: 'informes-reduccion-capital',
    shortDescription: 'Informe para reducciones de capital',
    description: 'Informes periciales o de auditoría necesarios para la reducción de capital social con el fin de restablecer el equilibrio patrimonial.',
    detailedDescription: 'Cuando una sociedad reduce su capital para compensar pérdidas o dotar reservas, la Ley de Sociedades de Capital exige la verificación del balance que sirve de base a la operación. En <strong>MindAudit®</strong> auditamos este balance intermedio, certificando la imagen fiel de la situación patrimonial de la compañía y asegurando que la reducción se realiza conforme a derecho y con las debidas garantías para los acreedores.',
    icon: 'Scale',
    featured: false,
    category: 'grants',
    features: [
      'Auditoría del balance de situación utilizado para la reducción.',
      'Verificación del destino del capital reducido y cumplimiento legal.',
      'Soporte en la redacción de las menciones obligatorias en el anuncio de reducción.',
      'Enfoque orientado a la protección del patrimonio social.'
    ]
  },

  // ========== CONSULTORÍA Y TRANSACCIONES ==========
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    slug: 'due-diligence',
    shortDescription: 'Análisis exhaustivo para transacciones',
    description: 'Análisis profundo de la situación financiera y riesgos de una empresa en procesos de compraventa o fusiones corporativas.',
    detailedDescription: 'Antes de una inversión o adquisición, es vital conocer la realidad "debajo del capó". En <strong>MindAudit®</strong> realizamos procesos de Due Diligence financiera y fiscal para identificar "hidden liabilities" (pasivos ocultos), analizar la calidad del EBITDA y evaluar la sostenibilidad de las proyecciones. Proporcionamos al inversor una herramienta de decisión crítica que permite ajustar el valor de la transacción y redactar las cláusulas de garantía del contrato de compraventa (SPA).',
    icon: 'FileSearch',
    featured: true,
    category: 'other',
    features: [
      'Análisis histórico de estados financieros y tendencias de rentabilidad.',
      'Revisión de las principales contingencias fiscales y legales.',
      'Evaluación del capital circulante neto (Net Working Capital).',
      'Informe detallado con "Red Flags" y áreas de ajuste de precio.'
    ]
  },
  {
    id: 'accounting-review',
    name: 'Revisión Contable',
    slug: 'revision-contable',
    shortDescription: 'Revisión y optimización contable',
    description: 'Análisis del sistema contable para verificar su adecuación al Plan General Contable y detectar posibles contingencias.',
    detailedDescription: 'Nuestro servicio de revisión contable actúa como un "check-up" preventivo para su empresa. En <strong>MindAudit®</strong>, analizamos si sus criterios de valoración y registro se ajustan al PGC, detectamos posibles errores en la periodificación de ingresos y gastos, y evaluamos la solidez de su estructura de balance. Es el paso ideal antes de una auditoría oficial o para dar tranquilidad a los administradores sobre el trabajo del departamento financiero.',
    icon: 'Briefcase',
    featured: false,
    category: 'other',
    features: [
      'Detección de errores contables de forma anticipada.',
      'Optimización de la presentación de los estados financieros.',
      'Asesoramiento en la aplicación de nuevas normas de registro y valoración.',
      'Tranquilidad para los administradores sociales ante la formulación de cuentas.'
    ]
  },
  {
    id: 'grant-audit',
    name: 'Auditoría de Subvenciones',
    slug: 'auditoria-subvenciones',
    shortDescription: 'Verificación de fondos y ayudas públicas',
    description: 'Auditoría especializada para verificar el correcto uso y justificación de subvenciones y ayudas públicas nacionales e internacionales.',
    detailedDescription: 'La correcta justificación de los fondos públicos es indispensable para evitar reintegros. En <strong>MindAudit®</strong> auditamos las cuentas justificativas de subvenciones (CDTI, Red.es, Fondos Next Generation, ayudas autonómicas), certificando que los gastos han sido efectivamente pagados, son elegibles y cumplen con todas las condiciones de la convocatoria. Nuestra amplia experiencia garantiza una justificación sólida frente a la administración pública.',
    icon: 'Award',
    featured: true,
    category: 'other',
    features: [
      'Verificación detallada de facturas, nóminas y justificantes de pago.',
      'Comprobación del cumplimiento de los hitos técnicos del proyecto.',
      'Emisión de informes según la Orden EHA/1434/2007 o bases específicas.',
      'Acompañamiento en caso de requerimientos de subsanación de la administración.'
    ]
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
