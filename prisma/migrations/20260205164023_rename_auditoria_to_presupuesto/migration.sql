/*
  Warnings:

  - You are about to drop the column `auditoriaId` on the `comisiones` table. All the data in the column will be lost.
  - You are about to drop the column `auditoriaId` on the `documentos` table. All the data in the column will be lost.
  - You are about to drop the column `auditoriaId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `auditoriaId` on the `solicitudes_documentos` table. All the data in the column will be lost.
  - You are about to drop the `auditorias` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[presupuestoId]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `presupuestoId` to the `comisiones` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PresupuestoStatus" AS ENUM ('PENDIENTE_PRESUPUESTAR', 'EN_CURSO', 'ACEPTADO_PENDIENTE_FACTURAR', 'A_PAGAR', 'PAGADO', 'RECHAZADO');

-- DropForeignKey
ALTER TABLE "auditorias" DROP CONSTRAINT "auditorias_colaboradorId_fkey";

-- DropForeignKey
ALTER TABLE "auditorias" DROP CONSTRAINT "auditorias_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "comisiones" DROP CONSTRAINT "comisiones_auditoriaId_fkey";

-- DropForeignKey
ALTER TABLE "documentos" DROP CONSTRAINT "documentos_auditoriaId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_auditoriaId_fkey";

-- DropForeignKey
ALTER TABLE "solicitudes_documentos" DROP CONSTRAINT "solicitudes_documentos_auditoriaId_fkey";

-- DropIndex
DROP INDEX "comisiones_auditoriaId_idx";

-- DropIndex
DROP INDEX "documentos_auditoriaId_idx";

-- DropIndex
DROP INDEX "invoices_auditoriaId_key";

-- DropIndex
DROP INDEX "solicitudes_documentos_auditoriaId_idx";

-- AlterTable
ALTER TABLE "comisiones" DROP COLUMN "auditoriaId",
ADD COLUMN     "presupuestoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "documentos" DROP COLUMN "auditoriaId",
ADD COLUMN     "presupuestoId" TEXT;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "auditoriaId",
ADD COLUMN     "presupuestoId" TEXT;

-- AlterTable
ALTER TABLE "solicitudes_documentos" DROP COLUMN "auditoriaId",
ADD COLUMN     "presupuestoId" TEXT;

-- DropTable
DROP TABLE "auditorias";

-- DropEnum
DROP TYPE "AuditoriaStatus";

-- CreateTable
CREATE TABLE "presupuestos" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "colaboradorId" TEXT,
    "razonSocial" TEXT,
    "cif_landing" TEXT,
    "facturacion" TEXT,
    "nombreContacto" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "tipoServicio_landing" TEXT,
    "tipoServicio" "TipoServicio",
    "fiscalYear" INTEGER,
    "description" TEXT,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "status" "PresupuestoStatus" NOT NULL DEFAULT 'PENDIENTE_PRESUPUESTAR',
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
    "meetingRequestedBy" "UserRole",
    "meetingStatus" "MeetingStatus" NOT NULL DEFAULT 'PENDING',
    "meetingDate" TIMESTAMP(3),
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "presupuestos_empresaId_idx" ON "presupuestos"("empresaId");

-- CreateIndex
CREATE INDEX "presupuestos_colaboradorId_idx" ON "presupuestos"("colaboradorId");

-- CreateIndex
CREATE INDEX "presupuestos_status_idx" ON "presupuestos"("status");

-- CreateIndex
CREATE INDEX "presupuestos_fechaSolicitud_idx" ON "presupuestos"("fechaSolicitud");

-- CreateIndex
CREATE INDEX "comisiones_presupuestoId_idx" ON "comisiones"("presupuestoId");

-- CreateIndex
CREATE INDEX "documentos_presupuestoId_idx" ON "documentos"("presupuestoId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_presupuestoId_key" ON "invoices"("presupuestoId");

-- CreateIndex
CREATE INDEX "solicitudes_documentos_presupuestoId_idx" ON "solicitudes_documentos"("presupuestoId");

-- AddForeignKey
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuestos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuestos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_documentos" ADD CONSTRAINT "solicitudes_documentos_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuestos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuestos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
