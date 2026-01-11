# 🏢 MindAudit Spain SLP - Plataforma de Auditoría

![MindAudit Spain](public/images/logo.svg)

**Rigor. Transparencia. Tecnología al servicio de la excelencia en auditoría.**

---

## 📋 Descripción del Proyecto

MindAudit Spain es una plataforma de auditoría que conecta despachos profesionales (gestorías, abogados, economistas) con servicios de auditoría especializados. La plataforma facilita la colaboración entre MindAudit y sus partners, permitiendo:

- 🤝 Gestión de colaboraciones y acuerdos
- 💼 Gestión de clientes aportados por partners
- 📊 Solicitud y seguimiento de presupuestos de auditoría
- 💬 Sistema de consultas bidireccional
- 📅 Agendamiento de reuniones (Calendly)
- 📰 Publicación de noticias y comunicados
- 💰 Gestión de comisiones y facturación
- 📄 Gestión de contratos y documentación

---

## 🎯 Público Objetivo

**Partners (Despachos Profesionales):**

- Gestorías
- Abogados
- Economistas
- Asesores fiscales
- Otros profesionales que quieran ofrecer servicios de auditoría a sus clientes

**Modelo de Negocio:**

- Acuerdo de colaboración con MindAudit Spain
- Comisión por cada encargo conseguido
- Plataforma como punto de contacto permanente

---

## 🏗️ Arquitectura

### Decisión: Monolito Modular

Este proyecto está construido como un **monolito modular** usando Next.js 14+ (App Router).

**Ventajas:**

- ✅ Simplicidad en deployment
- ✅ Desarrollo más rápido
- ✅ Menor complejidad operacional
- ✅ Código compartido entre módulos
- ✅ Escalabilidad vertical suficiente

**Estructura modular preparada para:**

- Fácil mantenimiento
- Posible extracción de microservicios en el futuro
- Separación clara de responsabilidades

### Stack Tecnológico

#### Frontend

- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Forms:** React Hook Form + Zod
- **State:** React Context / Zustand
- **Animations:** Framer Motion

#### Backend

- **Runtime:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** NextAuth.js / Custom Magic Links
- **Validation:** Zod
- **Email:** Resend / Nodemailer
- **Storage:** AWS S3 / Cloudinary / Vercel Blob

#### DevOps

- **Hosting:** Vercel / Railway / AWS
- **Database:** Supabase / Railway / AWS RDS
- **Email:** Hostinger + Resend
- **Monitoring:** Vercel Analytics / Sentry

---

## 📁 Estructura del Proyecto

```
mindaudit/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (public)/          # Landing page y páginas públicas
│   ├── (dashboard)/       # Dashboards (partner y auditor)
│   └── api/               # API Routes
│
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes UI primitivos
│   │   ├── layout/       # Layouts (Header, Footer, Sidebar)
│   │   ├── landing/      # Componentes de landing page
│   │   ├── auth/         # Componentes de autenticación
│   │   ├── partner/      # Componentes del partner
│   │   ├── auditor/      # Componentes del auditor
│   │   ├── shared/       # Componentes compartidos
│   │   └── forms/        # Formularios
│   │
│   ├── lib/              # Utilidades y configuraciones
│   │   ├── auth/         # Autenticación
│   │   ├── db/           # Base de datos (Prisma)
│   │   ├── email/        # Emails
│   │   ├── storage/      # Almacenamiento de archivos
│   │   ├── integrations/ # Integraciones (Calendly, etc.)
│   │   └── utils/        # Utilidades
│   │
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom React Hooks
│   ├── services/         # Servicios de negocio
│   ├── middleware/       # Middleware para API
│   ├── validators/       # Schemas de validación (Zod)
│   └── config/           # Configuraciones
│
├── prisma/               # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/               # Archivos estáticos
└── docs/                 # Documentación
```

Para más detalles, consulta [.agent/workflows/architecture.md](.agent/workflows/architecture.md)

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) / npm / yarn
- PostgreSQL 14+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mindaudit/mindaudit-spain.git
cd mindaudit-spain

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Configurar base de datos
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🎨 Características Principales

### Para Partners (Despachos Profesionales)

✅ **Gestión de Clientes**

- Alta/baja de clientes aportados
- Datos básicos y de contacto
- Historial de auditorías

✅ **Solicitud de Presupuestos**

- Formulario de solicitud
- Subida de documentación
- Seguimiento de estado

✅ **Consultas al Auditor**

- Sistema de mensajería
- Adjuntar archivos
- Historial de conversaciones

✅ **Agenda de Reuniones**

- Integración con Calendly
- Programación de llamadas
- Recordatorios

✅ **Estado de Cuenta**

- Visualización de comisiones
- Historial de pagos
- Facturas descargables

✅ **Noticias e Información**

- Comunicados de MindAudit
- Actualizaciones normativas
- Recursos útiles

