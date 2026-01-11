---
description: Arquitectura y Estructura del Proyecto MindAudit Spain
---

# 🏗️ Arquitectura MindAudit Spain SLP

## 📋 Resumen del Proyecto

**MindAudit Spain** es una plataforma de auditoría que conecta despachos profesionales (partners) con servicios de auditoría especializados. La plataforma facilita:

- Gestión de colaboraciones entre MindAudit y despachos profesionales
- Solicitud y seguimiento de presupuestos de auditoría
- Comunicación bidireccional (consultas, documentación)
- Gestión de clientes aportados por partners
- Sistema de comisiones y facturación
- Agenda de reuniones y noticias

---

## 🎯 Arquitectura: Monolito Modular

### Decisión Arquitectónica

**Monolito modular con Next.js 14+ (App Router)**

**Ventajas:**

- ✅ Simplicidad en deployment (un solo servidor)
- ✅ Menor complejidad operacional
- ✅ Desarrollo más rápido inicialmente
- ✅ Compartición de código entre módulos
- ✅ Transacciones de base de datos más simples
- ✅ Escalabilidad vertical suficiente para el caso de uso

**Preparado para evolución:**

- Módulos claramente separados por dominio
- Posibilidad futura de extraer microservicios si es necesario

---

## 🗂️ Estructura de Carpetas

