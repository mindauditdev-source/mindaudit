-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COLABORADOR', 'EMPRESA');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "ColaboradorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "EmpresaStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'IN_AUDIT', 'AUDITED');

-- CreateEnum
CREATE TYPE "EmpresaOrigen" AS ENUM ('COLABORADOR', 'DIRECTA');

-- CreateEnum
CREATE TYPE "AuditoriaStatus" AS ENUM ('SOLICITADA', 'EN_REVISION', 'PRESUPUESTADA', 'REUNION_SOLICITADA', 'APROBADA', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('AUDITORIA_CUENTAS', 'AUDITORIA_CONSOLIDADA', 'AUDITORIA_VOLUNTARIA', 'AUDITORIA_SUBVENCIONES', 'REVISION_LIMITADA', 'DUE_DILIGENCE', 'AUDITORIA_FORENSE', 'OTROS');

-- CreateEnum
CREATE TYPE "ComisionStatus" AS ENUM ('PENDIENTE', 'PAGADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CONTRATO', 'PRESUPUESTO', 'INFORME_AUDITORIA', 'ESTADOS_FINANCIEROS', 'DOCUMENTACION_EMPRESA', 'OTRO');

-- CreateEnum
CREATE TYPE "SolicitudStatus" AS ENUM ('PENDIENTE', 'ENTREGADO', 'RECHAZADO', 'APROBADO');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'SEND', 'DOWNLOAD', 'PAYMENT');

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "solicitudes_documentos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "SolicitudStatus" NOT NULL DEFAULT 'PENDIENTE',
    "empresaId" TEXT NOT NULL,
    "auditoriaId" TEXT,
    "documentoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_userId_key" ON "colaboradores"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_cif_key" ON "colaboradores"("cif");

-- CreateIndex
CREATE INDEX "colaboradores_userId_idx" ON "colaboradores"("userId");

-- CreateIndex
CREATE INDEX "colaboradores_cif_idx" ON "colaboradores"("cif");

-- CreateIndex
CREATE INDEX "colaboradores_status_idx" ON "colaboradores"("status");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_userId_key" ON "empresas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cif_key" ON "empresas"("cif");

-- CreateIndex
CREATE INDEX "empresas_userId_idx" ON "empresas"("userId");

-- CreateIndex
CREATE INDEX "empresas_colaboradorId_idx" ON "empresas"("colaboradorId");

-- CreateIndex
CREATE INDEX "empresas_cif_idx" ON "empresas"("cif");

-- CreateIndex
CREATE INDEX "empresas_origen_idx" ON "empresas"("origen");

-- CreateIndex
CREATE INDEX "empresas_status_idx" ON "empresas"("status");

-- CreateIndex
CREATE INDEX "auditorias_empresaId_idx" ON "auditorias"("empresaId");

-- CreateIndex
CREATE INDEX "auditorias_colaboradorId_idx" ON "auditorias"("colaboradorId");

-- CreateIndex
CREATE INDEX "auditorias_status_idx" ON "auditorias"("status");

-- CreateIndex
CREATE INDEX "auditorias_tipoServicio_idx" ON "auditorias"("tipoServicio");

-- CreateIndex
CREATE INDEX "auditorias_fechaSolicitud_idx" ON "auditorias"("fechaSolicitud");

-- CreateIndex
CREATE INDEX "comisiones_colaboradorId_idx" ON "comisiones"("colaboradorId");

-- CreateIndex
CREATE INDEX "comisiones_auditoriaId_idx" ON "comisiones"("auditoriaId");

-- CreateIndex
CREATE INDEX "comisiones_status_idx" ON "comisiones"("status");

-- CreateIndex
CREATE INDEX "comisiones_fechaPago_idx" ON "comisiones"("fechaPago");

-- CreateIndex
CREATE INDEX "documentos_uploadedBy_idx" ON "documentos"("uploadedBy");

-- CreateIndex
CREATE INDEX "documentos_tipoDocumento_idx" ON "documentos"("tipoDocumento");

-- CreateIndex
CREATE INDEX "documentos_empresaId_idx" ON "documentos"("empresaId");

-- CreateIndex
CREATE INDEX "documentos_auditoriaId_idx" ON "documentos"("auditoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_documentos_documentoId_key" ON "solicitudes_documentos"("documentoId");

-- CreateIndex
CREATE INDEX "solicitudes_documentos_empresaId_idx" ON "solicitudes_documentos"("empresaId");

-- CreateIndex
CREATE INDEX "solicitudes_documentos_auditoriaId_idx" ON "solicitudes_documentos"("auditoriaId");

-- CreateIndex
CREATE INDEX "solicitudes_documentos_status_idx" ON "solicitudes_documentos"("status");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "auditorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "auditorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_documentos" ADD CONSTRAINT "solicitudes_documentos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_documentos" ADD CONSTRAINT "solicitudes_documentos_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "auditorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_documentos" ADD CONSTRAINT "solicitudes_documentos_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "documentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