### Para Auditores (MindAudit Spain)

✅ **Gestión de Partners**

- Alta/baja de asociados
- Gestión de contratos
- Estado de colaboración

✅ **Gestión de Presupuestos**

- Revisión de solicitudes
- Envío de presupuestos
- Aprobación/rechazo

✅ **Respuesta a Consultas**

- Sistema de mensajería
- Envío de documentación
- Resolución de dudas

✅ **Comunicados**

- Publicación de noticias
- Mailings informativos
- Notificaciones

✅ **Métricas y Estadísticas**

- Dashboard de KPIs
- Reportes de actividad
- Análisis de partners

---

## 🗺️ Rutas Principales

### Públicas

- `/` - Landing page
- `/servicios` - Servicios de auditoría
- `/presupuesto` - Solicitud de presupuesto
- `/contacto` - Contacto

### Autenticación

- `/login` - Inicio de sesión
- `/register` - Registro de partner
- `/magic-link` - Magic link login

### Partner Dashboard

- `/partner/dashboard` - Dashboard principal
- `/partner/clientes` - Gestión de clientes
- `/partner/presupuestos` - Presupuestos
- `/partner/consultas` - Consultas
- `/partner/estado-cuenta` - Estado de cuenta

### Auditor Dashboard

- `/auditor/dashboard` - Dashboard principal
- `/auditor/asociados` - Gestión de partners
- `/auditor/presupuestos` - Todos los presupuestos
- `/auditor/consultas` - Todas las consultas
- `/auditor/metricas` - Métricas y estadísticas

---

## 🔐 Roles y Permisos

### PARTNER (Asociado)

- Gestionar sus propios clientes
- Solicitar presupuestos
- Enviar consultas
- Ver su estado de cuenta
- Agendar reuniones

### AUDITOR (MindAudit)

- Gestionar todos los partners
- Ver todos los clientes
- Responder presupuestos
- Responder consultas
- Enviar comunicados
- Ver métricas globales

### ADMIN (Administrador)

- Acceso total al sistema
- Gestión de usuarios
- Configuración global

---

## 📚 Documentación

- [Arquitectura](.agent/workflows/architecture.md) - Arquitectura detallada del proyecto
- [Componentes](src/components/README.md) - Guía de componentes
- [Servicios](src/services/README.md) - Servicios de negocio
- [Types](src/types/README.md) - Sistema de tipos TypeScript

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Iniciar servidor de producción
pnpm lint             # Linter
pnpm type-check       # Verificar tipos TypeScript

# Base de datos
pnpm prisma:generate  # Generar cliente Prisma
pnpm prisma:migrate   # Ejecutar migraciones
pnpm prisma:studio    # Abrir Prisma Studio
pnpm prisma:seed      # Poblar base de datos

# Testing (por implementar)
pnpm test             # Ejecutar tests
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Coverage de tests
```

---

## 🌐 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mindaudit"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="info@mindaudit.es"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="info@mindaudit.es"

# Storage (AWS S3 / Cloudinary / Vercel Blob)
STORAGE_PROVIDER="s3"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="eu-west-1"
AWS_BUCKET_NAME="mindaudit-files"

# Integrations
CALENDLY_API_KEY="your-calendly-key"
TRUSTPILOT_API_KEY="your-trustpilot-key"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0"
  }
}
```

---

## 🤝 Contribución

Este es un proyecto privado de MindAudit Spain SLP.

---

## 📄 Licencia

Propiedad de MindAudit Spain SLP. Todos los derechos reservados.

---

## 📞 Contacto

**MindAudit Spain SLP**

- 📧 Email: info@mindaudit.es
- 📞 Teléfono: +34 900 933 233
- 🌐 Web: https://www.mindaudit.es
- 📍 Dirección: Gran Via Carles III nº98 10ª Planta, 08028 Barcelona

---

## 🎯 Roadmap

### Fase 1: Fundación ✅

- [x] Estructura de carpetas
- [x] Configuración base
- [ ] Sistema de diseño
- [ ] Landing page
- [ ] Autenticación

### Fase 2: Panel Partner 🚧

- [ ] Dashboard del partner
- [ ] Gestión de clientes
- [ ] Solicitud de presupuestos
- [ ] Sistema de consultas

### Fase 3: Panel Auditor 📋

- [ ] Dashboard del auditor
- [ ] Gestión de partners
- [ ] Respuesta a presupuestos
- [ ] Métricas

### Fase 4: Funcionalidades Avanzadas 📋

- [ ] Upload de documentos
- [ ] Integración Calendly
- [ ] Sistema de facturación
- [ ] Notificaciones

### Fase 5: Deploy 📋

- [ ] Testing
- [ ] Optimización
- [ ] SEO
- [ ] Deployment

---

**Desarrollado con ❤️ para MindAudit Spain SLP**
