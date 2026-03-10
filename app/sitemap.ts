import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mindaudit.es';

  // Public routes from the structure
  const routes = [
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never',
    priority: route === '' ? 1 : 0.8,
  }));
}
