/**
 * Configuración de navegación y rutas del proyecto MindAudit Spain
 * 
 * Este archivo centraliza todas las rutas de la aplicación para:
 * - Evitar hardcoding de URLs
 * - Facilitar refactoring
 * - Type safety en navegación
 * - Documentación clara de la estructura
 */

// ============================================================================
// RUTAS PÚBLICAS
// ============================================================================

export const publicRoutes = {
  home: '/',
  aboutUs: '/sobre-nosotros',
  services: '/servicios',
  partners: '/colaboradores',
  careers: '/trabaja-con-nosotros',
  contact: '/contacto',
  budget: '/presupuesto',
  legal: {
    notice: '/legal/aviso-legal',
    privacy: '/legal/privacidad',
    cookies: '/legal/cookies',
    terms: '/legal/terminos',
  },
} as const;

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================

export const authRoutes = {
  login: '/login',
  register: '/register',
  magicLink: '/magic-link',
  verifyEmail: '/verify-email',
} as const;

// ============================================================================
// RUTAS DEL PARTNER
// ============================================================================

export const partnerRoutes = {
  dashboard: '/partner/dashboard',
  
  clients: {
    list: '/partner/clientes',
    new: '/partner/clientes/nuevo',
    detail: (id: string) => `/partner/clientes/${id}`,
  },
  
  budgets: {
    list: '/partner/presupuestos',
    new: '/partner/presupuestos/nuevo',
    detail: (id: string) => `/partner/presupuestos/${id}`,
  },
  
  consultations: {
    list: '/partner/consultas',
    new: '/partner/consultas/nueva',
    detail: (id: string) => `/partner/consultas/${id}`,
  },
  
  meetings: '/partner/reuniones',
  news: '/partner/noticias',
  accountStatement: '/partner/estado-cuenta',
  invoices: '/partner/facturas',
  contract: '/partner/contrato',
  profile: '/partner/perfil',
} as const;

// ============================================================================
// RUTAS DEL AUDITOR
// ============================================================================

export const auditorRoutes = {
  dashboard: '/auditor/dashboard',
  
  partners: {
    list: '/auditor/asociados',
    new: '/auditor/asociados/nuevo',
    detail: (id: string) => `/auditor/asociados/${id}`,
  },
  
  clients: '/auditor/clientes',
  budgets: '/auditor/presupuestos',
  consultations: '/auditor/consultas',
  
  communications: {
    list: '/auditor/comunicados',
    new: '/auditor/comunicados/nuevo',
  },
  
  metrics: '/auditor/metricas',
  settings: '/auditor/configuracion',
} as const;

// ============================================================================
// RUTAS DE API
// ============================================================================

export const apiRoutes = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    magicLink: '/api/auth/magic-link',
    verify: '/api/auth/verify',
  },
  
  partners: {
    base: '/api/partners',
    byId: (id: string) => `/api/partners/${id}`,
  },
  
  auditors: {
    base: '/api/auditors',
    byId: (id: string) => `/api/auditors/${id}`,
  },
  
  clients: {
    base: '/api/clients',
    byId: (id: string) => `/api/clients/${id}`,
  },
  
  budgets: {
    base: '/api/budgets',
    byId: (id: string) => `/api/budgets/${id}`,
  },
  
  consultations: {
    base: '/api/consultations',
    byId: (id: string) => `/api/consultations/${id}`,
    reply: (id: string) => `/api/consultations/${id}/reply`,
  },
  
  meetings: '/api/meetings',
  news: '/api/news',
  invoices: '/api/invoices',
  contracts: '/api/contracts',
  communications: '/api/communications',
  metrics: '/api/metrics',
  upload: '/api/upload',
} as const;

// ============================================================================
// MENÚ DE NAVEGACIÓN - LANDING PAGE
// ============================================================================

export const landingNavigation = [
  { name: 'Sobre Nosotros', href: publicRoutes.aboutUs },
  { name: 'Servicios', href: publicRoutes.services },
  { name: 'Colaboradores', href: publicRoutes.partners },
  { name: 'Trabaja con nosotros', href: publicRoutes.careers },
  { name: 'Contacto', href: publicRoutes.contact },
] as const;

// ============================================================================
// MENÚ DE NAVEGACIÓN - PARTNER DASHBOARD
// ============================================================================

