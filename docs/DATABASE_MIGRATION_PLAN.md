# 📊 ANÁLISIS Y PLAN DE MIGRACIÓN - MINDAUDIT DATABASE

## 🎯 Resumen Ejecutivo

Se ha diseñado una nueva arquitectura de base de datos optimizada para el modelo de negocio real de MindAudit Spain, que gestiona:

- **Colaboradores** (asesores/gestorías que traen empresas)
- **Empresas** (clientes que necesitan auditoría)
- **Auditorías** (servicios prestados)
- **Comisiones** (pagos a colaboradores)

---

## 📋 CAMBIOS PRINCIPALES

### 1. **Renombramiento de Entidades**

| Antes (Schema Antiguo) | Ahora (Schema Nuevo) | Razón                                                       |
| ---------------------- | -------------------- | ----------------------------------------------------------- |
| `Partner`              | `Colaborador`        | Refleja mejor el rol: asesores que traen clientes           |
| `Client`               | `Empresa`            | Son las empresas que necesitan auditoría                    |
| `Budget`               | `Auditoria`          | El concepto central es la auditoría, no solo el presupuesto |

### 2. **Nuevas Entidades**

#### **Comision**

```prisma
model Comision {
  id              String
  colaboradorId   String
  auditoriaId     String
  montoBase       Decimal
  porcentaje      Decimal
  montoComision   Decimal
  status          ComisionStatus (PENDIENTE, PAGADA, CANCELADA)
  fechaPago       DateTime?
}
```

**Propósito**: Tracking completo del historial de comisiones pagadas a colaboradores.

#### **ConfiguracionSistema**

```prisma
model ConfiguracionSistema {
  id                      String
  comisionDefaultRate     Decimal  // % por defecto
  diasValidezPresupuesto  Int
  emailNotificaciones     String
}
```

**Propósito**: Configuración centralizada del sistema (porcentajes, días de validez, etc.)

### 3. **Campos Críticos Añadidos**

#### En `Empresa`:

- `origen`: `COLABORADOR` o `DIRECTA` (tracking de cómo llegó la empresa)
- `colaboradorId`: Relación opcional con el colaborador que la trajo
- `userId`: Opcional (null si fue creada por colaborador)

#### En `Colaborador`:

- `commissionRate`: % de comisión configurado por admin
- `totalCommissions`: Total acumulado histórico
- `pendingCommissions`: Pendiente de pago

#### En `Auditoria`:

- `colaboradorId`: Quién solicitó la auditoría
- `comisionRate` y `comisionAmount`: Comisión específica de esta auditoría
- `comisionPagada`: Boolean para tracking de pago

---

## 🔄 FLUJOS DE NEGOCIO SOPORTADOS

### **Flujo 1: Colaborador trae Empresa**

```
1. Colaborador se registra → User (role: COLABORADOR) + Colaborador
2. Colaborador crea Empresa en su panel → Empresa (origen: COLABORADOR, colaboradorId: X)
3. Colaborador solicita Auditoria → Auditoria (colaboradorId: X)
4. Admin aprueba presupuesto → Auditoria.status = APROBADA
5. Se completa auditoría → Auditoria.status = COMPLETADA
6. Sistema genera Comision automáticamente
7. Admin paga comisión → Comision.status = PAGADA
```

### **Flujo 2: Empresa Directa**

```
1. Empresa se registra → User (role: EMPRESA) + Empresa (origen: DIRECTA)
2. Empresa solicita Auditoria → Auditoria (colaboradorId: null)
3. Admin aprueba y completa → Sin comisiones generadas
```

---

## 🗂️ ESTRUCTURA DE ROLES Y PERMISOS

### **ADMIN**

- ✅ Ver todas las empresas, colaboradores y auditorías
- ✅ Configurar porcentajes de comisión
- ✅ Aprobar/rechazar presupuestos
- ✅ Gestionar pagos de comisiones
- ✅ Acceso completo a configuración del sistema

### **COLABORADOR**

- ✅ Ver solo SUS empresas (where: colaboradorId = currentUser.colaboradorId)
- ✅ Crear nuevas empresas clientes
- ✅ Solicitar auditorías para sus empresas
- ✅ Ver sus comisiones (pendientes y pagadas)
- ❌ No puede ver empresas de otros colaboradores
- ❌ No puede modificar porcentajes de comisión

### **EMPRESA**

- ✅ Ver solo SU información (where: userId = currentUser.id)
- ✅ Solicitar auditorías para sí misma
- ✅ Ver estado de sus auditorías
- ✅ Subir documentación
- ❌ No puede ver otras empresas
- ❌ No puede ver información de colaboradores

---

## 📊 CONSULTAS SQL COMUNES

### 1. **Listar empresas de un colaborador**

```sql
SELECT * FROM empresas
WHERE colaboradorId = 'colaborador_id'
ORDER BY createdAt DESC;
```

### 2. **Calcular comisiones pendientes de un colaborador**

```sql
SELECT
  c.id,
  c.companyName as colaborador,
  SUM(com.montoComision) as total_pendiente
FROM colaboradores c
LEFT JOIN comisiones com ON c.id = com.colaboradorId
WHERE c.id = 'colaborador_id'
  AND com.status = 'PENDIENTE'
GROUP BY c.id, c.companyName;
```

### 3. **Dashboard Admin: Estadísticas generales**

