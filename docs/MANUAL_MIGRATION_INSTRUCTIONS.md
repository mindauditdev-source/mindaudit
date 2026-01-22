# 🔧 INSTRUCCIONES MANUALES DE MIGRACIÓN

## ⚠️ Problema Detectado

Hay problemas de conectividad con la base de datos de Supabase desde el entorno local.

## 🎯 Solución: Ejecutar SQL Manualmente en Supabase

### Paso 1: Acceder al SQL Editor de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `nflwkbkoabvrmkxuijkr`
3. En el menú lateral, haz clic en **SQL Editor**

### Paso 2: Limpiar la Base de Datos

Ejecuta el siguiente SQL para eliminar todas las tablas antiguas:

```sql
-- Desactivar foreign key checks temporalmente
SET session_replication_role = 'replica';

-- Eliminar todas las tablas antiguas
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "documents" CASCADE;
DROP TABLE IF EXISTS "news" CASCADE;
DROP TABLE IF EXISTS "invoices" CASCADE;
DROP TABLE IF EXISTS "meetings" CASCADE;
DROP TABLE IF EXISTS "consultation_messages" CASCADE;
DROP TABLE IF EXISTS "consultations" CASCADE;
DROP TABLE IF EXISTS "budgets" CASCADE;
DROP TABLE IF EXISTS "clients" CASCADE;
DROP TABLE IF EXISTS "auditors" CASCADE;
DROP TABLE IF EXISTS "partners" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Eliminar tabla de migraciones de Prisma
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

-- Reactivar foreign key checks
SET session_replication_role = 'origin';
```

### Paso 3: Crear el Nuevo Schema

Ahora ejecuta este SQL para crear todas las nuevas tablas:

