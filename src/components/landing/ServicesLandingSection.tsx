import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, ShieldCheck, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { auditServices } from '@/config/services';

export function ServicesLandingSection() {
  // Obtener los 4 servicios destacados para la landing
  const featuredServices = auditServices.filter(s => s.featured).slice(0, 4);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">NUESTRA EXPERIENCIA</span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2">
            Servicios de auditoría especializados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => {
            const IconComponent = (LucideIcons[service.icon as keyof typeof LucideIcons] as LucideIcon) || ShieldCheck;
            
            return (
              <Card key={index} className="border-gray-100 shadow-sm hover:shadow-lg transition-shadow bg-gray-50/50 flex flex-col h-full hover:border-blue-100">
                <CardHeader className="pb-4 pt-8">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                </CardHeader>
                <CardContent className="grow">
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </CardContent>
                <CardFooter className="pb-8 pt-0">
                  <Link href={`/servicios/${service.slug}`} className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Saber más 
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/servicios" 
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
