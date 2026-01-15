# 🗄️ Diagrama de Base de Datos - MindAudit

## 📊 Visión General

Este documento describe el esquema completo de la base de datos de MindAudit Spain, implementado con Prisma y Supabase PostgreSQL.

---

## 🎭 Módulo de Autenticación y Usuarios

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ email           String (UNIQUE)                             │
│ name            String                                      │
│ role            UserRole (PARTNER|AUDITOR|ADMIN)           │
│ status          UserStatus                                  │
│ hashedPassword  String?                                     │
│ emailVerified   DateTime?                                   │
│ image           String?                                     │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
│ lastLoginAt     DateTime?                                   │
└─────────────────────────────────────────────────────────────┘
           │                           │
           │                           │
           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│      PARTNERS        │    │      AUDITORS        │
├──────────────────────┤    ├──────────────────────┤
│ id          String   │    │ id          String   │
│ userId      String   │    │ userId      String   │
│ companyName String   │    │ specialization       │
│ cif         String   │    │ certifications []    │
│ address     String?  │    │ createdAt            │
│ city        String?  │    │ updatedAt            │
│ province    String?  │    └──────────────────────┘
│ postalCode  String?  │
│ phone       String?  │
│ website     String?  │
│ status      Status   │
│ rating      Float?   │
│ totalCommissions     │
│ contractUrl String?  │
│ contractSignedAt     │
│ createdAt            │
│ updatedAt            │
└──────────────────────┘
```

---

## 👥 Módulo de Clientes

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ partnerId       String (FK → partners.id)                   │
│ companyName     String                                      │
│ cif             String                                      │
│ contactName     String                                      │
│ contactEmail    String                                      │
│ contactPhone    String?                                     │
│ address         String?                                     │
│ city            String?                                     │
│ province        String?                                     │
│ postalCode      String?                                     │
│ fiscalYears     Int[]                                       │
│ employees       Int?                                        │
│ revenue         Decimal?                                    │
│ status          ClientStatus                                │
│ notes           String?                                     │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ 1:N
                          ▼
```

---

## 💰 Módulo de Presupuestos

```
┌─────────────────────────────────────────────────────────────┐
│                        BUDGETS                              │
├─────────────────────────────────────────────────────────────┤
│ id                String (PK)                               │
│ clientId          String (FK → clients.id)                  │
│ partnerId         String (FK → partners.id)                 │
│ serviceType       ServiceType                               │
│ fiscalYears       Int[]                                     │
│ description       String?                                   │
│ specialRequests   String?                                   │
│ urgency           Boolean                                   │
│ status            BudgetStatus                              │
│ amount            Decimal?                                  │
│ responseNotes     String?                                   │
│ validUntil        DateTime?                                 │
│ commissionRate    Decimal?                                  │
│ commissionAmount  Decimal?                                  │
│ respondedAt       DateTime?                                 │
│ approvedAt        DateTime?                                 │
│ createdAt         DateTime                                  │
│ updatedAt         DateTime                                  │
└─────────────────────────────────────────────────────────────┘
```

**Estados del Presupuesto:**

- `PENDING` → Pendiente de respuesta
- `IN_REVIEW` → En revisión por auditor
- `APPROVED` → Aprobado
- `REJECTED` → Rechazado
- `EXPIRED` → Expirado

**Tipos de Servicio (17 tipos):**

- AUDIT_ACCOUNTS, AUDIT_CONSOLIDATED, AUDIT_VOLUNTARY
- AUDIT_SUBSIDIES, REVIEW_ACCOUNTS, AGREED_PROCEDURES
- DUE_DILIGENCE, FORENSIC_AUDIT, IT_AUDIT
- INTERNAL_AUDIT, COMPLIANCE_AUDIT, SUSTAINABILITY_AUDIT
- QUALITY_AUDIT, RISK_ASSESSMENT, INTERNAL_CONTROL
- FRAUD_PREVENTION, OTHER

---

## 💬 Módulo de Consultas

```
┌─────────────────────────────────────────────────────────────┐
│                     CONSULTATIONS                           │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ partnerId       String (FK → partners.id)                   │
│ subject         String                                      │
│ status          ConsultationStatus                          │
│ priority        Int (1-5)                                   │
│ resolvedAt      DateTime?                                   │
│ closedAt        DateTime?                                   │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 CONSULTATION_MESSAGES                       │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ consultationId  String (FK → consultations.id)              │
│ senderId        String (User ID)                            │
│ senderRole      UserRole                                    │
│ message         String                                      │
│ attachments     String[]                                    │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
```

**Estados de Consulta:**

- `OPEN` → Abierta
- `IN_PROGRESS` → En progreso
- `WAITING_PARTNER` → Esperando respuesta del partner
- `WAITING_AUDITOR` → Esperando respuesta del auditor
- `RESOLVED` → Resuelta
- `CLOSED` → Cerrada

---

## 📅 Módulo de Reuniones

```
┌─────────────────────────────────────────────────────────────┐
│                        MEETINGS                             │
├─────────────────────────────────────────────────────────────┤
│ id                String (PK)                               │
│ partnerId         String (FK → partners.id)                 │
│ auditorId         String? (FK → auditors.id)                │
│ title             String                                    │
│ description       String?                                   │
│ scheduledAt       DateTime                                  │
│ duration          Int (minutos)                             │
│ location          String?                                   │
│ calendlyEventUrl  String?                                   │
│ calendlyEventId   String?                                   │
│ status            MeetingStatus                             │
│ notes             String?                                   │
│ createdAt         DateTime                                  │
│ updatedAt         DateTime                                  │
│ completedAt       DateTime?                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 💵 Módulo de Facturas

```
┌─────────────────────────────────────────────────────────────┐
│                        INVOICES                             │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ partnerId       String (FK → partners.id)                   │
│ invoiceNumber   String (UNIQUE)                             │
│ amount          Decimal                                     │
│ concept         String                                      │
│ description     String?                                     │
│ pdfUrl          String?                                     │
│ status          InvoiceStatus                               │
│ issuedAt        DateTime?                                   │
│ dueAt           DateTime?                                   │
│ paidAt          DateTime?                                   │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📰 Módulo de Noticias

