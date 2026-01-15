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
- Cuenta en [Supabase](https://supabase.com) (gratis)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mindaudit/mindaudit-spain.git
cd mindaudit-spain

# Instalar dependencias
pnpm install
```

### Configuración de Base de Datos (Supabase)

**📚 Guía completa:** Ver [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md) o [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

**Pasos rápidos:**

1. **Crear proyecto en Supabase**

   - Ir a [https://supabase.com](https://supabase.com)
   - Crear nuevo proyecto
   - Copiar credenciales (Database URL, API keys)

2. **Configurar variables de entorno**

   ```bash
   # Copiar template
   cp .env.example .env.local

   # Editar .env.local con tus credenciales de Supabase
   # Ver SETUP_CHECKLIST.md para instrucciones detalladas
   ```

3. **Ejecutar migraciones**

   ```bash
   # Generar cliente de Prisma
   pnpm db:generate

   # Crear tablas en Supabase
   pnpm db:migrate

   # Poblar con datos de prueba
   pnpm db:seed
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

La aplicación estará disponible en `http://localhost:3000`

### Credenciales de Prueba

Después de ejecutar `pnpm db:seed`:

| Rol       | Email                | Password   |
| --------- | -------------------- | ---------- |
| Admin     | admin@mindaudit.es   | admin123   |
| Auditor   | auditor@mindaudit.es | auditor123 |
| Partner 1 | partner1@example.com | partner123 |
| Partner 2 | partner2@example.com | partner123 |

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

### Guías de Configuración

- [**SETUP_CHECKLIST.md**](SETUP_CHECKLIST.md) - ✅ Checklist paso a paso para configurar Supabase
- [**QUICK_START_DB.md**](QUICK_START_DB.md) - 🚀 Guía rápida de 3 pasos
- [**docs/SUPABASE_SETUP.md**](docs/SUPABASE_SETUP.md) - 📖 Guía completa de Supabase

### Arquitectura y Diseño

- [**Arquitectura**](.agent/workflows/architecture.md) - Arquitectura detallada del proyecto
- [**docs/DATABASE_SCHEMA.md**](docs/DATABASE_SCHEMA.md) - 🗄️ Diagrama de base de datos
- [**docs/DATABASE_INTEGRATION_STATUS.md**](docs/DATABASE_INTEGRATION_STATUS.md) - 📊 Estado de integración

### Desarrollo

- [**Componentes**](src/components/README.md) - Guía de componentes
- [**Servicios**](src/services/README.md) - Servicios de negocio
- [**Types**](src/types/README.md) - Sistema de tipos TypeScript

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Iniciar servidor de producción
pnpm lint             # Linter

# Base de datos
pnpm db:generate      # Generar cliente Prisma
pnpm db:migrate       # Crear y aplicar migraciones
pnpm db:push          # Push schema sin migración (desarrollo)
pnpm db:seed          # Poblar base de datos con datos de prueba
pnpm db:studio        # Abrir Prisma Studio (GUI)
pnpm db:reset         # Resetear base de datos (¡cuidado!)

# Testing (por implementar)
pnpm test             # Ejecutar tests
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Coverage de tests
```

---

## 🌐 Variables de Entorno

**📚 Ver guía completa:** [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

Crea un archivo `.env.local` con las siguientes variables:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="noreply@mindaudit.es"
EMAIL_REPLY_TO="info@mindaudit.es"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Integrations
CALENDLY_API_KEY="your-calendly-key"
TRUSTPILOT_API_KEY="your-trustpilot-key"

# Feature Flags
NEXT_PUBLIC_ENABLE_MAGIC_LINKS="true"
NEXT_PUBLIC_ENABLE_CALENDLY="true"
```

**Generar NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
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

### Fase 0: Arquitectura Base ✅ COMPLETADA

- [x] Estructura de carpetas
- [x] Configuración base
- [x] **Schema de base de datos (Prisma + Supabase)**
- [x] **Configuración de Supabase**
- [x] **Seed de datos de prueba**
- [x] **Documentación completa**

### Fase 1: Fundación 🚧 EN PROGRESO

- [x] Configuración técnica
- [ ] Sistema de diseño
- [ ] Landing page
- [ ] Autenticación básica

### Fase 2: Autenticación 📋 PENDIENTE

- [ ] NextAuth configuration
- [ ] Login/Register forms
- [ ] Magic links
- [ ] Auth middleware

### Fase 3: Panel Partner 📋 PENDIENTE

- [ ] Dashboard del partner
- [ ] Gestión de clientes
- [ ] Solicitud de presupuestos
- [ ] Sistema de consultas

### Fase 4: Panel Auditor 📋 PENDIENTE

- [ ] Dashboard del auditor
- [ ] Gestión de partners
- [ ] Respuesta a presupuestos
- [ ] Métricas

### Fase 5: Funcionalidades Avanzadas 📋 PENDIENTE

- [ ] Upload de documentos
- [ ] Integración Calendly
- [ ] Sistema de facturación
- [ ] Notificaciones

### Fase 6: Deploy 📋 PENDIENTE

- [ ] Testing
- [ ] Optimización
- [ ] SEO
- [ ] Deployment

---

**Desarrollado con ❤️ para MindAudit Spain SLP**