```
mindaudit/
├── .agent/                          # Configuración del agente y workflows
│   └── workflows/
│       └── architecture.md
│
├── app/                             # Next.js App Router
│   ├── (auth)/                      # Grupo de rutas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   ├── magic-link/
│   │   └── verify-email/
│   │
│   ├── (public)/                    # Grupo de rutas públicas (landing)
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Landing page principal
│   │   ├── sobre-nosotros/
│   │   ├── servicios/
│   │   ├── colaboradores/
│   │   ├── trabaja-con-nosotros/
│   │   ├── contacto/
│   │   ├── legal/
│   │   │   ├── aviso-legal/
│   │   │   ├── privacidad/
│   │   │   ├── cookies/
│   │   │   └── terminos/
│   │   └── presupuesto/
│   │
│   ├── (dashboard)/                 # Grupo de rutas privadas (dashboard)
│   │   ├── layout.tsx               # Layout con sidebar/navbar
│   │   │
│   │   ├── partner/                 # Panel del Partner/Asociado
│   │   │   ├── dashboard/
│   │   │   ├── clientes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nuevo/
│   │   │   │   └── [clienteId]/
│   │   │   ├── presupuestos/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nuevo/
│   │   │   │   └── [presupuestoId]/
│   │   │   ├── consultas/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nueva/
│   │   │   │   └── [consultaId]/
│   │   │   ├── reuniones/
│   │   │   ├── noticias/
│   │   │   ├── estado-cuenta/
│   │   │   ├── facturas/
│   │   │   ├── contrato/
│   │   │   └── perfil/
│   │   │
│   │   └── auditor/                 # Panel del Auditor
│   │       ├── dashboard/
│   │       ├── asociados/
│   │       │   ├── page.tsx
│   │       │   ├── nuevo/
│   │       │   └── [asociadoId]/
│   │       ├── clientes/
│   │       ├── presupuestos/
│   │       ├── consultas/
│   │       ├── comunicados/
│   │       │   ├── page.tsx
│   │       │   └── nuevo/
│   │       ├── metricas/
│   │       └── configuracion/
│   │
│   ├── api/                         # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── magic-link/
│   │   │   └── verify/
│   │   ├── partners/
│   │   ├── auditors/
│   │   ├── clients/
│   │   ├── budgets/
│   │   ├── consultations/
│   │   ├── meetings/
│   │   ├── news/
│   │   ├── invoices/
│   │   ├── contracts/
│   │   ├── communications/
│   │   ├── metrics/
│   │   └── upload/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
│
├── src/                             # Código fuente compartido
│   ├── components/                  # Componentes React
│   │   ├── ui/                      # Componentes UI primitivos (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardNav.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── landing/                 # Componentes de landing page
│   │   │   ├── Hero.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── TrustPilotWidget.tsx
│   │   │   └── LogosCarousel.tsx
│   │   │
│   │   ├── auth/                    # Componentes de autenticación
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── MagicLinkForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── partner/                 # Componentes específicos del partner
│   │   │   ├── ClientForm.tsx
│   │   │   ├── ClientList.tsx
│   │   │   ├── BudgetRequestForm.tsx
│   │   │   ├── BudgetCard.tsx
│   │   │   ├── ConsultationForm.tsx
│   │   │   ├── ConsultationThread.tsx
│   │   │   ├── AccountStatement.tsx
│   │   │   ├── RatingWidget.tsx
│   │   │   └── DocumentUploader.tsx
│   │   │
│   │   ├── auditor/                 # Componentes específicos del auditor
│   │   │   ├── PartnerForm.tsx
│   │   │   ├── PartnerList.tsx
│   │   │   ├── BudgetResponseForm.tsx
│   │   │   ├── ConsultationResponse.tsx
│   │   │   ├── CommunicationForm.tsx
│   │   │   ├── MetricsDashboard.tsx
│   │   │   └── StatsCards.tsx
│   │   │
│   │   ├── shared/                  # Componentes compartidos
│   │   │   ├── FileUpload.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   └── forms/                   # Formularios específicos
│   │       ├── BudgetRequestForm.tsx
│   │       ├── ContactForm.tsx
│   │       ├── ScheduleCallForm.tsx
│   │       └── ProfileForm.tsx
│   │
│   ├── lib/                         # Utilidades y configuraciones
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   ├── magic-link.ts
│   │   │   └── permissions.ts
│   │   ├── db/
│   │   │   ├── prisma.ts            # Cliente Prisma
│   │   │   └── migrations/
│   │   ├── email/
│   │   │   ├── templates/
│   │   │   │   ├── magic-link.tsx
│   │   │   │   ├── welcome.tsx
│   │   │   │   ├── budget-notification.tsx
│   │   │   │   └── consultation-reply.tsx
│   │   │   └── sender.ts
│   │   ├── storage/
│   │   │   ├── upload.ts
│   │   │   └── download.ts
│   │   ├── integrations/
│   │   │   ├── calendly.ts
│   │   │   └── trustpilot.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   ├── date.ts
│   │   │   └── cn.ts
│   │   └── constants.ts
│   │
│   ├── types/                       # TypeScript types e interfaces
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── partner.ts
│   │   ├── auditor.ts
│   │   ├── client.ts
│   │   ├── budget.ts
│   │   ├── consultation.ts
│   │   ├── meeting.ts
│   │   ├── invoice.ts
│   │   ├── contract.ts
│   │   ├── news.ts
│   │   └── api.ts
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── usePartner.ts
│   │   ├── useClients.ts
│   │   ├── useBudgets.ts
│   │   ├── useConsultations.ts
│   │   ├── useMeetings.ts
│   │   ├── useFileUpload.ts
│   │   ├── useToast.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/                    # Servicios de negocio (lógica compartida)
│   │   ├── auth.service.ts
│   │   ├── partner.service.ts
│   │   ├── auditor.service.ts
│   │   ├── client.service.ts
│   │   ├── budget.service.ts
│   │   ├── consultation.service.ts
│   │   ├── meeting.service.ts
│   │   ├── invoice.service.ts
│   │   ├── contract.service.ts
│   │   ├── news.service.ts
│   │   ├── email.service.ts
│   │   ├── storage.service.ts
│   │   └── notification.service.ts
│   │
│   ├── middleware/                  # Middleware para API routes
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   ├── validators/                  # Schemas de validación (Zod)
│   │   ├── auth.validator.ts
│   │   ├── partner.validator.ts
│   │   ├── client.validator.ts
│   │   ├── budget.validator.ts
│   │   ├── consultation.validator.ts
│   │   └── common.validator.ts
│   │
│   └── config/                      # Configuraciones
│       ├── site.ts                  # Metadata del sitio
│       ├── navigation.ts            # Rutas y navegación
│       ├── roles.ts                 # Definición de roles
│       └── services.ts              # Lista de servicios de auditoría
│
├── prisma/                          # Prisma ORM
│   ├── schema.prisma                # Schema de base de datos
│   ├── migrations/
│   └── seed.ts                      # Datos iniciales
│
├── public/                          # Archivos estáticos
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-image.jpg
│   │   └── partners/
│   ├── icons/
│   └── documents/
│       └── sample-contract.pdf
│
├── docs/                            # Documentación
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
│
├── .env.example
├── .env.local
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 🎭 Roles y Permisos

### Roles del Sistema

1. **PARTNER** (Asociado/Despacho Profesional)

   - Gestionar sus propios clientes
   - Solicitar presupuestos
   - Enviar consultas
   - Ver su estado de cuenta
   - Agendar reuniones
   - Ver noticias

2. **AUDITOR** (MindAudit Spain)

   - Gestionar todos los partners
   - Ver todos los clientes
   - Responder presupuestos
   - Responder consultas
   - Enviar comunicados
   - Ver métricas globales
   - Gestionar facturas y contratos

3. **ADMIN** (Superadministrador)
   - Acceso total al sistema
   - Gestión de usuarios
   - Configuración global

---

## 🗺️ Mapa de Rutas

### Rutas Públicas

```
/                           → Landing page principal
/sobre-nosotros             → Información de la empresa
/servicios                  → Lista completa de servicios
/colaboradores              → Información para partners
/trabaja-con-nosotros       → Página de empleo
/contacto                   → Formulario de contacto
/presupuesto                → Solicitud de presupuesto público
/legal/aviso-legal          → Aviso legal
/legal/privacidad           → Política de privacidad
/legal/cookies              → Política de cookies
/legal/terminos             → Términos de uso
```

### Rutas de Autenticación

```
/login                      → Inicio de sesión
/register                   → Registro de nuevo partner
/magic-link                 → Solicitud de magic link
/verify-email               → Verificación de email
```

### Rutas del Partner (Privadas)

```
/partner/dashboard          → Dashboard principal del partner
/partner/clientes           → Lista de clientes aportados
/partner/clientes/nuevo     → Alta de nuevo cliente
/partner/clientes/[id]      → Detalle de cliente
/partner/presupuestos       → Lista de presupuestos solicitados
/partner/presupuestos/nuevo → Nueva solicitud de presupuesto
/partner/presupuestos/[id]  → Detalle de presupuesto
/partner/consultas          → Lista de consultas
/partner/consultas/nueva    → Nueva consulta
/partner/consultas/[id]     → Thread de consulta
/partner/reuniones          → Agenda de reuniones (Calendly)
/partner/noticias           → Noticias y comunicados
/partner/estado-cuenta      → Estado de cuenta y comisiones
/partner/facturas           → Facturas recibidas
/partner/contrato           → Contrato de colaboración
/partner/perfil             → Perfil del partner
```

### Rutas del Auditor (Privadas)

```
/auditor/dashboard          → Dashboard del auditor
/auditor/asociados          → Lista de partners
/auditor/asociados/nuevo    → Alta de nuevo partner
/auditor/asociados/[id]     → Detalle de partner
/auditor/clientes           → Todos los clientes
/auditor/presupuestos       → Todos los presupuestos
/auditor/consultas          → Todas las consultas
/auditor/comunicados        → Gestión de comunicados
/auditor/comunicados/nuevo  → Nuevo comunicado/mailing
/auditor/metricas           → Métricas y estadísticas
/auditor/configuracion      → Configuración del sistema
```

### API Routes

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/magic-link
GET    /api/auth/verify

GET    /api/partners
POST   /api/partners
GET    /api/partners/[id]
PUT    /api/partners/[id]
DELETE /api/partners/[id]

GET    /api/clients
POST   /api/clients
GET    /api/clients/[id]
PUT    /api/clients/[id]
DELETE /api/clients/[id]

GET    /api/budgets
POST   /api/budgets
GET    /api/budgets/[id]
PUT    /api/budgets/[id]

GET    /api/consultations
POST   /api/consultations
GET    /api/consultations/[id]
POST   /api/consultations/[id]/reply

GET    /api/meetings
POST   /api/meetings

GET    /api/news
POST   /api/news
GET    /api/news/[id]

GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/[id]

GET    /api/contracts/[partnerId]

POST   /api/upload
GET    /api/upload/[fileId]

GET    /api/metrics
```

