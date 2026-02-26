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
  images?: string[];
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
    detailedDescription: 'Vuestro despacho podrá ofrecer servicios de revisiones limitadas a cualquier empresa, sea del tamaño que sea, ya que su alcance se asemeja mucho a una auditoría de cuentas, pero sin ser tan exhaustiva. Es una buena manera de obtener un grado de seguridad muy aceptable de la información financiera de vuestra cartera de clientes.',
    icon: 'Search',
    featured: false,
    category: 'financial',
    features: [
      'Alcance adaptado de acuerdo con la norma internacional de encargos de revisión (NIER).',
      'Enfoque basado en riesgos y procedimientos analíticos avanzados.',
      'Informe de revisión con conclusiones claras sobre la fiabilidad de la información.',
      'Ideal para requerimientos bancarios o seguimiento interno de socios.'
    ],
    faqs: [
      {
        q: "¿En qué se diferencia una revisión limitada de una auditoría completa?",
        a: "La revisión limitada proporciona una seguridad moderada basada principalmente en procedimientos analíticos e indagaciones, mientras que la auditoría ofrece seguridad razonable con pruebas sustantivas más extensas y evaluación profunda del control interno. Es un encargo más ágil, pero igualmente profesional y estructurado."
      },
      {
        q: "¿En qué situaciones es recomendable una revisión limitada?",
        a: "Permite reforzar la credibilidad financiera sin asumir el coste completo de una auditoría. Es habitual en: Solicitudes de financiación bancaria sin necesidad de informe de auditoría, acuerdos entre socios, procesos de entrada de nuevos inversores, cumplimiento de cláusulas contractuales, etc…"
      }
    ]
  },
  {
    id: 'agreed-procedures',
    name: 'Auditoría de procedimientos acordados',
    slug: 'auditoria-procedimientos-acordados',
    shortDescription: 'Procedimientos específicos según necesidades',
    description: 'Aplicación de procedimientos de auditoría de naturaleza específica acordados previamente con el cliente sobre partidas concretas de los estados financieros.',
    detailedDescription: 'Uno de los servicios más demandados: Los procedimientos acordados llegan a cualquier nivel: desde sociedades mercantiles a pequeñas asociaciones, comunidades u otras entidades sin fines lucrativos. Este servicio está diseñado para analizar situaciones específicas que requieren la intervención de un profesional independiente, tales como: Conciliación de saldos de caja, análisis de la cartera de cliente, validación del push bancario, integridad de los activos, Integridad de la cuenta de resultados, etc…',
    icon: 'Settings',
    featured: false,
    category: 'financial',
    features: [
      'Flexibilidad total en la definición de los procedimientos a ejecutar.',
      'Informes detallados con los hallazgos específicos encontrados.',
      'Útil para revisiones de cumplimiento de contratos o verificación de activos específicos.',
      'Metodología basada en la norma internacional de servicios relacionados (NISR).'
    ],
    faqs: [
      {
        q: "¿Qué es exactamente un procedimiento acordado y cuándo puede necesitarlo un cliente del despacho?",
        a: "Un procedimiento acordado es una revisión específica sobre un área concreta del negocio, diseñada para responder a una necesidad puntual. A diferencia de una auditoría completa, no se revisan todas las cuentas, sino únicamente aquello que el cliente necesita verificar: por ejemplo, la conciliación de caja, la validación de ingresos, la comprobación de subvenciones, la revisión de saldos bancarios o la verificación de determinados gastos."
      },
      {
        q: "¿Cómo puede ayudar este servicio a mi despacho profesional?",
        a: "Los procedimientos acordados permiten al despacho ampliar su oferta con una verificación independiente y profesional en situaciones donde el cliente necesita algo más que asesoramiento contable, pero menos que una auditoría completa. Actuamos como partner técnico especializado, definiendo junto al despacho el alcance adecuado y ejecutando el trabajo con rigor profesional. El resultado es un informe pericial que aporta una visión íntegra e independiente de los acontecimientos sucedidos en una organización."
      }
    ]
  },

  // ========== AUDITORÍAS ESPECIALIZADAS ==========
  {
    id: 'ecoembes',
    name: 'Auditoría Ecoembes',
    slug: 'auditoria-ecoembes',
    shortDescription: 'Auditoría especializada en envases y reciclaje',
    description: 'Certificación obligatoria de la Declaración de Envases para empresas adheridas a Ecoembes, de acuerdo con el RD 1055/2022 de 27 de diciembre',
    detailedDescription: 'La mencionada normativa prevé que antes del 31 de mayo del año siguiente al del periodo de cumplimiento, el informe sobre envases se acompañará de un informe de procedimientos acordados emitido por un auditor de cuentas.',
    icon: 'CheckCircle2',
    featured: true,
    category: 'special',
    features: [
      'Revisión detallada de los escandallos y fichas técnicas de envases.',
      'Verificación del sistema de reporte y control interno de la compañía.',
      'Emisión de la certificación requerida por Ecoembes bajo estándares oficiales.',
      'Asesoramiento en la optimización de los procesos de declaración.'
    ],
    images: ['/services/ecoembes-1.png', '/services/ecoembes-2.png']
  },
  {
    id: 'banco-de-espana',
    name: 'Informes Banco de España',
    slug: 'banco-de-espana',
    shortDescription: 'Informes complementarios al de auditoría de Cuentas Anuales',
    description: 'Informes complementarios al de auditoría de Cuentas Anuales de las entidades de crédito y de los establecimientos financieros de crédito.',
    detailedDescription: 'Informe de auditoría complementario para dar cumplimento con lo que se dispone en la Ley 5/2015, de 27 de abril, de fomento de la financiación empresarial y por el Real Decreto 309/2020, de 11 de febrero, en el que se regula específicamente el régimen jurídico de estas entidades y se les atribuye la condición de entidades de interés público a efecto de lo previsto en la normativa reguladora de la actividad de auditoría de cuentas.',
    icon: 'Landmark',
    featured: false,
    category: 'special',
    features: [
      'Experiencia técnica en normativa bancaria y de entidades de pago.',
      'Revisión de procedimientos de control interno específicos para el sector financiero.',
      'Informes dirigidos a la unidad de supervisión del Banco de España.',
      'Confidencialidad y rigor absoluto en el tratamiento de datos sensibles.'
    ],
    images: ['/services/banco-espana-1.png', '/services/banco-espana-2.png']
  },
  {
    id: 'sicbios',
    name: 'Informes SICBIOS',
    slug: 'informes-sicbios',
    shortDescription: 'Certificación de los Biocarburantes',
    description: 'Certificación obligatoria sobre la declaración anual de compras, ventas y producción de biocarburantes y otros combustibles renovables con fines de transporte conforme a la Circular 1/2016, de 30 de marzo, de la Comisión Nacional de los Mercados y la Competencia',
    detailedDescription: 'Informe de auditoría para dar cumplimiento a los sujetos titulares de instalaciones de plantas de producción de biodiésel.',
    icon: 'ShieldCheck',
    featured: false,
    category: 'special',
    features: [
      'Verificación de la cadena de custodia y trazabilidad de los productos.',
      'Auditoría de los ahorros de emisiones de carbono reportados.',
      'Cumplimiento de los estándares de sostenibilidad ISCC o equivalentes.',
      'Informes técnicos validados para la CNMC y el MITECO.'
    ],
    images: ['/services/sicbios-1.png', '/services/sicbios-2.png']
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
    name: 'Informe de mayorías para la Ley Concursal',
    slug: 'informe-mayorias-ley-concursal',
    shortDescription: 'Garantía en procesos de reestructuración',
    description: 'Informe prevista en la Ley 16/2022, de 5 de septiembre, reforma el texto refundido de la Ley Concursal en España',
    detailedDescription: 'El informe de mayorías para la Ley Concursal incluye la certificación del auditor de cuentas o, en su defecto, del auditor nombrado por el registro mercantil del domicilio del deudor, a las sociedades que alcancen, con sus acreedores, un acuerdo de refinanciación. Esta certificación debe constatar que la deuda con los acreedores firmantes del acuerdo alcanza, a la fecha del acuerdo de refinanciación.',
    icon: 'Award',
    featured: true,
    category: 'grants',
    features: [
      'Verificación del cómputo de pasivos y créditos afectados por el plan.',
      'Validación de las mayorías por clases de acreedores.',
      'Protocolo de actuación ágil para cumplir con los plazos judiciales.',
      'Apoyo técnico a asesores legales y expertos independientes.'
    ],
    faqs: [
      {
        q: "¿Qué es el certificado de mayorías y en qué operaciones se requiere?",
        a: "El certificado de mayorías es el documento que acredita que un plan de reestructuración ha sido aprobado con las mayorías que exige la Ley Concursal tras la reforma introducida por la Ley 16/2022. <br/><br/> Cuando una empresa negocia un plan de reestructuración con sus acreedores, la ley exige que se cumplan determinadas mayorías por clases de crédito (dos tercios con carácter general y tres cuartos cuando se trate de créditos con garantía real). Para poder formalizar el plan en escritura pública y, en su caso, solicitar su homologación judicial, es necesario aportar una certificación que confirme que esas mayorías se han alcanzado correctamente. <br/><br/> Si no se ha nombrado experto en la reestructuración, esa certificación corresponde al auditor de cuentas. <br/><br/> Es importante entender que el auditor no está validando jurídicamente cómo se han formado las clases de acreedores ni está realizando una auditoría de cuentas completa. Lo que hace es aplicar una serie de procedimientos técnicos para comprobar que el cálculo de votos y el cómputo del pasivo afectado se han realizado conforme a lo previsto en la normativa concursal. <br/><br/> Para un despacho que asesora un plan de reestructuración, este certificado no es un trámite menor: es un requisito imprescindible para poder elevar el plan a público y continuar el proceso hacia su homologación judicial."
      },
      {
        q: "Somos un despacho que asesora jurídicamente un plan de reestructuración. ¿Qué valor me aporta contar con vosotros para el certificado de mayorías?",
        a: "Trabajamos de forma coordinada con vosotros, sin invadir el ámbito jurídico (la formación de clases y su fundamentación siguen siendo cuestión fuera de nuestro ámbito) pero aportando la tranquilidad de que el soporte numérico y documental del plan está bien construido. Nuestro papel es sencillo: ayudaros a cerrar la operación con total seguridad."
      }
    ]
  },
  {
    id: 'capital-increase',
    name: 'Informes Especiales de aumento de Capital Social',
    slug: 'informes-aumento-capital',
    shortDescription: 'Informe para ampliaciones de capital',
    description: 'Informes especiales requeridos por la Ley de Sociedades de Capital para aumentos por compensación de créditos o con cargo a reservas.',
    detailedDescription: 'Informe para dar cumplimiento al artículo 303 del TRLSC relativo a las operaciones de aumento de capital con cargo a reservas no exige del auditor actuación adicional alguna a la auditoría de balance',
    icon: 'FileText',
    featured: false,
    category: 'grants',
    features: [
      'Certificación de la existencia y exigibilidad de los créditos a capitalizar.',
      'Revisión del último balance auditado para aumentos con cargo a reservas.',
      'Coordinación con notaría y registro para una inscripción sin incidencias.',
      'Celeridad en la emisión para no dilatar procesos corporativos.'
    ],
    faqs: [
      {
        q: "¿Es necesario realizar siempre una auditoría específica del balance para un aumento de capital?",
        a: "No siempre: el balance que sirve de base para el aumento de capital debe estar verificado por el auditor y referirse a una fecha comprendida dentro de los seis meses anteriores al acuerdo. <br/><br/> Ahora bien, si las cuentas anuales del último ejercicio cerrado han sido auditadas, y no han transcurrido más de seis meses desde la fecha de cierre hasta el acuerdo de aumento entonces no es necesario realizar una auditoría adicional del balance, pudiendo utilizarse las cuentas anuales auditadas como base del acuerdo. En caso contrario, deberá emitirse un informe específico de auditoría del balance formulado para dicho aumento."
      },
      {
        q: "¿Qué implicaciones prácticas debe tener en cuenta un despacho mercantil que asesora una ampliación de capital urgente?",
        a: "A la práctica, el despacho debería, antes de fijar calendario de Junta, verificar: <br/><br/> • Si la sociedad tiene auditor nombrado. <br/> • Si las últimas cuentas anuales auditadas están dentro del plazo de seis meses. <br/> • Si existen salvedades que puedan afectar a la operación. <br/> • Si será necesario formular y auditar un balance específico. <br/><br/> Contar con el auditor desde la fase inicial de planificación permite: <br/><br/> • Anticipar necesidades documentales. <br/> • Evitar retrasos en la convocatoria de Junta. <br/> • Coordinar calendario mercantil y trabajo de auditoría. <br/> • Reducir riesgos de impugnación o defectos registrales."
      }
    ]
  },
  {
    id: 'capital-reduction',
    name: 'Informes por Reducción de Capital Social',
    slug: 'informes-reduccion-capital',
    shortDescription: 'Informe para reducciones de capital',
    description: 'Informes de auditoría para la reducción de capital social por pérdidas sirve de base al acuerdo de Junta, conforme al artículo 323 del TRLSC.',
    detailedDescription: 'Actuamos como partner técnico especializado para: <br/><br/> • Planificar el calendario societario. <br/> • Verificar la adecuación legal de la operación. <br/> • Emitir informe conforme a normativa. <br/> • Minimizar riesgos de calificación negativa en el Registro Mercantil. <br/> • Coordinar tiempos en operaciones urgentes.',
    icon: 'Scale',
    featured: false,
    category: 'grants',
    features: [
      'Auditoría del balance de situación utilizado para la reducción.',
      'Verificación del destino del capital reducido y cumplimiento legal.',
      'Soporte en la redacción de las menciones obligatorias en el anuncio de reducción.',
      'Enfoque orientado a la protección del patrimonio social.'
    ],
    faqs: [
      {
        q: "¿Cuándo es obligatoria la reducción de capital por pérdidas y qué debe prever el asesor?",
        a: "La reducción de capital es obligatoria cuando las pérdidas han reducido el patrimonio neto por debajo de las dos terceras partes del capital social y ha transcurrido un ejercicio sin que se haya recuperado el equilibrio patrimonial. <br/><br/> En estos casos, no se trata de una decisión estratégica, sino de una exigencia legal destinada a restablecer la correspondencia entre capital y patrimonio neto. <br/><br/> El despacho mercantil debe prever: <br/><br/> • La formulación de un balance referido a una fecha dentro de los seis meses anteriores al acuerdo. <br/> • La verificación obligatoria de dicho balance por auditor. <br/> • La aprobación por la Junta General. <br/> • La incorporación del balance y del informe a la escritura pública. <br/><br/> Además, en sociedades limitadas deberá analizarse previamente la existencia de reservas, y en sociedades anónimas la situación de la reserva legal y reservas voluntarias, ya que pueden condicionar la operación. Una correcta planificación técnica evita retrasos, defectos registrales y posibles responsabilidades por inacción ante una situación de desequilibrio patrimonial prolongado."
      },
      {
        q: "¿Quién debe nombrar al auditor si la sociedad no está obligada a auditar sus cuentas?",
        a: "Si la sociedad no está obligada a auditoría, el auditor deberá ser nombrado por los administradores para este encargo específico. Una planificación entre el despacho profesional y el auditor que sea acertada y adecuada evita retrasos en la formalización notarial y en la inscripción registral."
      }
    ]
  },

  // ========== CONSULTORÍA Y TRANSACCIONES ==========
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    slug: 'due-diligence',
    shortDescription: 'Análisis exhaustivo para transacciones',
    description: 'Análisis profundo de la situación financiera y riesgos de una empresa en procesos de compraventa o fusiones corporativas.',
    detailedDescription: 'Nuestro trabajo consiste en revisar de forma estructurada la situación económica y financiera de la entidad objeto de análisis, identificando riesgos, contingencias, ajustes potenciales y aspectos críticos que puedan afectar a la valoración o a la negociación. <br/><br/> Nos integramos como partner técnico especializado, proporcionando: <br/><br/> • Análisis de calidad del resultado (quality of earnings). <br/> • Revisión de deuda financiera y pasivos ocultos. <br/> • Evaluación de capital circulante. <br/> • Identificación de riesgos contables relevantes. <br/> • Análisis de coherencia entre información financiera y realidad operativa. <br/> • Revisión de contingencias económicas.',
    icon: 'FileSearch',
    featured: true,
    category: 'other',
    features: [
      'Análisis histórico de estados financieros y tendencias de rentabilidad.',
      'Revisión de las principales contingencias fiscales y legales.',
      'Evaluación del capital circulante neto (Net Working Capital).',
      'Informe detallado con "Red Flags" y áreas de ajuste de precio.'
    ],
    faqs: [
      {
        q: "¿Cómo encaja la due diligence financiera con el trabajo del despacho asesor?",
        a: "La due diligence financiera complementa el asesoramiento jurídico y fiscal. Mientras el colaborador analiza la estructura contractual, las garantías o los riesgos legales, nosotros evaluamos la consistencia financiera del negocio: calidad de los resultados, sostenibilidad del EBITDA, nivel real de endeudamiento, posibles ajustes al precio o contingencias no registradas, entre otras."
      },
      {
        q: "¿Por qué elegir MindAudit® como partner en operaciones corporativas?",
        a: "En una operación corporativa, cada cifra cuenta. <br/><br/> Nuestro papel es daros la seguridad técnica cuando más lo necesitas. <br/><br/> Nos integramos como partner, aportando análisis financiero independiente en procesos de compraventa, entrada de inversores o reestructuraciones. Es llevar a vuestro despacho, a otro nivel."
      }
    ]
  },
  {
    id: 'accounting-review',
    name: 'Revisión Contable',
    slug: 'revision-contable',
    shortDescription: 'Revisión y optimización contable',
    description: 'MindAudit® es miembro de Expertos Contables. Revisamos la información económico-financiera de vuestros clientes y establecemos planes de actuación ante posibles contingencias',
    detailedDescription: 'Este servicio no sustituye la llevanza contable sino que actúa como una segunda capa técnica especializada. Analizamos la consistencia de los estados financieros, detectamos posibles errores de clasificación, riesgos contables relevantes, estimaciones sensibles o áreas que puedan generar contingencias futuras. <br/><br/> Aplicamos metodología basada en riesgos, experiencia en auditoría y herramientas digitales que permiten revisar grandes volúmenes de información de forma eficiente. <br/><br/> Si anticipas problemas, aportas valor al cliente.',
    icon: 'Briefcase',
    featured: false,
    category: 'other',
    features: [
      'Detección de errores contables de forma anticipada.',
      'Optimización de la presentación de los estados financieros.',
      'Asesoramiento en la aplicación de nuevas normas de registro y valoración.',
      'Tranquilidad para los administradores sociales ante la formulación de cuentas.'
    ],
    faqs: [
      {
        q: "¿Nuestro despacho no ofrece servicios contables, ¿Tiene sentido que ofrezcamos este servicio a nuestros clientes?",
        a: "Sí, y precisamente en este caso puede aportar todavía más valor. Muchos despachos jurídicos asesoran operaciones societarias, reestructuraciones, compraventas o situaciones preconcursales donde la información financiera es clave, pero no disponen de estructura contable propia para analizarla con profundidad. <br/><br/> La revisión contable os permite: <br/><br/> • Contrastar la fiabilidad de la información económica antes de una operación. <br/> • Validar cifras que afectan a negociaciones o acuerdos entre socios. <br/> • Detectar posibles riesgos financieros que puedan impactar en la estrategia jurídica. <br/> • Ofrecer al cliente una solución integral sin necesidad de ampliar estructura interna."
      }
    ]
  },
  {
    id: 'grant-audit',
    name: 'Auditoría de Subvenciones',
    slug: 'auditoria-subvenciones',
    shortDescription: 'Verificación de fondos y ayudas públicas',
    description: 'Control Financiero de subvenciones de entidades del sector público, Fondos Next Generation, CDTI’s, Interreg, ayudas FEDER, auditoría de cuentas justificativas, etc…',
    detailedDescription: 'prestamos servicios especializados de auditoría y control financiero de subvenciones, dirigidos tanto a entidades beneficiarias como a despachos profesionales que asesoran en la gestión de fondos públicos.',
    icon: 'Award',
    featured: true,
    category: 'other',
    features: [
      'Verificación detallada de facturas, nóminas y justificantes de pago.',
      'Comprobación del cumplimiento de los hitos técnicos del proyecto.',
      'Emisión de informes según la Orden EHA/1434/2007 o bases específicas.',
      'Acompañamiento en caso de requerimientos de subsanación de la administración.'
    ],
    faqs: [
      {
        q: "¿Qué tipo de clientes suelen necesitar un control financiero de subvenciones?",
        a: "Este servicio es especialmente útil para clientes del despacho que: <br/><br/> • Han obtenido subvenciones relevantes (importe elevado o plurianuales)<br/> • Gestionan Fondos Next Generation, CDTI, Interreg o ayudas europeas<br/> • Ejecutan proyectos de I+D+i<br/> • Reciben financiación pública para inversiones o digitalización<br/> • Son entidades del sector público o entes dependientes<br/> • Son asociaciones, fundaciones o entidades sin ánimo de lucro con financiación pública recurrente<br/><br/> En estos casos, el riesgo de reintegro o corrección financiera puede ser significativo, y contar con una revisión independiente aporta seguridad antes de presentar la justificación."
      },
      {
        q: "¿Qué perfil de empresa debería plantearse este servicio de forma preventiva?",
        a: "Es recomendable para: <br/><br/> • Empresas en crecimiento que acceden por primera vez a ayudas públicas<br/> • Sociedades que combinan varias subvenciones y pueden incurrir en doble financiación<br/> • Entidades que no disponen de contabilidad separada estructurada<br/> • Organizaciones con proyectos complejos o subcontrataciones relevantes<br/> • Clientes que han recibido requerimientos o controles en el pasado<br/><br/> En estos perfiles, un control financiero preventivo permite anticiparse a incidencias y reforzar la solidez del expediente ante cualquier revisión futura."
      }
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
