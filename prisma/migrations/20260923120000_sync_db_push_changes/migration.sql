-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "colaboradores" ADD COLUMN     "dniParticular" TEXT,
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "mandato" TEXT,
ADD COLUMN     "primerApellido" TEXT,
ADD COLUMN     "segundoApellido" TEXT;

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "dniParticular" TEXT,
ADD COLUMN     "mandato" TEXT,
ADD COLUMN     "primerApellido" TEXT,
ADD COLUMN     "segundoApellido" TEXT,
ADD COLUMN     "serviceDescription" TEXT,
ADD COLUMN     "serviceType" TEXT,
ALTER COLUMN "fiscalYear" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "presupuestos" ALTER COLUMN "fiscalYear" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