---

## 🗄️ Modelo de Datos (Entidades Principales)

### User

- id, email, name, role, hashedPassword, emailVerified, createdAt, updatedAt

### Partner (extends User)

- id, userId, companyName, cif, address, phone, status, contractUrl, rating, totalCommissions

### Auditor (extends User)

- id, userId, specialization, certifications

### Client

- id, partnerId, companyName, cif, contactName, contactEmail, contactPhone, fiscalYears, status

### Budget

- id, clientId, partnerId, serviceType, fiscalYears, specialRequests, status, amount, responseNotes, createdAt

### Consultation

- id, partnerId, subject, status, createdAt

### ConsultationMessage

- id, consultationId, senderId, message, attachments, createdAt

### Meeting

- id, partnerId, auditorId, scheduledAt, calendlyEventUrl, status

### Invoice

- id, partnerId, amount, concept, pdfUrl, status, issuedAt

### News

- id, title, content, publishedAt, authorId

### Document

- id, uploadedBy, fileName, fileUrl, fileType, relatedTo (polymorphic)

---

## 🔧 Stack Tecnológico

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18+
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: React Context / Zustand (si es necesario)
- **Animations**: Framer Motion

### Backend

- **Runtime**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: NextAuth.js / Custom Magic Links
- **Validation**: Zod
- **Email**: Resend / Nodemailer
- **File Storage**: AWS S3 / Cloudinary / Vercel Blob

