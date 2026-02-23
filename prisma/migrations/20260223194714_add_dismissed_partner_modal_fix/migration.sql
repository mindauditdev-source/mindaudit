-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoServicio" ADD VALUE 'AUDITORIA_LEGALIDAD';
ALTER TYPE "TipoServicio" ADD VALUE 'AUDITORIA_OPERATIVA';

-- AlterTable
ALTER TABLE "colaboradores" ADD COLUMN     "dismissedPartnerPlanModal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "consultas" ADD COLUMN     "completadaAt" TIMESTAMP(3),
ADD COLUMN     "razonReapertura" TEXT,
ADD COLUMN     "reabiertaAt" TIMESTAMP(3),
ADD COLUMN     "reabiertaPor" TEXT,
ADD COLUMN     "vecesReabierta" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "presupuestos" ADD COLUMN     "cpAlmacenes" TEXT,
ADD COLUMN     "cpSede" TEXT,
ADD COLUMN     "elSocioMayoritarioTieneParticipacion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "esSociedadMatriz" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numExpediente" TEXT,
ADD COLUMN     "numTrabajadores" TEXT;
