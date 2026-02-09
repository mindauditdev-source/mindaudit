-- AlterTable
ALTER TABLE "consultas_mensajes" ADD COLUMN     "archivoNombre" TEXT,
ADD COLUMN     "archivoSize" INTEGER,
ADD COLUMN     "archivoTipo" TEXT,
ADD COLUMN     "archivoUrl" TEXT,
ALTER COLUMN "contenido" DROP NOT NULL;
