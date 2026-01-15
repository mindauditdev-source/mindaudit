# ✅ Checklist de Configuración de Supabase

## 📋 Instrucciones

Sigue estos pasos en orden. Marca cada uno cuando lo completes.

---

## 🎯 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear Cuenta

- [ ] Ir a [https://supabase.com](https://supabase.com)
- [ ] Hacer clic en "Start your project"
- [ ] Crear cuenta o iniciar sesión con GitHub

### 1.2 Crear Proyecto

- [ ] En el dashboard, hacer clic en "New Project"
- [ ] Completar datos:
  - **Name:** `mindaudit-dev`
  - **Database Password:** ********\_******** (¡guárdala!)
  - **Region:** Europe West (Ireland)
  - **Pricing Plan:** Free
- [ ] Hacer clic en "Create new project"
- [ ] Esperar 2-3 minutos mientras se crea

---

## 🔑 Paso 2: Copiar Credenciales

### 2.1 Obtener URLs de Base de Datos

- [ ] En Supabase Dashboard, ir a **Settings** → **Database**
- [ ] Buscar sección **Connection string**
- [ ] Copiar **Connection pooling URL**:
  ```
  postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
  ```
- [ ] Copiar **Direct connection URL**:
  ```
  postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres
  ```

### 2.2 Obtener API Keys

- [ ] Ir a **Settings** → **API**
- [ ] Copiar **Project URL**:
  ```
  https://[PROJECT-REF].supabase.co
  ```
- [ ] Copiar **anon public key** (empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- [ ] Copiar **service_role key** (empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

## 📝 Paso 3: Actualizar .env.local

### 3.1 Abrir archivo

- [ ] Abrir `c:/Users/jjhur/Work/others/mindaudit/.env.local`

### 3.2 Actualizar variables de base de datos

- [ ] Reemplazar `DATABASE_URL` con la Connection pooling URL
- [ ] Reemplazar `DIRECT_URL` con la Direct connection URL
- [ ] Asegurarse de que la contraseña esté correcta en ambas URLs

### 3.3 Actualizar variables de Supabase

- [ ] Reemplazar `NEXT_PUBLIC_SUPABASE_URL` con el Project URL
- [ ] Reemplazar `NEXT_PUBLIC_SUPABASE_ANON_KEY` con el anon public key
- [ ] Reemplazar `SUPABASE_SERVICE_ROLE_KEY` con el service_role key

### 3.4 Generar NEXTAUTH_SECRET

- [ ] Abrir terminal en el proyecto
- [ ] Ejecutar: `openssl rand -base64 32`
- [ ] Copiar el resultado
- [ ] Reemplazar `NEXTAUTH_SECRET` en `.env.local` con el resultado

### 3.5 Guardar archivo

- [ ] Guardar `.env.local`
- [ ] Verificar que todas las variables estén actualizadas

---

## 🗄️ Paso 4: Ejecutar Migraciones

### 4.1 Generar Cliente de Prisma

- [ ] Abrir terminal en el proyecto
- [ ] Ejecutar:
  ```bash
  pnpm db:generate
  ```
- [ ] Esperar a que termine (debería decir "Generated Prisma Client")

### 4.2 Crear Migración Inicial

- [ ] Ejecutar:
  ```bash
  pnpm db:migrate
  ```
- [ ] Cuando pregunte el nombre, escribir: `init`
- [ ] Esperar a que termine
- [ ] Debería crear las tablas en Supabase

### 4.3 Verificar Tablas en Supabase

- [ ] Ir al dashboard de Supabase
- [ ] Navegar a **Table Editor**
- [ ] Verificar que existan estas tablas:
  - [ ] users
  - [ ] partners
  - [ ] auditors
  - [ ] clients
  - [ ] budgets
  - [ ] consultations
  - [ ] consultation_messages
  - [ ] meetings
  - [ ] invoices
  - [ ] news
  - [ ] documents
  - [ ] audit_logs

---

## 🌱 Paso 5: Ejecutar Seed

### 5.1 Poblar Base de Datos

- [ ] En la terminal, ejecutar:
  ```bash
  pnpm db:seed
  ```
- [ ] Esperar a que termine
- [ ] Debería mostrar un resumen de datos creados

### 5.2 Verificar Datos

- [ ] Ejecutar:
  ```bash
  pnpm db:studio
  ```
- [ ] Se abrirá Prisma Studio en el navegador
- [ ] Verificar que existan:
  - [ ] 4 usuarios (admin, auditor, 2 partners)
  - [ ] 2 partners con empresas
  - [ ] 1 auditor con perfil
  - [ ] 3 clientes
  - [ ] 3 presupuestos
  - [ ] 2 consultas
  - [ ] 2 noticias

---

## 🎨 Paso 6: Configurar Storage (Opcional)

### 6.1 Crear Buckets

- [ ] En Supabase Dashboard, ir a **Storage**
- [ ] Crear bucket `documents`:
  - [ ] Public: No
  - [ ] File size limit: 50 MB
- [ ] Crear bucket `contracts`:
  - [ ] Public: No
  - [ ] File size limit: 10 MB
- [ ] Crear bucket `invoices`:
  - [ ] Public: No
  - [ ] File size limit: 10 MB
- [ ] Crear bucket `avatars`:
  - [ ] Public: Yes
  - [ ] File size limit: 2 MB

---

## ✅ Paso 7: Verificación Final

### 7.1 Verificar Servidor de Desarrollo

- [ ] El servidor `pnpm dev` está corriendo
- [ ] No hay errores en la consola
- [ ] La aplicación carga en `http://localhost:3000`

### 7.2 Verificar Conexión a BD

- [ ] Prisma Studio funciona (`pnpm db:studio`)
- [ ] Se pueden ver los datos en Prisma Studio
- [ ] No hay errores de conexión

### 7.3 Verificar Supabase

- [ ] Dashboard de Supabase accesible
- [ ] Todas las tablas visibles en Table Editor
- [ ] Datos visibles en las tablas

---

## 🎉 ¡Completado!

Si todos los pasos están marcados, ¡felicidades! La integración de Supabase está completa.

### 🔑 Credenciales de Prueba

Puedes usar estas credenciales para probar el login cuando se implemente:

| Rol       | Email                | Password   |
| --------- | -------------------- | ---------- |
| Admin     | admin@mindaudit.es   | admin123   |
| Auditor   | auditor@mindaudit.es | auditor123 |
| Partner 1 | partner1@example.com | partner123 |
| Partner 2 | partner2@example.com | partner123 |

---

## 📚 Próximos Pasos

Ahora que la base de datos está configurada, los siguientes pasos son:

1. **Implementar autenticación** (NextAuth)
2. **Crear componentes de login/registro**
3. **Desarrollar API routes**
4. **Implementar dashboard del partner**
5. **Implementar dashboard del auditor**

Ver `docs/IMPLEMENTATION_PLAN.md` para más detalles.

---

## 🆘 ¿Problemas?

Si tienes algún problema:

1. Revisa `docs/SUPABASE_SETUP.md` - Guía detallada
2. Revisa `QUICK_START_DB.md` - Guía rápida
3. Verifica que las credenciales en `.env.local` sean correctas
4. Reinicia el servidor de desarrollo
5. Ejecuta `pnpm db:generate` de nuevo

---

**Última actualización:** 15 de enero de 2026
