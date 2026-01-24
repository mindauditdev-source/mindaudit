# MindAudit API - Guía de Uso

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- PostgreSQL (Supabase)
- Variables de entorno configuradas en `.env`

### Instalación

```bash
# Instalar dependencias
pnpm install

# Generar cliente de Prisma
pnpm db:generate

# Ejecutar migraciones
pnpm db:migrate

# Iniciar servidor de desarrollo
pnpm dev
```

---

## 📚 Endpoints de la API

### Autenticación

#### Registro de Colaborador

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan García",
  "email": "juan@asesoria.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "companyName": "Asesoría García SL",
  "cif": "B12345678",
  "phone": "612345678",
  "address": "Calle Mayor 1",
  "city": "Madrid",
  "province": "Madrid",
  "postalCode": "28001",
  "website": "https://asesoria-garcia.com",
  "acceptTerms": true
}
```

#### Login

```http
POST /api/auth/signin/credentials
Content-Type: application/json

{
  "email": "juan@asesoria.com",
  "password": "Password123"
}
```

---

### Colaboradores

#### Obtener Perfil Propio

```http
GET /api/colaboradores/me
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "colaborador": {
      "id": "clx...",
      "companyName": "Asesoría García SL",
      "cif": "B12345678",
      "status": "ACTIVE",
      "commissionRate": 10,
      "totalCommissions": 4500,
      "pendingCommissions": 1500,
      "stats": {
        "totalEmpresas": 5,
        "totalAuditorias": 12,
        "totalComisiones": 9
      }
    }
  }
}
```

#### Actualizar Perfil

```http
PATCH /api/colaboradores/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "612999888",
  "website": "https://nueva-web.com"
}
```

#### Listar Empresas Cliente

```http
GET /api/colaboradores/me/empresas
Authorization: Bearer <token>
```

#### Ver Comisiones

```http
GET /api/colaboradores/me/comisiones
Authorization: Bearer <token>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPendiente": 1500,
      "totalPagado": 3000,
      "totalAcumulado": 4500,
      "comisionesPendientes": 3,
      "comisionesPagadas": 6
    },
    "comisiones": [
      {
        "id": "cly...",
        "montoComision": 500,
        "porcentaje": 10,
        "status": "PENDIENTE",
        "fechaPago": null,
        "auditoria": {
          "tipoServicio": "AUDITORIA_CUENTAS",
          "empresa": {
            "companyName": "Empresa Cliente SL"
          }
        }
      }
    ]
  }
}
```

---

### Empresas

#### Crear Empresa (por Colaborador)

```http
POST /api/empresas
Authorization: Bearer <token-colaborador>
Content-Type: application/json

{
  "companyName": "Empresa Cliente SL",
  "cif": "B87654321",
  "contactName": "María López",
  "contactEmail": "maria@empresa.com",
  "contactPhone": "698765432",
  "revenue": 500000,
  "fiscalYear": 2024,
  "employees": 25
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "empresa": {
      "id": "clx...",
      "companyName": "Empresa Cliente SL",
      "cif": "B87654321",
      "origen": "COLABORADOR",
      "status": "PROSPECT"
    }
  },
  "message": "Empresa creada exitosamente"
}
```

#### Obtener Perfil de Empresa

```http
GET /api/empresas/me
Authorization: Bearer <token-empresa>
```

#### Actualizar Perfil de Empresa

```http
PATCH /api/empresas/me
Authorization: Bearer <token-empresa>
Content-Type: application/json

{
  "revenue": 600000,
  "employees": 30
}
```

---

### Auditorías

#### Solicitar Auditoría

```http
POST /api/auditorias
Authorization: Bearer <token>
Content-Type: application/json

{
  "empresaId": "clx...",
  "tipoServicio": "AUDITORIA_CUENTAS",
  "fiscalYear": 2024,
  "description": "Auditoría de cuentas anuales 2024",
  "urgente": false
}
```

**Tipos de Servicio:**

- `AUDITORIA_CUENTAS` - Auditoría de cuentas anuales (obligatoria)
- `AUDITORIA_CONSOLIDADA` - Auditoría de cuentas consolidadas
- `AUDITORIA_VOLUNTARIA` - Auditoría voluntaria
- `AUDITORIA_SUBVENCIONES` - Auditoría de subvenciones
- `REVISION_LIMITADA` - Revisión limitada
- `DUE_DILIGENCE` - Due diligence
- `AUDITORIA_FORENSE` - Auditoría forense
- `OTROS` - Otros servicios

#### Listar Auditorías

```http
GET /api/auditorias
Authorization: Bearer <token>