```sql
-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COLABORADOR', 'EMPRESA');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
CREATE TYPE "ColaboradorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL');
CREATE TYPE "EmpresaStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'IN_AUDIT', 'AUDITED');
CREATE TYPE "EmpresaOrigen" AS ENUM ('COLABORADOR', 'DIRECTA');
CREATE TYPE "AuditoriaStatus" AS ENUM ('SOLICITADA', 'EN_REVISION', 'PRESUPUESTADA', 'APROBADA', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA', 'RECHAZADA');
CREATE TYPE "TipoServicio" AS ENUM ('AUDITORIA_CUENTAS', 'AUDITORIA_CONSOLIDADA', 'AUDITORIA_VOLUNTARIA', 'AUDITORIA_SUBVENCIONES', 'REVISION_LIMITADA', 'DUE_DILIGENCE', 'AUDITORIA_FORENSE', 'OTROS');
CREATE TYPE "ComisionStatus" AS ENUM ('PENDIENTE', 'PAGADA', 'CANCELADA');
CREATE TYPE "TipoDocumento" AS ENUM ('CONTRATO', 'PRESUPUESTO', 'INFORME_AUDITORIA', 'ESTADOS_FINANCIEROS', 'DOCUMENTACION_EMPRESA', 'OTRO');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'SEND', 'DOWNLOAD', 'PAYMENT');

-- ============================================
-- TABLA: users
-- ============================================

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'COLABORADOR',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "hashedPassword" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");

-- ============================================
-- TABLA: colaboradores
-- ============================================

CREATE TABLE "colaboradores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "cif" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "website" TEXT,
    "status" "ColaboradorStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "totalCommissions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pendingCommissions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "contractUrl" TEXT,
    "contractSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colaboradores_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "colaboradores_userId_key" ON "colaboradores"("userId");
CREATE UNIQUE INDEX "colaboradores_cif_key" ON "colaboradores"("cif");
CREATE INDEX "colaboradores_userId_idx" ON "colaboradores"("userId");
CREATE INDEX "colaboradores_cif_idx" ON "colaboradores"("cif");
CREATE INDEX "colaboradores_status_idx" ON "colaboradores"("status");

-- ============================================
-- TABLA: empresas
-- ============================================

CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "colaboradorId" TEXT,
    "origen" "EmpresaOrigen" NOT NULL,
    "companyName" TEXT NOT NULL,
    "cif" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "website" TEXT,
    "employees" INTEGER,
    "revenue" DECIMAL(15,2),
    "fiscalYear" INTEGER,
    "status" "EmpresaStatus" NOT NULL DEFAULT 'PROSPECT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "empresas_userId_key" ON "empresas"("userId");
CREATE UNIQUE INDEX "empresas_cif_key" ON "empresas"("cif");
CREATE INDEX "empresas_userId_idx" ON "empresas"("userId");
CREATE INDEX "empresas_colaboradorId_idx" ON "empresas"("colaboradorId");
CREATE INDEX "empresas_cif_idx" ON "empresas"("cif");
CREATE INDEX "empresas_origen_idx" ON "empresas"("origen");
CREATE INDEX "empresas_status_idx" ON "empresas"("status");

-- ============================================
-- TABLA: auditorias
-- ============================================

CREATE TABLE "auditorias" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "colaboradorId" TEXT,
    "tipoServicio" "TipoServicio" NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "description" TEXT,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "status" "AuditoriaStatus" NOT NULL DEFAULT 'SOLICITADA',
    "presupuesto" DECIMAL(12,2),
    "presupuestoNotas" TEXT,
    "presupuestoValidoHasta" TIMESTAMP(3),
    "comisionRate" DECIMAL(5,2),
    "comisionAmount" DECIMAL(12,2),
    "comisionPagada" BOOLEAN NOT NULL DEFAULT false,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPresupuesto" TIMESTAMP(3),
    "fechaAprobacion" TIMESTAMP(3),
    "fechaInicio" TIMESTAMP(3),
    "fechaFinalizacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "auditorias_empresaId_idx" ON "auditorias"("empresaId");
CREATE INDEX "auditorias_colaboradorId_idx" ON "auditorias"("colaboradorId");
CREATE INDEX "auditorias_status_idx" ON "auditorias"("status");
CREATE INDEX "auditorias_tipoServicio_idx" ON "auditorias"("tipoServicio");
CREATE INDEX "auditorias_fechaSolicitud_idx" ON "auditorias"("fechaSolicitud");

-- ============================================
-- TABLA: comisiones
-- ============================================

CREATE TABLE "comisiones" (
    "id" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "auditoriaId" TEXT NOT NULL,
    "montoBase" DECIMAL(12,2) NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "montoComision" DECIMAL(12,2) NOT NULL,
    "status" "ComisionStatus" NOT NULL DEFAULT 'PENDIENTE',
    "fechaPago" TIMESTAMP(3),
    "referenciaPago" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comisiones_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "comisiones_colaboradorId_idx" ON "comisiones"("colaboradorId");
CREATE INDEX "comisiones_auditoriaId_idx" ON "comisiones"("auditoriaId");
CREATE INDEX "comisiones_status_idx" ON "comisiones"("status");
CREATE INDEX "comisiones_fechaPago_idx" ON "comisiones"("fechaPago");

-- ============================================
-- TABLA: configuracion_sistema
-- ============================================

CREATE TABLE "configuracion_sistema" (
    "id" TEXT NOT NULL,
    "comisionDefaultRate" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "diasValidezPresupuesto" INTEGER NOT NULL DEFAULT 30,
    "emailNotificaciones" TEXT NOT NULL DEFAULT 'info@mindaudit.es',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLA: documentos
-- ============================================

CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "empresaId" TEXT,
    "auditoriaId" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "documentos_uploadedBy_idx" ON "documentos"("uploadedBy");
CREATE INDEX "documentos_tipoDocumento_idx" ON "documentos"("tipoDocumento");
CREATE INDEX "documentos_empresaId_idx" ON "documentos"("empresaId");
CREATE INDEX "documentos_auditoriaId_idx" ON "documentos"("auditoriaId");

-- ============================================
-- TABLA: audit_logs
-- ============================================

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" "UserRole" NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- ============================================
-- FOREIGN KEYS
-- ============================================

ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "empresas" ADD CONSTRAINT "empresas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "auditorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "auditorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Paso 4: Insertar Configuración Inicial

```sql
-- Insertar configuración por defecto del sistema
INSERT INTO "configuracion_sistema" ("id", "comisionDefaultRate", "diasValidezPresupuesto", "emailNotificaciones", "createdAt", "updatedAt")
VALUES ('default-config', 10.00, 30, 'info@mindaudit.es', NOW(), NOW());
```

### Paso 5: Verificar

Ejecuta este SQL para verificar que todo se creó correctamente:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

Deberías ver:

- audit_logs
- auditorias
- colaboradores
- comisiones
- configuracion_sistema
- documentos
- empresas
- users

---

## ✅ Una vez completado

Después de ejecutar estos scripts en Supabase:

1. Vuelve a tu terminal local
2. Ejecuta: `pnpm db:generate` (esto generará el cliente de Prisma basado en el schema)
3. Continúa con el desarrollo

---

## 🔍 Troubleshooting

Si hay algún error:

- Verifica que todos los ENUMs se crearon correctamente
- Asegúrate de que no haya tablas antiguas con nombres conflictivos
- Revisa que las foreign keys se aplicaron sin errores
