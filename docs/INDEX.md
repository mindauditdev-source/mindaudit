# 📚 Índice de Documentación - MindAudit Spain

Bienvenido a la documentación del proyecto MindAudit Spain SLP. Este índice te guiará a través de toda la documentación disponible.

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos

1. Lee el [README.md](../README.md) para entender el proyecto
2. Revisa el [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md) para ver el estado actual
3. Consulta el [Plan de Implementación](IMPLEMENTATION_PLAN.md) para saber qué sigue
4. Explora la [Arquitectura](.agent/workflows/architecture.md) para entender la estructura

### Para Stakeholders

1. [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md) - Vista general del proyecto
2. [Plan de Implementación](IMPLEMENTATION_PLAN.md) - Cronograma y fases
3. [Diagrama de Arquitectura](ARCHITECTURE_DIAGRAM.md) - Visualización del sistema

---

## 📖 Documentación Principal

### 1. README Principal

**Archivo:** [README.md](../README.md)
**Contenido:**

- Descripción del proyecto
- Público objetivo y modelo de negocio
- Stack tecnológico
- Estructura del proyecto
- Guía de inicio rápido
- Características principales
- Roadmap

### 2. Resumen Ejecutivo

**Archivo:** [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)
**Contenido:**

- Estado actual del proyecto
- Arquitectura definida
- Rutas y componentes planificados
- Sistema de roles y permisos
- Métricas de éxito
- Próximos pasos

### 3. Plan de Implementación

**Archivo:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
**Contenido:**

- 6 fases de desarrollo (9 semanas)
- Checklist detallado por fase
- Entregables esperados
- Métricas de éxito
- Stack tecnológico final

---

## 🏗️ Documentación de Arquitectura

### 4. Arquitectura Completa

**Archivo:** [.agent/workflows/architecture.md](../.agent/workflows/architecture.md)
**Contenido:**

- Decisión arquitectónica (Monolito Modular)
- Estructura de carpetas detallada
- Mapa de rutas completo
- Modelo de datos (entidades)
- Stack tecnológico
- Módulos principales
- Fases de desarrollo
- Sistema de diseño
- Seguridad

### 5. Diagrama de Arquitectura

