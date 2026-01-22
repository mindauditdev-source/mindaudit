-- Script para limpiar completamente la base de datos de MindAudit
-- ADVERTENCIA: Esto eliminará TODAS las tablas y datos

-- Desactivar foreign key checks temporalmente
SET session_replication_role = 'replica';

-- Eliminar todas las tablas en orden inverso de dependencias
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "documentos" CASCADE;
DROP TABLE IF EXISTS "comisiones" CASCADE;
DROP TABLE IF EXISTS "auditorias" CASCADE;
DROP TABLE IF EXISTS "empresas" CASCADE;
DROP TABLE IF EXISTS "colaboradores" CASCADE;
DROP TABLE IF EXISTS "configuracion_sistema" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Tablas antiguas (por si acaso)
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

-- Reactivar foreign key checks
SET session_replication_role = 'origin';

-- Verificar que no queden tablas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
