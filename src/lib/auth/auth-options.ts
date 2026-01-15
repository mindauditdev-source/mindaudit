import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import { loginUser, getUserById } from '@/services/auth.service'
import { loginSchema } from '@/validators/auth.validator'
import type { UserRole, UserStatus } from '@prisma/client'

// Extender tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      status: UserStatus
      image: string | null
      emailVerified: Date | null
      partnerId?: string
      auditorId?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
    image: string | null
    emailVerified: Date | null
    partnerId?: string
    auditorId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    status: UserStatus
    partnerId?: string
    auditorId?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validar credenciales
          const validatedCredentials = loginSchema.parse(credentials)

          // Intentar login
          const result = await loginUser(validatedCredentials)

          if (!result.success || !result.user) {
            throw new Error(result.error || 'Credenciales inválidas')
          }

          // Retornar usuario para NextAuth
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            status: result.user.status,
            image: result.user.image,
            emailVerified: result.user.emailVerified,
            partnerId: result.user.partner?.id,
            auditorId: result.user.auditor?.id,
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Primer login
      if (user) {
        token.id = user.id
        token.role = user.role
        token.status = user.status
        token.partnerId = user.partnerId
        token.auditorId = user.auditorId
      }

      // Actualización de sesión
      if (trigger === 'update' && session) {
        // Recargar datos del usuario desde la BD
        const updatedUser = await getUserById(token.id)
        if (updatedUser) {
          token.name = updatedUser.name
          token.email = updatedUser.email
          token.picture = updatedUser.image
          token.role = updatedUser.role
          token.status = updatedUser.status
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
        session.user.partnerId = token.partnerId
        session.user.auditorId = token.auditorId
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Permite redirecciones relativas
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Permite redirecciones a la misma URL base
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`Usuario ${user.email} ha iniciado sesión`)
    },
    async signOut({ token }) {
      console.log(`Usuario ${token.email} ha cerrado sesión`)
      
      // Crear log de auditoría
      if (token.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id,
            userRole: token.role,
            action: 'LOGOUT',
            entity: 'User',
            entityId: token.id,
            description: 'Usuario cerró sesión',
          },
        })
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
}
