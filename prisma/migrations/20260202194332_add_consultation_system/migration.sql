-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConsultaStatus" AS ENUM ('PENDIENTE', 'COTIZADA', 'ACEPTADA', 'RECHAZADA', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PagoStatus" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');

-- AlterTable
ALTER TABLE "auditorias" ADD COLUMN     "meetingDate" TIMESTAMP(3),
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "meetingRequestedBy" "UserRole",
ADD COLUMN     "meetingStatus" "MeetingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "horasDisponibles" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "esUrgente" BOOLEAN NOT NULL DEFAULT false,
    "requiereVideo" BOOLEAN NOT NULL DEFAULT false,
    "colaboradorId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "horasAsignadas" DOUBLE PRECISION,
    "horasCustom" DOUBLE PRECISION,
    "status" "ConsultaStatus" NOT NULL DEFAULT 'PENDIENTE',
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondidaAt" TIMESTAMP(3),
    "aceptadaAt" TIMESTAMP(3),

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_consulta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "horas" DOUBLE PRECISION NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_consulta" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paquetes_horas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "horas" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "descuento" INTEGER,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paquetes_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras_horas" (
    "id" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "paqueteId" TEXT NOT NULL,
    "horas" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "stripeSessionId" TEXT,
    "stripePiId" TEXT,
    "status" "PagoStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "compras_horas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultas_colaboradorId_idx" ON "consultas"("colaboradorId");

-- CreateIndex
CREATE INDEX "consultas_status_idx" ON "consultas"("status");

-- CreateIndex
CREATE INDEX "consultas_createdAt_idx" ON "consultas"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_consulta_nombre_key" ON "categorias_consulta"("nombre");

-- CreateIndex
CREATE INDEX "categorias_consulta_activo_idx" ON "categorias_consulta"("activo");

-- CreateIndex
CREATE INDEX "archivos_consulta_consultaId_idx" ON "archivos_consulta"("consultaId");

-- CreateIndex
CREATE INDEX "paquetes_horas_activo_idx" ON "paquetes_horas"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "compras_horas_stripeSessionId_key" ON "compras_horas"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "compras_horas_stripePiId_key" ON "compras_horas"("stripePiId");

-- CreateIndex
CREATE INDEX "compras_horas_colaboradorId_idx" ON "compras_horas"("colaboradorId");

-- CreateIndex
CREATE INDEX "compras_horas_status_idx" ON "compras_horas"("status");

-- CreateIndex
CREATE INDEX "compras_horas_createdAt_idx" ON "compras_horas"("createdAt");

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias_consulta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_consulta" ADD CONSTRAINT "archivos_consulta_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_horas" ADD CONSTRAINT "compras_horas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_horas" ADD CONSTRAINT "compras_horas_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "paquetes_horas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
