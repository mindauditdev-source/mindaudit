import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auditServices } from '@/config/services';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, ShieldCheck } from 'lucide-react';

export function ServicesSection() {
  const serviceCategories = [
    {
      title: "Auditoría de Cuentas",
      items: auditServices.filter(s => s.category === 'financial')
    },
    {
      title: "Informes especializados",
      items: auditServices.filter(s => s.category === 'special')
    },
    {
      title: "Informes Especiales",
      items: auditServices.filter(s => s.category === 'grants')
    },
    {
      title: "Otros",
      items: auditServices.filter(s => s.category === 'other')
    }
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container relative z-10 mx-auto px-4">
           <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-6xl font-extrabold mb-8 leading-tight">
                Servicios Integrales de auditoría <br />
                <span className="text-blue-500">Complementa vuestra oferta de servicios sin necesidad de ampliar la plantilla y sin costes innecesarios</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
               Ofrecemos un catálogo completo que ayuda a la captación y retención de clientes para lanzar 🚀 vuestro despacho profesional al nivel de excelencia
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
                  {category.items.map((item, i) => {
                    const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcon) || ShieldCheck;
                    
                    return (
                      <Link key={i} href={`/servicios/${item.slug}`}>
                        <Card className="border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group h-full">
                          <CardContent className="p-6">
                            <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                              {item.shortDescription}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
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
