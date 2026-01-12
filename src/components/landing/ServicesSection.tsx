import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  Recycle, 
  BarChart3, 
  ShieldCheck, 
  Scale,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ServicesSection() {
  const services = [
    {
      icon: Building2,
      title: 'Auditoría Financiera',
      description: 'Auditoría estatutaria y voluntaria de cuentas anuales individuales y consolidadas con el máximo rigor técnico y cumplimiento normativo.',
      link: '/servicios/auditoria-financiera'
    },
    {
      icon: CheckCircle2,
      title: 'Subvenciones',
      description: 'Revisión y justificación de cuentas para ayudas públicas, proyectos CDTI, fondos Next Generation y subvenciones europeas.',
      link: '/servicios/subvenciones'
    },
    {
      icon: Recycle,
      title: 'Ecoembes / Plástico',
      description: 'Verificación experta de declaraciones de envases y del impuesto especial sobre envases de plástico no reutilizables.',
      link: '/servicios/ecoembes'
    },
    {
      icon: BarChart3,
      title: 'Due Diligence',
      description: 'Análisis financiero exhaustivo (Buy-side / Sell-side) para minimizar riesgos en procesos de compraventa y fusiones.',
      link: '/servicios/due-diligence'
    },
    {
      icon: ShieldCheck,
      title: 'Control Interno',
      description: 'Evaluación y diseño de sistemas de control interno, mapas de riesgos y optimización de procesos corporativos.',
      link: '/servicios/control-interno'
    },
    {
      icon: Scale,
      title: 'Forensic',
      description: 'Prevención y detección de fraude, informes periciales y asistencia en litigios y disputas financieras complejas.',
      link: '/servicios/forensic'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Services Header Section */}
      <section className="bg-[#1e293b] text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Auditoría, consultoría y servicios legales con el rigor, la transparencia y 
              la tecnología que su empresa necesita para crecer con seguridad.
            </p>
          </div>
        </div>
        {/* Decorative dark bar at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </section>

      {/* Main Content Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Services Grid */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col">
                    <CardHeader className="pt-8 px-8">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <service.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-3">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 grow flex flex-col">
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <Link 
                        href={service.link} 
                        className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Saber más
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Form & Contact */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                {/* Form Card */}
                <Card className="border-none shadow-2xl overflow-hidden">
                  <div className="bg-[#0f4c81] p-6 text-white text-center">
                    <div className="flex justify-center mb-2">
                      <Mail className="h-5 w-5 opacity-80" />
                    </div>
                    <h3 className="text-xl font-bold">Solicitar Presupuesto</h3>
                    <p className="text-xs text-blue-200 mt-1">Respuesta garantizada en 24h</p>
                  </div>
                  <CardContent className="p-8 space-y-5 bg-white">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">
                        Nombre completo
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">
                        Empresa
                      </label>
                      <input 
                        type="text" 
                        placeholder="Nombre de su empresa" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">
                        Email corporativo
                      </label>
                      <input 
                        type="email" 
                        placeholder="juan@empresa.com" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">
                        Servicio de interés
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-white appearance-none cursor-pointer">
                        <option value="">Seleccione una opción</option>
                        <option value="auditoria">Auditoría Financiera</option>
                        <option value="subvenciones">Subvenciones</option>
                        <option value="ecoembes">Ecoembes / Plástico</option>
                        <option value="due-diligence">Due Diligence</option>
                        <option value="control-interno">Control Interno</option>
                        <option value="forensic">Forensic</option>
                      </select>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg mt-2 group">
                      Enviar solicitud
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                    
                    <p className="text-[10px] text-center text-gray-400">
                      Al enviar este formulario acepta nuestra <Link href="/legal/privacidad" className="underline hover:text-blue-500">política de privacidad</Link>.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Shortcuts */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Llámenos</p>
                      <p className="text-sm font-bold text-gray-900">+34 912 345 678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Escríbanos</p>
                      <p className="text-sm font-bold text-gray-900">info@mindaudit.es</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Certifications Row */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
              Certificaciones y Garantías
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              <CertificationItem label="ROAC" />
              <CertificationItem label="ISO 9001" />
              <CertificationItem label="ENS" />
              <CertificationItem label="REA" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CertificationItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
      <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center">
        <CheckCircle2 className="h-3 w-3 text-gray-500" />
      </div>
      {label}
    </div>
  );
}
