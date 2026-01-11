# 🤖 Guía para Agentes IA - MindAudit Spain

Este documento está diseñado para guiar a agentes IA (como tú) que trabajen en este proyecto. Contiene las convenciones, estructura y mejores prácticas establecidas.

---

## 📋 Información del Proyecto

**Nombre:** MindAudit Spain SLP - Plataforma de Auditoría Colaborativa
**Tipo:** Monolito Modular con Next.js 14+ (App Router)
**Estado Actual:** Fase 1 en progreso - Landing Page Implementada ✅

---

## 🏗️ Arquitectura del Proyecto

### Decisión Arquitectónica

**Monolito Modular** - No microservicios, todo en una aplicación Next.js.

- Deployment simple (Vercel)
- Escalabilidad vertical

### Stack Tecnológico

```
Frontend:  Next.js 14+ (App Router) + React 18+ + TypeScript
Styling:   Tailwind CSS + shadcn/ui
Icons:     Lucide React
Forms:     React Hook Form + Zod
Backend:   Next.js API Routes
Database:  Prisma ORM + PostgreSQL
Auth:      NextAuth.js
Email:     Resend
```

---

## 🎨 Design System & UI (NUEVO)

### Paleta de Colores

Definida en `app/globals.css`.

- **Primary Blue:** `hsl(221, 83%, 53%)` (Blue-600) - Acciones principales
- **Brand Dark:** `hsl(222, 47%, 11%)` (Slate-900) - Fondos oscuros (Hero, Footer)
- **Background:** Blanco puro para limpieza.

### Componentes Base (shadcn/ui)

Se utiliza `shadcn/ui` como librería de componentes base.

- **Instalación:** IMPORTANTE - Usar `npx shadcn@latest add [component]` (El paquete `shadcn-ui` está deprecado).
- Instalados en `src/components/ui/`
- NO modificar directamente a menos que sea para personalización global.
- Usar `cn()` para extender estilos.

### Iconografía

Usar **Lucide React** para todos los iconos.

```tsx
import { ShieldCheck } from "lucide-react";
<ShieldCheck className="h-4 w-4" />;
```

---

## 📁 Estructura de Carpetas

### Principios

1. **Separación por Dominio**
2. **Colocation**

### Estructura Principal

```
mindaudit/
├── app/
│   ├── (auth)/               # Rutas de autenticación
│   ├── (public)/             # Rutas públicas (Landing, Legal)
│   │   ├── layout.tsx        # Layout con Header/Footer públicos
│   │   └── page.tsx          # Landing Page
│   ├── (dashboard)/          # Rutas privadas
│   └── api/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui
│   │   ├── layout/           # Header, Footer
│   │   ├── landing/          # Secciones de la Landing
│   │   ├── partner/          # Componentes dashboard partner
│   │   └── auditor/          # Componentes dashboard auditor
```

---

## 🎯 Convenciones de Código

### Componentes Landing Page

Los componentes de la landing page deben ser **autocontenidos** en `src/components/landing/`.

- `Hero.tsx`
- `ServicesSection.tsx`
- `CTASection.tsx`
- etc.

### Imports

Orden estricto:

1. React / Next.js
2. Librerías terceras (lucide-react, framer-motion)
3. Componentes internos (`@/components/...`)
4. Hooks / Libs / Types

```typescript
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
```

---

## 📝 Roadmap & Estado

### ✅ Fase 0: Arquitectura

- Estructura base creada.
- Configuración inicial.

### 🚧 Fase 1: Landing Page (En progreso)

- [x] Initial UI Setup (shadcn, colors)
- [x] Header & Footer Components
- [x] Landing Sections (Hero, Services, CTA)
- [ ] Responsive adjustments (Mobile Menu) - _Implementado_
- [ ] Asset integration (Images) - _Usando placeholders visuales_

### Siguientes Pasos

1. Implementar páginas interiores públicas (/sobre-nosotros, /servicios).
2. Comenzar con la autenticación (Fase 2).

---

## 🤝 Colaboración

Si continúas el desarrollo:

1. Mantén la consistencia visual (Blue/Dark Blue/White).
2. Usa `(public)` layout para páginas informativas.
3. Usa `(dashboard)` layout para las apps privadas.
4. **NO** crees estilos CSS arbitrarios, usa Tailwind utility classes.
