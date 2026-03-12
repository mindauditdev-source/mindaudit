import { MetadataRoute } from 'next';
import { auditServices } from '@/config/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mindaudit.es';

  // Public routes from the structure
  const staticRoutes = [
    '',
    '/servicios',
    '/contacto',
    '/sobre-nosotros',
    '/partners',
    '/presupuesto',
    '/trabaja-con-nosotros',
    '/legal/aviso-legal',
    '/legal/privacidad',
    '/legal/cookies',
    '/legal/terminos',
  ];

  const serviceRoutes = auditServices.map((service) => `/servicios/${service.slug}`);

  const allRoutes = [...staticRoutes, ...serviceRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never',
    priority: route === '' ? 1 : route.startsWith('/servicios/') ? 0.9 : 0.8,
  }));
}
