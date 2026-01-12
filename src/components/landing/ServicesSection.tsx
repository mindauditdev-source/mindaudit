import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck,
  FileText,
  Search,
  Scale,
  Settings,
  Zap,
  Briefcase,
  Layers,
  FileSearch,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ServicesSection() {
  const serviceCategories = [
    {
      title: "Auditoría de Cuentas",
      items: [
        { name: "Auditoría de Cuentas Anuales individuales y grupos", icon: Building2 },
        { name: "Auditoría de Cuentas de empresas del sector Público", icon: Globe },
        { name: "Revisiones Limitadas", icon: Search },
        { name: "Auditoría de procedimientos acordados", icon: Settings },
      ]
    },
    {
      title: "Auditorías Especializadas",
      items: [
        { name: "Auditoría Ecoembes", icon: CheckCircle2 },
        { name: "Auditoría Biocarburantes", icon: Zap },
        { name: "Auditoría SICBIOS", icon: ShieldCheck },
        { name: "Auditoría CORES", icon: Layers },
      ]
    },
    {
        title: "Informes Especiales y Mercantiles",
        items: [
          { name: "Informes Especiales de aumento de Capital Social", icon: FileText },
          { name: "Informes por Reducción de Capital Social", icon: Scale },
          { name: "Informes Complementarios del Banco de España", icon: LandmarkIcon },
        ]
    },
    {
      title: "Consultoría y Transacciones",
      items: [
        { name: "Due Diligence", icon: FileSearch },
        { name: "Revisión Contable", icon: Briefcase },
        { name: "Verificación de Estados Financieros", icon: ShieldCheck },
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container relative z-10 mx-auto px-4">
           <div className="max-w-4xl">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Nuestros servicios de auditoría</span>
              <h1 className="text-4xl lg:text-6xl font-extrabold mb-8 leading-tight">
                Servicios Integrales de auditoría, <br />
                <span className="text-blue-500">adaptados a la realidad de su negocio</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                Ofrecemos un catálogo completo de soluciones técnicas para garantizar la transparencia, 
                el cumplimiento y la seguridad financiera de su organización.
              </p>
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {serviceCategories.map((category, idx) => (
              <div key={idx} className="space-y-8">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                  <span className="h-8 w-1.5 bg-blue-600 rounded-full"></span>
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.items.map((item, i) => (
                    <Card key={i} className="border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                      <CardContent className="p-6">
                        <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
                           {item.icon && <item.icon className="h-5 w-5" />}
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-snug">
                          {item.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Requiere un servicio personalizado?</h2>
            <p className="text-slate-500 mb-10 max-w-xl mx-auto">
                Nuestro equipo de expertos está listo para analizar sus necesidades específicas y ofrecerle una propuesta a medida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-xl font-bold shadow-lg">
                    <Link href="/presupuesto">Solicitar presupuesto</Link>
                </Button>
                <Button variant="outline" asChild className="border-slate-200 bg-white text-slate-700 h-14 px-10 rounded-xl font-bold">
                    <Link href="/contacto">Contactar con un experto</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}

function LandmarkIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
        </svg>
    )
}
