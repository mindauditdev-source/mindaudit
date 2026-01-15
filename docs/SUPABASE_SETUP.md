# 🗄️ Guía de Configuración de Supabase para MindAudit

## 📋 Índice

1. [Creación del Proyecto en Supabase](#1-creación-del-proyecto-en-supabase)
2. [Configuración de la Base de Datos](#2-configuración-de-la-base-de-datos)
3. [Configuración de Variables de Entorno](#3-configuración-de-variables-de-entorno)
4. [Instalación de Dependencias](#4-instalación-de-dependencias)
5. [Ejecución de Migraciones](#5-ejecución-de-migraciones)
6. [Configuración de Storage](#6-configuración-de-storage)
7. [Seed de Datos Iniciales](#7-seed-de-datos-iniciales)
8. [Verificación](#8-verificación)

---

## 1. Creación del Proyecto en Supabase

### Paso 1.1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta o inicia sesión con GitHub

### Paso 1.2: Crear nuevo proyecto

1. En el dashboard, haz clic en "New Project"
2. Completa los datos:
   - **Name**: `mindaudit-production` (o `mindaudit-dev` para desarrollo)
   - **Database Password**: Genera una contraseña segura y **guárdala**
   - **Region**: Selecciona `Europe West (Ireland)` o la más cercana a España
   - **Pricing Plan**: Free tier es suficiente para desarrollo
3. Haz clic en "Create new project"
4. Espera 2-3 minutos mientras se crea el proyecto

---

## 2. Configuración de la Base de Datos

### Paso 2.1: Obtener credenciales de conexión

1. En el dashboard de Supabase, ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Copia las siguientes URLs:

   **Connection pooling (recomendado para Next.js):**

   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```

   **Direct connection (para migraciones):**

   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Paso 2.2: Obtener API Keys

1. Ve a **Settings** → **API**
2. Copia las siguientes claves:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public**: Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: Esta es tu `SUPABASE_SERVICE_ROLE_KEY` (¡mantenla secreta!)

---

## 3. Configuración de Variables de Entorno

### Paso 3.1: Actualizar `.env.local`

Abre el archivo `.env.local` y reemplaza los valores de Supabase:

```bash
# ============================================
# DATABASE (Supabase PostgreSQL)
# ============================================
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ============================================
# FILE STORAGE (Supabase Storage)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Paso 3.2: Generar NEXTAUTH_SECRET

Ejecuta en tu terminal:

```bash
openssl rand -base64 32
```

Copia el resultado y actualiza en `.env.local`:

```bash
NEXTAUTH_SECRET="el-resultado-del-comando-anterior"
```

---

## 4. Instalación de Dependencias

### Paso 4.1: Instalar dependencias de Prisma

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### Paso 4.2: Instalar Supabase client

```bash
pnpm add @supabase/supabase-js
```

### Paso 4.3: Instalar dependencias de autenticación

```bash
pnpm add next-auth bcryptjs
pnpm add -D @types/bcryptjs
```

### Paso 4.4: Instalar dependencias de validación

```bash
pnpm add zod react-hook-form @hookform/resolvers
```

### Paso 4.5: Instalar dependencias de email

```bash
pnpm add resend
```

### Paso 4.6: Instalar utilidades

```bash
pnpm add date-fns
```

---

## 5. Ejecución de Migraciones

### Paso 5.1: Generar el cliente de Prisma

```bash
pnpm prisma generate
```

### Paso 5.2: Crear la primera migración

```bash
pnpm prisma migrate dev --name init
```

Este comando:

- Creará las tablas en Supabase
- Generará archivos de migración en `prisma/migrations/`
- Actualizará el cliente de Prisma

### Paso 5.3: Verificar las tablas

1. Ve al dashboard de Supabase
2. Navega a **Table Editor**
3. Deberías ver todas las tablas creadas:
   - users
   - partners
   - auditors
   - clients
   - budgets
   - consultations
   - consultation_messages
   - meetings
   - invoices
   - news
   - documents
   - audit_logs

---

## 6. Configuración de Storage

### Paso 6.1: Crear buckets en Supabase

1. En el dashboard de Supabase, ve a **Storage**
2. Crea los siguientes buckets:

   **Bucket: `documents`**

   - Public: No
   - File size limit: 50 MB
   - Allowed MIME types: `application/pdf`, `image/*`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`

   **Bucket: `contracts`**

   - Public: No
   - File size limit: 10 MB
   - Allowed MIME types: `application/pdf`

   **Bucket: `invoices`**

   - Public: No
   - File size limit: 10 MB
   - Allowed MIME types: `application/pdf`

   **Bucket: `avatars`**

   - Public: Yes
   - File size limit: 2 MB
   - Allowed MIME types: `image/*`

### Paso 6.2: Configurar políticas de seguridad (RLS)

Para cada bucket, configura las políticas de Row Level Security:

**Política para `documents`:**

```sql
-- Permitir upload solo a usuarios autenticados
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Permitir lectura solo al propietario
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permitir eliminación solo al propietario
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 7. Seed de Datos Iniciales

### Paso 7.1: Configurar el script de seed en package.json

Abre `package.json` y agrega:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Paso 7.2: Instalar tsx para ejecutar TypeScript

```bash
pnpm add -D tsx
```

### Paso 7.3: Ejecutar el seed

```bash
pnpm prisma db seed
```

Este comando creará:

- 1 usuario admin
- 1 usuario auditor
- 2 usuarios partners con sus empresas
- 3 clientes
- 3 presupuestos
- 2 consultas
- 2 noticias

### Paso 7.4: Credenciales de prueba

Después del seed, podrás iniciar sesión con:

- **Admin**: `admin@mindaudit.es` / `admin123`
- **Auditor**: `auditor@mindaudit.es` / `auditor123`
- **Partner 1**: `partner1@example.com` / `partner123`
- **Partner 2**: `partner2@example.com` / `partner123`

---

## 8. Verificación

### Paso 8.1: Verificar conexión a la base de datos

```bash
pnpm prisma studio
```

Esto abrirá Prisma Studio en `http://localhost:5555` donde podrás:

- Ver todas las tablas
- Explorar los datos creados por el seed
- Editar datos manualmente

### Paso 8.2: Verificar en Supabase Dashboard

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `users`
3. Deberías ver 4 usuarios creados
4. Verifica que las relaciones funcionan correctamente

### Paso 8.3: Probar la aplicación

```bash
pnpm dev
```

La aplicación debería:

- Conectarse correctamente a Supabase
- Poder consultar datos
- No mostrar errores de conexión

---

## 🔧 Comandos Útiles de Prisma

```bash
# Generar cliente de Prisma
pnpm prisma generate

# Crear nueva migración
pnpm prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Resetear base de datos (¡CUIDADO! Elimina todos los datos)
pnpm prisma migrate reset

# Abrir Prisma Studio
pnpm prisma studio

# Ver estado de migraciones
pnpm prisma migrate status

# Formatear schema.prisma
pnpm prisma format

# Ejecutar seed
pnpm prisma db seed
```

---

## 🚨 Solución de Problemas

### Error: "Can't reach database server"

**Solución:**

1. Verifica que las URLs de conexión sean correctas
2. Verifica que la contraseña no contenga caracteres especiales sin codificar
3. Verifica que el proyecto de Supabase esté activo

### Error: "Environment variable not found: DATABASE_URL"

**Solución:**

1. Verifica que `.env.local` existe
2. Verifica que las variables estén correctamente definidas
3. Reinicia el servidor de desarrollo

### Error en migraciones

**Solución:**

```bash
# Resetear migraciones (¡elimina datos!)
pnpm prisma migrate reset

# O aplicar manualmente
pnpm prisma db push
```

### Error: "Prisma Client is not generated"

**Solución:**

```bash
pnpm prisma generate
```

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de Prisma con Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Next.js con Prisma](https://www.prisma.io/nextjs)

---

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas a `.env.local`
- [ ] Dependencias instaladas
- [ ] Migraciones ejecutadas
- [ ] Buckets de storage creados
- [ ] Políticas de seguridad configuradas
- [ ] Seed ejecutado correctamente
- [ ] Prisma Studio funciona
- [ ] Aplicación conecta correctamente

---

**¡Configuración completada!** 🎉

Ahora tienes una base de datos PostgreSQL en Supabase completamente configurada con:

- ✅ Esquema de base de datos completo
- ✅ Roles y permisos
- ✅ Datos de prueba
- ✅ Storage configurado
- ✅ Listo para desarrollo