# Filtros opcionales:
GET /api/auditorias?status=SOLICITADA
```

#### Ver Detalles de Auditoría

```http
GET /api/auditorias/:id
Authorization: Bearer <token>
```

#### Enviar Presupuesto (Admin)

```http
POST /api/auditorias/:id/presupuesto
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "presupuesto": 5000,
  "presupuestoNotas": "Incluye revisión completa de estados financieros",
  "diasValidez": 30
}
```

#### Aprobar Presupuesto (Empresa) ⭐

```http
PATCH /api/auditorias/:id/approve
Authorization: Bearer <token-empresa>
```

**Respuesta con Comisión Generada:**

```json
{
  "success": true,
  "data": {
    "auditoria": {
      "id": "clx...",
      "status": "APROBADA",
      "fechaAprobacion": "2024-01-24T15:30:00Z",
      "presupuesto": 5000
    },
    "comision": {
      "id": "cly...",
      "montoComision": 500,
      "porcentaje": 10,
      "status": "PENDIENTE",
      "message": "Comisión generada automáticamente"
    }
  },
  "message": "Auditoría aprobada exitosamente. Comisión generada automáticamente."
}
```

#### Rechazar Presupuesto (Empresa)

```http
PATCH /api/auditorias/:id/reject
Authorization: Bearer <token-empresa>
Content-Type: application/json

{
  "motivo": "Presupuesto demasiado alto"
}
```

---

### Admin

#### Dashboard de Estadísticas

```http
GET /api/admin/stats
Authorization: Bearer <token-admin>
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalColaboradores": 15,
      "totalEmpresas": 45,
      "totalAuditorias": 120,
      "auditoriasActivas": 23,
      "empresasPorOrigen": {
        "COLABORADOR": 35,
        "DIRECTA": 10
      },
      "comisiones": {
        "pendientes": {
          "total": 12500,
          "count": 25
        },
        "pagadas": {
          "total": 45000,
          "count": 90
        }
      },
      "ingresosMes": 85000,
      "auditoriasPorEstado": {
        "SOLICITADA": 5,
        "PRESUPUESTADA": 8,
        "APROBADA": 10,
        "COMPLETADA": 97
      }
    }
  }
}
```

#### Listar Colaboradores

```http
GET /api/admin/colaboradores
Authorization: Bearer <token-admin>

# Filtros opcionales:
GET /api/admin/colaboradores?status=PENDING_APPROVAL
GET /api/admin/colaboradores?search=garcia
```

#### Aprobar Colaborador

```http
PATCH /api/admin/colaboradores/:id/approve
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "commissionRate": 12
}
```

#### Configurar Tasa de Comisión

```http
PATCH /api/admin/colaboradores/:id/commission-rate
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "commissionRate": 15
}
```

#### Listar Comisiones

```http
GET /api/admin/comisiones
Authorization: Bearer <token-admin>

