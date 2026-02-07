-- CreateTable
CREATE TABLE "consultas_mensajes" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultas_mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultas_mensajes_consultaId_idx" ON "consultas_mensajes"("consultaId");

-- CreateIndex
CREATE INDEX "consultas_mensajes_userId_idx" ON "consultas_mensajes"("userId");

-- AddForeignKey
ALTER TABLE "consultas_mensajes" ADD CONSTRAINT "consultas_mensajes_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas_mensajes" ADD CONSTRAINT "consultas_mensajes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