### DevOps

- **Hosting**: Vercel / Railway / AWS
- **Database**: Supabase / Railway / AWS RDS
- **Email**: Hostinger (existente) + Resend (transaccional)
- **Monitoring**: Vercel Analytics / Sentry

---

## 📦 Módulos Principales

### 1. **Módulo de Autenticación**

- Magic links
- Registro de partners
- Gestión de sesiones
- Roles y permisos

### 2. **Módulo de Partners**

- CRUD de clientes
- Solicitud de presupuestos
- Consultas al auditor
- Estado de cuenta

### 3. **Módulo de Auditor**

- Gestión de partners
- Respuesta a presupuestos
- Respuesta a consultas
- Comunicados masivos

### 4. **Módulo de Documentación**

- Upload de archivos
- Visualización de documentos
- Gestión de contratos

### 5. **Módulo de Facturación**

- Generación de facturas
- Cálculo de comisiones
- Estado de cuenta

### 6. **Módulo de Comunicación**

- Sistema de mensajería
- Notificaciones por email
- Noticias y comunicados

### 7. **Módulo de Reuniones**

- Integración con Calendly
- Gestión de agenda

### 8. **Módulo de Métricas**

- Dashboard de estadísticas
- Reportes para auditores

---

## 🚀 Fases de Desarrollo Sugeridas

### Fase 1: Fundación (Semanas 1-2)

- ✅ Estructura de carpetas
- ✅ Configuración de Next.js, Tailwind, Prisma
- ✅ Sistema de diseño base (componentes UI)
- ✅ Landing page completa
- ✅ Autenticación básica

### Fase 2: Panel Partner (Semanas 3-4)

- Dashboard del partner
- Gestión de clientes
- Solicitud de presupuestos
- Sistema de consultas

### Fase 3: Panel Auditor (Semanas 5-6)

- Dashboard del auditor
- Gestión de partners
- Respuesta a presupuestos
- Respuesta a consultas

### Fase 4: Funcionalidades Avanzadas (Semanas 7-8)

- Upload de documentos
- Integración Calendly
- Sistema de facturación
- Métricas y estadísticas

### Fase 5: Pulido y Deploy (Semana 9)

- Testing
- Optimización
- SEO
- Deployment

---

## 📝 Notas Importantes

1. **Separación de concerns**: Cada módulo tiene su propia carpeta de componentes, servicios y tipos
2. **Reutilización**: Componentes UI compartidos en `src/components/ui`
3. **Type safety**: TypeScript estricto en todo el proyecto
4. **Validación**: Zod para validación en cliente y servidor
5. **Seguridad**: Middleware de autenticación en todas las rutas privadas
6. **Performance**: Server Components por defecto, Client Components solo cuando sea necesario
7. **SEO**: Metadata optimizada en cada página
8. **Escalabilidad**: Preparado para crecer (separación clara de módulos)

---

## 🎨 Sistema de Diseño

### Colores Principales

- **Primary**: Azul degradado (profesional, confianza)
- **Secondary**: Gris oscuro (elegancia)
- **Accent**: Blanco/Gris claro
- **Success**: Verde
- **Warning**: Amarillo
- **Error**: Rojo

### Tipografía

- **Headings**: Inter / Outfit (moderno, profesional)
- **Body**: Inter / Roboto (legibilidad)

### Componentes Clave

- Cards con glassmorphism
- Botones con gradientes
- Hover effects suaves
- Micro-animaciones
- Dark mode opcional

---

## 🔐 Seguridad

- HTTPS obligatorio
- CSRF protection
- Rate limiting en API
- Validación en cliente y servidor
- Sanitización de inputs
- Roles y permisos estrictos
- Encriptación de datos sensibles
- Auditoría de accesos

---

Esta arquitectura está diseñada para ser:

- ✅ **Escalable**: Fácil de crecer
- ✅ **Mantenible**: Código organizado y limpio
- ✅ **Segura**: Mejores prácticas de seguridad
- ✅ **Performante**: Optimizada para velocidad
- ✅ **Profesional**: Lista para producción
