-- Step 1: Add new values to enums
ALTER TYPE "AuditoriaStatus" ADD VALUE IF NOT EXISTS 'PENDIENTE_DE_PAGO';
ALTER TYPE "SolicitudStatus" ADD VALUE IF NOT EXISTS 'CANCELADA';

-- Step 2: Update existing data (COMMENTED OUT FOR RESET - Unsafe enum use in same transaction)
-- UPDATE "auditorias" SET "status" = 'SOLICITADA' WHERE "status" = 'EN_REVISION';
-- UPDATE "auditorias" SET "status" = 'PENDIENTE_DE_PAGO' WHERE "status" = 'APROBADA';

-- Note: Postgres doesn't allow removing enum values directly.
-- The old values EN_REVISION and APROBADA will remain in the enum but won't be used.
-- This is safe and standard practice in PostgreSQL migrations.