```
┌─────────────────────────────────────────────────────────────┐
│                          NEWS                               │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ authorId        String (FK → auditors.id)                   │
│ title           String                                      │
│ slug            String (UNIQUE)                             │
│ content         String                                      │
│ excerpt         String?                                     │
│ coverImage      String?                                     │
│ category        String?                                     │
│ tags            String[]                                    │
│ status          NewsStatus                                  │
│ featured        Boolean                                     │
│ metaTitle       String?                                     │
│ metaDescription String?                                     │
│ publishedAt     DateTime?                                   │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📎 Módulo de Documentos

```
┌─────────────────────────────────────────────────────────────┐
│                       DOCUMENTS                             │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ uploadedBy      String (User ID)                            │
│ fileName        String                                      │
│ fileUrl         String                                      │
│ fileType        String (MIME type)                          │
│ fileSize        Int (bytes)                                 │
│ documentType    DocumentType                                │
│ partnerId       String? (FK → partners.id)                  │
│ clientId        String? (FK → clients.id)                   │
│ budgetId        String? (FK → budgets.id)                   │
│ consultationId  String? (FK → consultations.id)             │
│ description     String?                                     │
│ tags            String[]                                    │
│ createdAt       DateTime                                    │
│ updatedAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
```

**Tipos de Documento:**

- `CONTRACT` → Contratos
- `INVOICE` → Facturas
- `BUDGET` → Presupuestos
- `CONSULTATION` → Consultas
- `CLIENT` → Documentos de cliente
- `OTHER` → Otros

---

## 🔍 Módulo de Auditoría

```
┌─────────────────────────────────────────────────────────────┐
│                      AUDIT_LOGS                             │
├─────────────────────────────────────────────────────────────┤
│ id              String (PK)                                 │
│ userId          String                                      │
│ userRole        UserRole                                    │
│ action          AuditAction                                 │
│ entity          String                                      │
│ entityId        String?                                     │
│ description     String?                                     │
│ metadata        Json?                                       │
│ ipAddress       String?                                     │
│ userAgent       String?                                     │
│ createdAt       DateTime                                    │
└─────────────────────────────────────────────────────────────┘
```

**Acciones de Auditoría:**

- `CREATE`, `UPDATE`, `DELETE`
- `LOGIN`, `LOGOUT`
- `APPROVE`, `REJECT`
- `SEND`, `DOWNLOAD`

---

## 🔗 Diagrama de Relaciones

```
                    ┌──────────┐
                    │  USERS   │
                    └────┬─────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
    ┌──────────┐              ┌──────────────┐
    │ PARTNERS │              │   AUDITORS   │
    └────┬─────┘              └──────┬───────┘
         │                           │
         │                           │
         ├─────────┐                 ├──────────┐
         │         │                 │          │
         ▼         ▼                 ▼          ▼
    ┌─────────┐ ┌──────────────┐ ┌─────────┐ ┌──────┐
    │ CLIENTS │ │ CONSULTATIONS│ │ MEETINGS│ │ NEWS │
    └────┬────┘ └──────┬───────┘ └─────────┘ └──────┘
         │             │
         │             ▼
         │      ┌──────────────────────┐
         │      │ CONSULTATION_MESSAGES│
         │      └──────────────────────┘
         │
         ├──────────┬──────────┐
         │          │          │
         ▼          ▼          ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │ BUDGETS │ │DOCUMENTS│ │ INVOICES │
    └─────────┘ └─────────┘ └──────────┘
```

---

## 📊 Estadísticas del Schema

| Categoría          | Cantidad |
| ------------------ | -------- |
| **Tablas**         | 12       |
| **Enums**          | 10       |
| **Relaciones 1:N** | 15+      |
| **Índices**        | 30+      |
| **Campos únicos**  | 6        |

---

## 🔐 Índices para Optimización

### Índices principales:

**Users:**

- `email` (único)
- `role`
- `status`

**Partners:**

- `userId` (único)
- `cif` (único)
- `status`

**Clients:**

- `partnerId`
- `cif`
- `status`

**Budgets:**

- `clientId`
- `partnerId`
- `status`
- `serviceType`

**Consultations:**

- `partnerId`
- `status`

**Documents:**

- `uploadedBy`
- `documentType`
- `partnerId`, `clientId`, `budgetId`, `consultationId`

---

## 🎯 Características Clave

### ✅ Seguridad

- Hashing de contraseñas con bcrypt
- Relaciones con `onDelete: Cascade` para integridad referencial
- Audit logs para trazabilidad

### ✅ Flexibilidad

- Campos opcionales para adaptarse a diferentes casos
- Arrays para datos múltiples (fiscalYears, tags, etc.)
- JSON para metadata flexible

### ✅ Performance

- Índices en campos frecuentemente consultados
- Connection pooling con Supabase
- Tipos de datos optimizados (Decimal para dinero)

### ✅ Escalabilidad

- Estructura modular
- Relaciones bien definidas
- Preparado para Row Level Security (RLS)

---

## 📚 Recursos

- **Schema completo**: `prisma/schema.prisma`
- **Migraciones**: `prisma/migrations/`
- **Seed de datos**: `prisma/seed.ts`
- **Guía de Supabase**: `docs/SUPABASE_SETUP.md`

---

**Última actualización:** 2026-01-15
