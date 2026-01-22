import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Rutas públicas que no requieren autenticación
    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/servicios',
      '/sobre-nosotros',
      '/partners',
      '/presupuesto',
      '/contacto',
      '/trabaja-con-nosotros',
      '/legal',
    ]

    // Permitir acceso a rutas públicas
    if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
      return NextResponse.next()
    }

    // Si no está autenticado, redirigir a login
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Protección basada en roles
    const role = token.role as UserRole

    // Rutas de Admin
    if (path.startsWith('/admin')) {
      if (role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Rutas de Colaborador
    if (path.startsWith('/colaborador')) {
      if (role !== UserRole.COLABORADOR) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Rutas de Empresa
    if (path.startsWith('/empresa')) {
      if (role !== UserRole.EMPRESA) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Dashboard general - redirigir según rol
    if (path === '/dashboard') {
      switch (role) {
        case UserRole.ADMIN:
          return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        case UserRole.COLABORADOR:
          return NextResponse.redirect(new URL('/colaborador/dashboard', req.url))
        case UserRole.EMPRESA:
          return NextResponse.redirect(new URL('/empresa/dashboard', req.url))
        default:
          return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Rutas públicas
        const publicPaths = [
          '/',
          '/login',
          '/register',
          '/servicios',
          '/sobre-nosotros',
          '/partners',
          '/presupuesto',
          '/contacto',
          '/trabaja-con-nosotros',
          '/legal',
        ]

        // Permitir acceso a rutas públicas sin token
        if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
          return true
        }

        // Rutas protegidas requieren token
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
