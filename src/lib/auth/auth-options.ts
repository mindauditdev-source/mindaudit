import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import { loginUser } from '@/services/auth.service'
import { loginSchema } from '@/validators/auth.validator'
import { UserRole } from '@prisma/client'

// Extender los tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      image?: string | null
      colaboradorId?: string | null
      empresaId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    image?: string | null
    colaborador?: {
      id: string
      companyName: string
      status: string
    } | null
    empresa?: {
      id: string
      companyName: string
      status: string
    } | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    colaboradorId?: string | null
    empresaId?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
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
          const validatedData = loginSchema.parse(credentials)

          // Autenticar usuario
          const result = await loginUser(validatedData)

          if (!result.success || !result.user) {
            throw new Error(result.error || 'Credenciales inválidas')
          }

          // Retornar usuario para NextAuth
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            image: result.user.image,
            colaborador: result.user.colaborador,
            empresa: result.user.empresa,
          }
        } catch (error: any) {
          console.error('Error en authorize:', error)
          throw new Error(error.message || 'Error al iniciar sesión')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Inicial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.colaboradorId = user.colaborador?.id || null
        token.empresaId = user.empresa?.id || null
      }

      // Update session (cuando se llama a update())
      if (trigger === 'update' && session) {
        token.name = session.name || token.name
        token.email = session.email || token.email
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.colaboradorId = token.colaboradorId
        session.user.empresaId = token.empresaId
      }

      return session
    },
  },
  events: {
    async signIn() {
      // console.log(`✅ Usuario ${user.email} inició sesión`)
    },
    async signOut() {
      // console.log(`👋 Usuario ${token.email} cerró sesión`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
