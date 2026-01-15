import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/magic-link',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/servicios',
  '/contacto',
  '/about',
  '/legal/terminos',
  '/legal/privacidad',
]

// Rutas que son solo para usuarios no autenticados (como login/register)
const authRoutes = [
  '/login',
  '/register',
  '/magic-link',
  '/forgot-password',
  '/reset-password',
]

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const isAuth = !!token
    const isAuthRoute = authRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    )

    // Si el usuario está autenticado e intenta acceder a rutas de auth (login, etc),
    // redirigir al dashboard correspondiente
    if (isAuth && isAuthRoute) {
      if (token.role === 'PARTNER') {
        return NextResponse.redirect(new URL('/partner/dashboard', req.url))
      } else if (token.role === 'AUDITOR') {
        return NextResponse.redirect(new URL('/auditor/dashboard', req.url))
      } else if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    }

    // Validación de roles para rutas protegidas
    if (
      req.nextUrl.pathname.startsWith('/partner') &&
      token?.role !== 'PARTNER' &&
      token?.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/login', req.url)) // O página de no autorizado
    }

    if (
      req.nextUrl.pathname.startsWith('/auditor') &&
      token?.role !== 'AUDITOR' &&
      token?.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isPublicRoute = publicRoutes.some((route) =>
          req.nextUrl.pathname.startsWith(route)
        )
        
        // Si es ruta pública, permitir siempre
        if (isPublicRoute) return true

        // Si no es pública, requerir token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
