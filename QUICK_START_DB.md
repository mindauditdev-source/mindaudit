# 🚀 Guía Rápida de Inicio - Base de Datos MindAudit

## ✅ ¿Qué se ha completado?

Se ha configurado completamente la integración de Supabase con:

1. ✅ **Schema de base de datos completo** (`prisma/schema.prisma`)

   - 12 tablas principales
   - 10 enums para tipos
   - Relaciones completas
   - Índices optimizados

2. ✅ **Archivos de configuración**

   - Cliente de Prisma (`src/lib/db/prisma.ts`)
   - Cliente de Supabase (`src/lib/supabase/client.ts`)
   - Variables de entorno (`.env.local`, `.env.example`)

3. ✅ **Datos de prueba** (`prisma/seed.ts`)

   - 4 usuarios (admin, auditor, 2 partners)
   - 3 clientes
   - 3 presupuestos
   - 2 consultas
   - 2 noticias

4. ✅ **Scripts de base de datos** (en `package.json`)

   - `pnpm db:generate` - Generar cliente
   - `pnpm db:migrate` - Crear migraciones
   - `pnpm db:seed` - Poblar datos
   - `pnpm db:studio` - Abrir Prisma Studio

5. ✅ **Dependencias instaladas**
   - Prisma, Supabase, NextAuth, bcryptjs, Zod, etc.

---

## 🎯 Próximos 3 Pasos (IMPORTANTES)

### **1️⃣ Crear Proyecto en Supabase** (5 minutos)

```bash
# 1. Ve a https://supabase.com
# 2. Crea una cuenta o inicia sesión
# 3. Crea un nuevo proyecto:
#    - Name: mindaudit-dev
#    - Database Password: [genera una segura y guárdala]
#    - Region: Europe West (Ireland)
# 4. Espera 2-3 minutos a que se cree
```

### **2️⃣ Configurar Variables de Entorno** (3 minutos)

```bash
# En Supabase Dashboard:
# 1. Ve a Settings → Database
# 2. Copia "Connection string" (pooling)
# 3. Ve a Settings → API
# 4. Copia Project URL, anon key, service_role key

# Actualiza .env.local con:
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Genera NEXTAUTH_SECRET:
openssl rand -base64 32
# Copia el resultado a .env.local
```

### **3️⃣ Ejecutar Migraciones y Seed** (2 minutos)

```bash
# Generar cliente de Prisma
pnpm db:generate

# Crear y aplicar migración inicial
pnpm db:migrate

# Poblar base de datos con datos de prueba
pnpm db:seed

# Verificar en Prisma Studio
pnpm db:studio
```

---

## 🔑 Credenciales de Prueba

Después de ejecutar el seed, podrás usar:

| Rol           | Email                | Password   |
| ------------- | -------------------- | ---------- |
| **Admin**     | admin@mindaudit.es   | admin123   |
| **Auditor**   | auditor@mindaudit.es | auditor123 |
| **Partner 1** | partner1@example.com | partner123 |
| **Partner 2** | partner2@example.com | partner123 |

---

## 📚 Documentación Disponible

| Documento                             | Descripción                    |
| ------------------------------------- | ------------------------------ |
| `docs/SUPABASE_SETUP.md`              | **Guía completa paso a paso**  |
| `docs/DATABASE_SCHEMA.md`             | Diagrama y estructura de BD    |
| `docs/DATABASE_INTEGRATION_STATUS.md` | Estado actual y próximos pasos |
| `prisma/schema.prisma`                | Schema de Prisma               |
| `prisma/seed.ts`                      | Datos de prueba                |

---

## 🛠️ Comandos Útiles

```bash
# Base de datos
pnpm db:generate          # Generar cliente de Prisma
pnpm db:migrate          # Crear nueva migración
pnpm db:push             # Push schema sin migración (desarrollo)
pnpm db:seed             # Ejecutar seed
pnpm db:studio           # Abrir Prisma Studio (GUI)
pnpm db:reset            # Resetear BD (¡cuidado! elimina datos)

# Desarrollo
pnpm dev                 # Iniciar servidor (ya está corriendo)
pnpm build               # Build para producción
pnpm lint                # Ejecutar linter
```

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

```
users (autenticación)
  ├── partners (despachos profesionales)
  │   ├── clients (clientes aportados)
  │   │   └── budgets (presupuestos)
  │   ├── consultations (consultas)
  │   │   └── consultation_messages
  │   ├── meetings (reuniones)
  │   └── invoices (facturas)
  │
  └── auditors (auditores de MindAudit)
      └── news (noticias y comunicados)

documents (archivos relacionados)
audit_logs (registro de auditoría)
```

### Roles del Sistema

- **PARTNER**: Despacho profesional (gestiona clientes, solicita presupuestos)
- **AUDITOR**: MindAudit Spain (responde presupuestos, gestiona partners)
- **ADMIN**: Superadministrador (acceso total)

---

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas a `.env.local`
- [ ] NEXTAUTH_SECRET generado
- [ ] `pnpm db:generate` ejecutado
- [ ] `pnpm db:migrate` ejecutado
- [ ] `pnpm db:seed` ejecutado
- [ ] Prisma Studio abierto y datos verificados
- [ ] Servidor de desarrollo funcionando (`pnpm dev`)

---

## 🚨 Solución de Problemas

### Error: "Can't reach database server"

→ Verifica las URLs de conexión en `.env.local`

### Error: "Environment variable not found"

→ Reinicia el servidor de desarrollo después de modificar `.env.local`

### Error: "Prisma Client is not generated"

→ Ejecuta `pnpm db:generate`

### Error en migraciones

→ Ejecuta `pnpm db:push` para desarrollo rápido

---

## 📞 Ayuda

Si tienes problemas:

1. Revisa `docs/SUPABASE_SETUP.md` - Guía detallada
2. Revisa `docs/DATABASE_INTEGRATION_STATUS.md` - Estado actual
3. Ejecuta `pnpm db:studio` para ver los datos
4. Verifica que Supabase esté activo en el dashboard

---

## 🎉 ¡Listo!

Una vez completados los 3 pasos anteriores, tendrás:

✅ Base de datos PostgreSQL en Supabase
✅ Schema completo con todas las tablas
✅ Datos de prueba para desarrollo
✅ Sistema de autenticación con roles
✅ Listo para implementar la lógica de negocio

**Siguiente fase:** Implementar autenticación con NextAuth
