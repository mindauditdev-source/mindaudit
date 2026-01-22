import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
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

  // Verificar si es una ruta pública
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))

  console.log("token", token);
  
  if (isPublicPath) {
    // Si el usuario ya está autenticado y trata de acceder a login o register, redirigir al dashboard
    if (token && (path === '/login' || path === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Si no está autenticado y no es ruta pública, redirigir a login
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }

  // Protección basada en roles
  const role = token.role as UserRole

  // Rutas de Admin (Auditor)
  if (path.startsWith('/auditor') || path.startsWith('/admin')) {
    if (role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Rutas de Colaborador (Partner)
  if (path.startsWith('/partner') || path.startsWith('/colaborador')) {
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
        return NextResponse.redirect(new URL('/auditor/dashboard', req.url))
      case UserRole.COLABORADOR:
        return NextResponse.redirect(new URL('/partner/dashboard', req.url))
      case UserRole.EMPRESA:
        return NextResponse.redirect(new URL('/empresa/dashboard', req.url))
      default:
        return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

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
