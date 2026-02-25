'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "¿Qué es exactamente y para qué sirve la plataforma de MindAudit para colaboradores?",
    answer: "Nuestra plataforma es una herramienta tecnológica diseñada para canalizar las oportunidades de negocio relacionadas con el sector de la auditoría. Permite al colaborador registrar potenciales clientes, recibir propuestas de honorarios y realizar consultas técnicas relacionadas con la contabilidad y la auditoría de cuentas. Con MindAudit vuestro despacho abrirá un nuevo abanico de servicios sin invertir en estructura y sin preocuparse por el cumplimiento normativo exigido."
  },
  {
    question: "¿Qué beneficios obtiene nuestro despacho al colaborar con una firma de auditoría especializada?",
    answer: "La colaboración permite ampliar tu cartera de servicios sin asumir la complejidad regulatoria, los riesgos ni las obligaciones propias de la actividad de auditoría. Podéis ofrecer a vuestros clientes un servicio altamente especializado reforzando el posicionamiento profesional de vuestra firma y generando nuevas oportunidades de ingresos, todo ello manteniendo la relación directa con el cliente y sin perder independencia ni control comercial."
  },
  {
    question: "¿Podemos seguir trabajando con otras firmas de auditoría?",
    answer: "Sí, MindAudit no es un acuerdo en exclusiva y el cliente podrá elegir otros presupuestos si así lo desea. MindAudit facilita el objetivo de llevar los servicios reservados a los despachos de auditores de cuentas a otros despachos profesionales. Con MindAudit es más fácil que nunca dar un salto de calidad en la oferta de vuestra firma."
  },
  {
    question: "¿Quién firma el contrato de auditoría con el cliente?",
    answer: "El contrato de auditoría lo firma directamente la firma de auditoría inscrita en el ROAC, ya que es la única habilitada legalmente para prestar y asumir la responsabilidad del servicio conforme a la Ley 22/2015 y su normativa de desarrollo. En coherencia con ello, la facturación del servicio también se realiza directamente por la firma de auditoría."
  },
  {
    question: "¿Cómo se coordinan ambos despachos (colaborador y MindAudit) en la práctica?",
    answer: "La colaboración está diseñada para que el cliente perciba un servicio fluido, ágil y perfectamente coordinado, con un único canal claro de comunicación y una planificación conjunta desde el inicio. Cada firma asume su ámbito de actuación con total transparencia: el despacho profesional continúa prestando sus servicios habituales y la firma de auditoría desarrolla el trabajo con plena independencia técnica y bajo su propia responsabilidad."
  },
  {
    question: "¿Cómo se protege al cliente frente a posibles conflictos de interés?",
    answer: "La protección del cliente es prioritaria. Antes de aceptar o continuar cualquier encargo, MindAudit aplica procedimientos formales de evaluación de independencia y análisis de incompatibilidades, tal como exige la normativa vigente. Si se detectara cualquier riesgo potencial, se adoptan las salvaguardas necesarias o, en su caso, se declina el encargo. Puesto que ya existe una relación previa entre colaborador y MindAudit, los posibles casos de discrepancias técnicas se reducen drásticamente, por lo que el cliente suele percibir uniformidad de criterios entre su despacho de confianza y su auditor."
  },
  {
    question: "¿Puede el despacho ofrecer el servicio de auditoría como propio?",
    answer: "No. El servicio de auditoría solo puede ser prestado y asumido legalmente por una firma inscrita en el ROAC, que es quien firma el contrato y emite el informe bajo su responsabilidad profesional. La colaboración permite al despacho ampliar su oferta de servicios a través de un partner especializado, pero siempre manteniendo la independencia, la identidad y la responsabilidad jurídica de la firma auditora. No obstante, los usuarios registrados en el programa de incentivos, pueden utilizar el logo y la marca MindAudit en su imagen corporativa."
  },
  {
    question: "¿Podemos rescindir la colaboración en cualquier momento?",
    answer: "Sí. La colaboración puede resolverse conforme a los términos pactados entre las partes, garantizando siempre una transición ordenada y el respeto a los compromisos en curso. En todo caso, los encargos de auditoría ya aceptados se gestionarán conforme a la normativa aplicable y a las obligaciones profesionales vigentes, priorizando la continuidad del servicio y la seguridad jurídica del cliente."
  },
  {
    question: "¿Qué son las igualas de consultas y cómo pueden beneficiarme como colaborador?",
    answer: "Las igualas de consultas son paquetes de horas de asesoramiento técnico especializado que pueden ser contratadas dentro de la plataforma. Os permiten acceder directamente al equipo de MindAudit para resolver dudas complejas en materia contable, auditoría, cumplimiento normativo o criterios técnicos, ya sea en forma de chat, videollamadas o reuniones con especialistas. Descubre las modalidades de iguala disponibles y reforzad vuestra firma con soporte experto cuando sea necesario."
  },
  {
    question: "¿Cómo puedo empezar a colaborar con MindAudit y activar las ventajas?",
    answer: "Es muy sencillo. Solo tienes que crear tu cuenta como colaborador en la plataforma de MindAudit, completar el proceso de alta y comenzar a canalizar oportunidades de auditoría de tus propios clientes. Desde ese momento podrás gestionar propuestas, hacer seguimiento de estados y visualizar los incentivos generados de forma automática y transparente. Crea tu cuenta y descubre cómo funciona nuestro modelo de colaboración, ¡es fácil, rápido y sin coste!"
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">RESOLVEMOS TUS DUDAS</span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2 mb-4">
            Preguntas Frecuentes (FAQ)
          </h2>
          <p className="text-lg text-gray-500">
            Todo lo que necesitas saber sobre nuestro modelo de colaboración y cómo MindAudit puede potenciar tu despacho.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-100 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors ${openIndex === index ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                </div>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-blue-600 shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-0 ml-14">
                      <div className="h-px bg-gray-100 mb-6 w-full" />
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