**Archivo:** [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
**Contenido:**

- Vista general del sistema (ASCII art)
- Flujo de datos principal
- Flujo de autenticación
- Módulos del sistema
- Separación de responsabilidades
- Deployment architecture

### 6. Resumen de Estructura

**Archivo:** [STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md)
**Contenido:**

- Estructura creada
- Archivos de configuración
- Rutas definidas
- Componentes planificados
- Sistema de roles
- Servicios de auditoría
- Próximos pasos

---

## 🔧 Documentación Técnica

### 7. Componentes

**Archivo:** [src/components/README.md](../src/components/README.md)
**Contenido:**

- Estructura de componentes
- Categorías (UI, Layout, Landing, Auth, etc.)
- Convenciones de naming
- Ejemplo de uso

### 8. Servicios

**Archivo:** [src/services/README.md](../src/services/README.md)
**Contenido:**

- Propósito de los servicios
- Servicios disponibles (13 servicios)
- Patrón de uso
- Uso en componentes y API routes
- Convenciones

### 9. Tipos TypeScript

**Archivo:** [src/types/README.md](../src/types/README.md)
**Contenido:**

- Propósito del sistema de tipos
- Archivos de tipos (auth, user, partner, etc.)
- Convenciones de naming
- DTOs (Data Transfer Objects)
- Sincronización con Prisma

---

## ⚙️ Configuración

### 10. Variables de Entorno

**Archivo:** [ENVIRONMENT.md](ENVIRONMENT.md)
**Contenido:**

- Database
- NextAuth
- Email (Hostinger + Resend)
- File Storage (S3, Cloudinary, Vercel Blob)
- Integrations (Calendly, TrustPilot)
- Analytics & Monitoring
- Feature Flags

### 11. Configuración de Navegación

**Archivo:** [src/config/navigation.ts](../src/config/navigation.ts)
**Contenido:**

- Rutas públicas
- Rutas de autenticación
- Rutas del partner
- Rutas del auditor
- API routes
- Menús de navegación
- Utilidades de navegación

### 12. Configuración de Servicios

**Archivo:** [src/config/services.ts](../src/config/services.ts)
**Contenido:**

- 17 servicios de auditoría
- Servicios destacados (4)
- Categorías de servicios
- Utilidades (getServiceBySlug, etc.)

### 13. Configuración de Roles

**Archivo:** [src/config/roles.ts](../src/config/roles.ts)
**Contenido:**

- 3 roles (PARTNER, AUDITOR, ADMIN)
- 50+ permisos granulares
- Mapeo de permisos por rol
- Utilidades de permisos
- Metadata de roles

### 14. Configuración del Sitio

**Archivo:** [src/config/site.ts](../src/config/site.ts)
**Contenido:**

- Información general
- Contacto y emails
- Información legal
- Redes sociales
- Integraciones
- Estadísticas
- SEO
- Configuración de la app
- Feature flags

### 15. Constantes

**Archivo:** [src/lib/constants.ts](../src/lib/constants.ts)
**Contenido:**

- Estados y status
- Tipos de servicios
- Límites y validaciones
- Formatos y patrones (regex)
- Mensajes de error y éxito
- Configuración de fechas
- Tipos de archivos permitidos
- Configuración de comisiones
- Timeouts y delays
- Claves de local storage
- Query keys

---

## 📊 Resumen de Archivos

### Documentación (10 archivos)

| Archivo                 | Ubicación           | Tamaño | Propósito             |
| ----------------------- | ------------------- | ------ | --------------------- |
| README.md               | `/`                 | ~11KB  | README principal      |
| EXECUTIVE_SUMMARY.md    | `/docs`             | ~10KB  | Resumen ejecutivo     |
| IMPLEMENTATION_PLAN.md  | `/docs`             | ~13KB  | Plan de 9 semanas     |
| STRUCTURE_SUMMARY.md    | `/docs`             | ~10KB  | Resumen de estructura |
| ARCHITECTURE_DIAGRAM.md | `/docs`             | ~24KB  | Diagramas visuales    |
| ENVIRONMENT.md          | `/docs`             | ~2KB   | Variables de entorno  |
| architecture.md         | `/.agent/workflows` | -      | Arquitectura completa |
| components/README.md    | `/src/components`   | -      | Guía de componentes   |
| services/README.md      | `/src/services`     | -      | Guía de servicios     |
| types/README.md         | `/src/types`        | -      | Sistema de tipos      |

### Configuración (6 archivos)

| Archivo       | Ubicación        | Tamaño | Propósito              |
| ------------- | ---------------- | ------ | ---------------------- |
| navigation.ts | `/src/config`    | ~10KB  | Rutas y navegación     |
| services.ts   | `/src/config`    | ~8KB   | Servicios de auditoría |
| roles.ts      | `/src/config`    | ~8KB   | Roles y permisos       |
| site.ts       | `/src/config`    | ~4KB   | Config del sitio       |
| constants.ts  | `/src/lib`       | -      | Constantes globales    |
| cn.ts         | `/src/lib/utils` | -      | Utilidad CSS           |

**Total: 16 archivos de documentación y configuración**
**Total de líneas: ~3000+ líneas de documentación**

---

## 🗺️ Navegación Rápida

### Por Tema

#### Arquitectura

- [Arquitectura Completa](.agent/workflows/architecture.md)
- [Diagrama de Arquitectura](ARCHITECTURE_DIAGRAM.md)
- [Resumen de Estructura](STRUCTURE_SUMMARY.md)

#### Planificación

- [Plan de Implementación](IMPLEMENTATION_PLAN.md)
- [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md)

#### Desarrollo

- [Guía de Componentes](../src/components/README.md)
- [Guía de Servicios](../src/services/README.md)
- [Sistema de Tipos](../src/types/README.md)

#### Configuración

- [Variables de Entorno](ENVIRONMENT.md)
- [Navegación](../src/config/navigation.ts)
- [Servicios](../src/config/services.ts)
- [Roles](../src/config/roles.ts)
- [Sitio](../src/config/site.ts)
- [Constantes](../src/lib/constants.ts)

---

## 🎯 Casos de Uso

### "Quiero entender el proyecto"

1. [README.md](../README.md)
2. [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md)
3. [Diagrama de Arquitectura](ARCHITECTURE_DIAGRAM.md)

### "Quiero empezar a desarrollar"

1. [Plan de Implementación](IMPLEMENTATION_PLAN.md) - Ver fase actual
2. [Arquitectura Completa](.agent/workflows/architecture.md) - Entender estructura
3. [Guía de Componentes](../src/components/README.md) - Crear componentes

### "Quiero configurar el proyecto"

1. [Variables de Entorno](ENVIRONMENT.md)
2. [Configuración del Sitio](../src/config/site.ts)
3. [README.md](../README.md) - Sección de instalación

### "Quiero entender las rutas"

1. [Navegación](../src/config/navigation.ts)
2. [Arquitectura](.agent/workflows/architecture.md) - Sección de rutas
3. [Resumen de Estructura](STRUCTURE_SUMMARY.md) - Rutas planificadas

### "Quiero entender los permisos"

1. [Roles y Permisos](../src/config/roles.ts)
2. [Arquitectura](.agent/workflows/architecture.md) - Sección de roles

### "Quiero ver el cronograma"

1. [Plan de Implementación](IMPLEMENTATION_PLAN.md)
2. [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md) - Sección de fases

---

## 📞 Información de Contacto

**MindAudit Spain SLP**

- Email: info@mindaudit.es
- Teléfono: +34 900 933 233
- Dirección: Gran Via Carles III nº98 10ª Planta, 08028 Barcelona
- Web: www.mindaudit.es

---

## 🔄 Actualización de Documentación

Esta documentación se actualiza continuamente. Última actualización: **2026-01-10**

### Cómo Contribuir

1. Mantén la documentación actualizada con los cambios
2. Sigue las convenciones de naming
3. Actualiza este índice cuando agregues nueva documentación
4. Usa Markdown para consistencia

---

**Estado del Proyecto:** Fase 0 Completada ✅
**Siguiente Fase:** Fundación (Semanas 1-2)
**Documentación:** Completa y actualizada