export const partnerNavigation = [
  {
    name: 'Dashboard',
    href: partnerRoutes.dashboard,
    icon: 'LayoutDashboard',
  },
  {
    name: 'Clientes',
    href: partnerRoutes.clients.list,
    icon: 'Users',
  },
  {
    name: 'Presupuestos',
    href: partnerRoutes.budgets.list,
    icon: 'FileText',
  },
  {
    name: 'Consultas',
    href: partnerRoutes.consultations.list,
    icon: 'MessageSquare',
  },
  {
    name: 'Reuniones',
    href: partnerRoutes.meetings,
    icon: 'Calendar',
  },
  {
    name: 'Noticias',
    href: partnerRoutes.news,
    icon: 'Newspaper',
  },
  {
    name: 'Estado de Cuenta',
    href: partnerRoutes.accountStatement,
    icon: 'Wallet',
  },
  {
    name: 'Facturas',
    href: partnerRoutes.invoices,
    icon: 'Receipt',
  },
  {
    name: 'Contrato',
    href: partnerRoutes.contract,
    icon: 'FileSignature',
  },
  {
    name: 'Perfil',
    href: partnerRoutes.profile,
    icon: 'User',
  },
] as const;

// ============================================================================
// MENÚ DE NAVEGACIÓN - AUDITOR DASHBOARD
// ============================================================================

export const auditorNavigation = [
  {
    name: 'Dashboard',
    href: auditorRoutes.dashboard,
    icon: 'LayoutDashboard',
  },
  {
    name: 'Asociados',
    href: auditorRoutes.partners.list,
    icon: 'Briefcase',
  },
  {
    name: 'Clientes',
    href: auditorRoutes.clients,
    icon: 'Users',
  },
  {
    name: 'Presupuestos',
    href: auditorRoutes.budgets,
    icon: 'FileText',
  },
  {
    name: 'Consultas',
    href: auditorRoutes.consultations,
    icon: 'MessageSquare',
  },
  {
    name: 'Comunicados',
    href: auditorRoutes.communications.list,
    icon: 'Megaphone',
  },
  {
    name: 'Métricas',
    href: auditorRoutes.metrics,
    icon: 'BarChart',
  },
  {
    name: 'Configuración',
    href: auditorRoutes.settings,
    icon: 'Settings',
  },
] as const;

// ============================================================================
// FOOTER NAVIGATION
// ============================================================================

export const footerNavigation = {
  company: [
    { name: 'Sobre Nosotros', href: publicRoutes.aboutUs },
    { name: 'Servicios', href: publicRoutes.services },
    { name: 'Colaboradores', href: publicRoutes.partners },
    { name: 'Blog & Insights', href: '/blog' }, // Por definir
  ],
  services: [
    { name: 'Auditoría Financiera', href: '/servicios#financiera' },
    { name: 'Auditoría de Subvenciones', href: '/servicios#subvenciones' },
    { name: 'Auditoría Ecoembes', href: '/servicios#ecoembes' },
    { name: 'Due Diligence', href: '/servicios#due-diligence' },
  ],
  legal: [
    { name: 'Aviso Legal', href: publicRoutes.legal.notice },
    { name: 'Política de Privacidad', href: publicRoutes.legal.privacy },
    { name: 'Política de Cookies', href: publicRoutes.legal.cookies },
    { name: 'Términos de Uso', href: publicRoutes.legal.terms },
  ],
} as const;

// ============================================================================
// UTILIDADES DE NAVEGACIÓN
// ============================================================================

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 */
export function getDashboardRoute(role: 'PARTNER' | 'AUDITOR' | 'ADMIN'): string {
  switch (role) {
    case 'PARTNER':
      return partnerRoutes.dashboard;
    case 'AUDITOR':
    case 'ADMIN':
      return auditorRoutes.dashboard;
    default:
      return publicRoutes.home;
  }
}

/**
 * Verifica si una ruta es pública
 */
export function isPublicRoute(pathname: string): boolean {
  const publicPaths = Object.values(publicRoutes).flat();
  return publicPaths.some(path => 
    typeof path === 'string' && pathname.startsWith(path)
  );
}

/**
 * Verifica si una ruta requiere autenticación
 */
export function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/partner') || pathname.startsWith('/auditor');
}

/**
 * Obtiene el breadcrumb para una ruta
 */
export function getBreadcrumb(pathname: string): { name: string; href: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { name: string; href: string }[] = [
    { name: 'Inicio', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name,
      href: currentPath,
    });
  });

  return breadcrumbs;
}