# Filtros opcionales:
GET /api/admin/comisiones?status=PENDIENTE
GET /api/admin/comisiones?colaboradorId=clx...
```

#### Pagar Comisión

```http
PATCH /api/admin/comisiones/:id/pay
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "referenciaPago": "TRANS-2024-001",
  "notas": "Transferencia bancaria realizada el 24/01/2024"
}
```

---

## 🔐 Autenticación

La API usa **NextAuth** con JWT. Después del login, obtendrás una sesión que se gestiona automáticamente.

### Headers Requeridos

```http
Authorization: Bearer <session-token>
Content-Type: application/json
```

---

## 🎯 Flujos de Trabajo

### Flujo 1: Colaborador Trae Cliente

1. **Colaborador se registra**

   ```
   POST /api/auth/register (role: COLABORADOR)
   ```

2. **Admin aprueba colaborador**

   ```
   PATCH /api/admin/colaboradores/:id/approve
   ```

3. **Colaborador crea empresa cliente**

   ```
   POST /api/empresas
   → origen: COLABORADOR
   → colaboradorId: <id-colaborador>
   ```

4. **Colaborador solicita auditoría**

   ```
   POST /api/auditorias
   → empresaId: <id-empresa>
   → colaboradorId: <id-colaborador> (automático)
   ```

5. **Admin envía presupuesto**

   ```
   POST /api/auditorias/:id/presupuesto
   → status: PRESUPUESTADA
   ```

6. **Empresa aprueba presupuesto**

   ```
   PATCH /api/auditorias/:id/approve
   → status: APROBADA
   → ⭐ Comisión generada automáticamente
   ```

7. **Admin paga comisión**
   ```
   PATCH /api/admin/comisiones/:id/pay
   → status: PAGADA
   ```

### Flujo 2: Empresa Directa (Sin Comisión)

1. **Empresa se registra**

   ```
   POST /api/auth/register (role: EMPRESA)
   → origen: DIRECTA
   → colaboradorId: null
   ```

2. **Empresa solicita auditoría**

   ```
   POST /api/auditorias
   → colaboradorId: null
   ```

3. **Admin envía presupuesto**

   ```
   POST /api/auditorias/:id/presupuesto
   ```

4. **Empresa aprueba**
   ```
   PATCH /api/auditorias/:id/approve
   → ❌ NO se genera comisión (origen: DIRECTA)
   ```

---

## 💰 Sistema de Comisiones

### Cálculo Automático

```javascript
// Cuando una auditoría es aprobada:
if (empresa.origen === "COLABORADOR") {
  const rate = colaborador.commissionRate || 10; // Default 10%
  const comision = presupuesto * (rate / 100);

  // Crear registro de comisión
  // Actualizar totales del colaborador
}
```

### Estados de Comisión

- **PENDIENTE**: Generada, esperando pago
- **PAGADA**: Pagada al colaborador
- **CANCELADA**: Auditoría cancelada

### Tasas Personalizadas

El admin puede configurar tasas personalizadas por colaborador:

```http
PATCH /api/admin/colaboradores/:id/commission-rate
{ "commissionRate": 15 }
```

---

## 🔒 Control de Acceso

### Roles

- **ADMIN**: Acceso total al sistema
- **COLABORADOR**: Gestiona sus empresas y ve sus comisiones
- **EMPRESA**: Ve solo su información

### Matriz de Permisos

| Recurso             | Admin      | Colaborador       | Empresa     |
| ------------------- | ---------- | ----------------- | ----------- |
| Crear empresa       | ✅         | ✅ (cliente)      | ❌          |
| Ver todas empresas  | ✅         | ❌                | ❌          |
| Solicitar auditoría | ✅         | ✅ (sus empresas) | ✅ (propia) |
| Enviar presupuesto  | ✅         | ❌                | ❌          |
| Aprobar presupuesto | ✅         | ❌                | ✅ (propia) |
| Ver comisiones      | ✅ (todas) | ✅ (propias)      | ❌          |
| Pagar comisiones    | ✅         | ❌                | ❌          |

---

## 📊 Respuestas de la API

### Formato de Éxito

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Formato de Error

```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (ej: CIF duplicado)
- `422` - Validation Error
- `500` - Server Error

---

## 🧪 Testing

### Probar con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mindaudit.es","password":"Admin123"}'

# Obtener estadísticas (admin)
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <token>"

# Ver comisiones (colaborador)
curl http://localhost:3000/api/colaboradores/me/comisiones \
  -H "Authorization: Bearer <token>"
```

### Probar con Postman

1. Importar colección (próximamente)
2. Configurar variable de entorno `{{baseUrl}}` = `http://localhost:3000`
3. Ejecutar flujos de trabajo

---

## 🚀 Próximos Pasos

### Pendiente de Implementar

- [ ] Sistema de notificaciones por email
- [ ] Gestión de documentos (upload/download)
- [ ] Completar flujo de auditorías
- [ ] Tests unitarios e integración
- [ ] Documentación OpenAPI/Swagger

### Mejoras Futuras

- [ ] Webhooks para eventos importantes
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Dashboard analytics avanzado
- [ ] Integración con pasarelas de pago
- [ ] API de facturación

---

## 📞 Soporte

Para dudas o problemas con la API, contactar a:

- Email: dev@mindaudit.es
- Documentación: [docs.mindaudit.es](https://docs.mindaudit.es)

---

## 📝 Changelog

### v1.0.0 (2024-01-24)

- ✅ Sistema de comisiones automático
- ✅ Gestión de colaboradores y empresas
- ✅ Flujo completo de auditorías
- ✅ Panel administrativo
- ✅ Control de acceso basado en roles