```sql
SELECT
  (SELECT COUNT(*) FROM colaboradores WHERE status = 'ACTIVE') as colaboradores_activos,
  (SELECT COUNT(*) FROM empresas) as total_empresas,
  (SELECT COUNT(*) FROM auditorias WHERE status = 'EN_PROCESO') as auditorias_activas,
  (SELECT SUM(montoComision) FROM comisiones WHERE status = 'PENDIENTE') as comisiones_pendientes;
```

### 4. **Auditorías pendientes de presupuestar**

```sql
SELECT
  a.*,
  e.companyName as empresa,
  c.companyName as colaborador
FROM auditorias a
JOIN empresas e ON a.empresaId = e.id
LEFT JOIN colaboradores c ON a.colaboradorId = c.id
WHERE a.status = 'SOLICITADA' OR a.status = 'EN_REVISION'
ORDER BY a.urgente DESC, a.createdAt ASC;
```

### 5. **Empresas que llegaron directamente (sin colaborador)**

```sql
SELECT * FROM empresas
WHERE origen = 'DIRECTA'
ORDER BY createdAt DESC;
```

---

## 🔐 ROW LEVEL SECURITY (RLS) - SUPABASE

### Políticas Recomendadas

#### **Tabla: empresas**

```sql
-- Colaboradores solo ven sus empresas
CREATE POLICY "Colaboradores ven sus empresas"
ON empresas FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'ADMIN' OR
  colaboradorId = (SELECT id FROM colaboradores WHERE userId = auth.uid())
);

-- Empresas solo ven su propia información
CREATE POLICY "Empresas ven su info"
ON empresas FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'ADMIN' OR
  userId = auth.uid()
);
```

#### **Tabla: auditorias**

```sql
-- Colaboradores solo ven auditorías de sus empresas
CREATE POLICY "Colaboradores ven sus auditorías"
ON auditorias FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'ADMIN' OR
  colaboradorId = (SELECT id FROM colaboradores WHERE userId = auth.uid()) OR
  empresaId IN (SELECT id FROM empresas WHERE userId = auth.uid())
);
```

#### **Tabla: comisiones**

```sql
-- Solo admin y el colaborador dueño pueden ver comisiones
CREATE POLICY "Ver comisiones propias"
ON comisiones FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'ADMIN' OR
  colaboradorId = (SELECT id FROM colaboradores WHERE userId = auth.uid())
);

-- Solo admin puede modificar comisiones
CREATE POLICY "Admin modifica comisiones"
ON comisiones FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'ADMIN');
```

---

## 📦 ÍNDICES OPTIMIZADOS

Ya incluidos en el schema, pero destacamos los más críticos:

```prisma
// Búsquedas frecuentes por colaborador
@@index([colaboradorId])

// Filtros por estado
@@index([status])

// Búsquedas por origen de empresa
@@index([origen])

// Ordenamiento por fechas
@@index([fechaSolicitud])
@@index([createdAt])

// Búsquedas por CIF (único y frecuente)
@@index([cif])
```

---

## 🚀 PLAN DE MIGRACIÓN

### **Fase 1: Preparación (1-2 días)**

1. ✅ Revisar y aprobar nuevo schema
2. ✅ Crear backup completo de la BD actual
3. ✅ Documentar mapeo de datos antiguos → nuevos

### **Fase 2: Migración de Datos (2-3 días)**

1. Crear script de migración SQL:
   - `Partner` → `Colaborador`
   - `Client` → `Empresa` (añadir campo `origen`)
   - `Budget` → `Auditoria`
2. Migrar relaciones y foreign keys
3. Generar comisiones históricas desde auditorías completadas

### **Fase 3: Actualización de Código (3-5 días)**

1. Actualizar validators (Zod schemas)
2. Actualizar servicios (auth, empresas, auditorías)
3. Actualizar componentes de UI (formularios de registro)
4. Actualizar API routes

### **Fase 4: Testing (2-3 días)**

1. Tests de integración
2. Tests de permisos (RLS)
3. Tests de flujos completos

### **Fase 5: Deploy (1 día)**

1. Deploy a staging
2. Validación final
3. Deploy a producción

**Total estimado: 9-14 días**

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### **Soft Deletes vs Hard Deletes**

**Recomendación**: Usar **soft deletes** para:

- `Colaborador` (añadir campo `deletedAt`)
- `Empresa` (añadir campo `deletedAt`)
- `Auditoria` (añadir campo `deletedAt`)

**Razón**: Mantener integridad de comisiones históricas y auditoría del sistema.

### **Escalabilidad**

- ✅ Índices en todas las foreign keys
- ✅ Paginación en queries de listados
- ✅ Uso de `@db.Decimal` para precisión en montos
- ✅ Campos `Json` para metadata flexible

### **Integridad Referencial**

- `onDelete: Cascade` en relaciones 1-a-muchos críticas
- `onDelete: SetNull` en relaciones opcionales (ej: colaborador eliminado)

---

## 📝 PRÓXIMOS PASOS

1. **Revisar y aprobar este schema**
2. **Decidir si proceder con migración completa o incremental**
3. **Actualizar formulario de registro** (siguiente tarea)
4. **Crear scripts de migración de datos**

---

## 🤝 VENTAJAS DEL NUEVO SCHEMA

✅ **Claridad conceptual**: Nombres que reflejan el negocio real
✅ **Tracking completo**: Origen de empresas, comisiones, auditorías
✅ **Escalabilidad**: Preparado para crecimiento
✅ **Seguridad**: RLS nativo de Supabase
✅ **Flexibilidad**: Configuración centralizada
✅ **Auditoría**: Logs completos de todas las acciones

---

**Autor**: Antigravity AI
**Fecha**: 2026-01-22
**Versión**: 1.0
