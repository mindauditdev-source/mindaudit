# 📘 Types

Esta carpeta contiene todas las definiciones de tipos e interfaces TypeScript del proyecto.

## Propósito

Centralizar todas las definiciones de tipos para:

- ✅ Type safety en todo el proyecto
- ✅ Autocompletado en el IDE
- ✅ Documentación implícita
- ✅ Refactoring seguro
- ✅ Detección temprana de errores

## Archivos de Tipos

### `index.ts`

Exportaciones centralizadas de todos los tipos.

```typescript
export * from "./auth";
export * from "./user";
export * from "./partner";
// ...
```

### `auth.ts`

Tipos relacionados con autenticación.

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

export type AuthRole = "PARTNER" | "AUDITOR" | "ADMIN";
```

### `user.ts`

Tipos base de usuario.

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  phone?: string;
  avatar?: string;
}
```

### `partner.ts`

Tipos específicos del partner.

```typescript
export interface Partner {
  id: string;
  userId: string;
  user: User;
  companyName: string;
  cif: string;
  address: string;
  phone: string;
  status: PartnerStatus;
  contractUrl?: string;
  rating?: number;
  totalCommissions: number;
  createdAt: Date;
}

export type PartnerStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface CreatePartnerDTO {
  companyName: string;
  cif: string;
  address: string;
  phone: string;
  contactName: string;
  contactEmail: string;
}
```

### `auditor.ts`

Tipos específicos del auditor.

```typescript
export interface Auditor {
  id: string;
  userId: string;
  user: User;
  specialization: string[];
  certifications: string[];
  createdAt: Date;
}
```

### `client.ts`

Tipos de clientes aportados.

```typescript
export interface Client {
  id: string;
  partnerId: string;
  partner: Partner;
  companyName: string;
  cif: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  fiscalYears: number[];
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientStatus = "ACTIVE" | "INACTIVE" | "AUDITED";

export interface CreateClientDTO {
  companyName: string;
  cif: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  fiscalYears: number[];
}
```

### `budget.ts`

Tipos de presupuestos.

```typescript
export interface Budget {
  id: string;
  clientId: string;
  client: Client;
  partnerId: string;
  partner: Partner;
  serviceType: ServiceType;
  fiscalYears: number[];
  specialRequests?: string;
  status: BudgetStatus;
  amount?: number;
  responseNotes?: string;
  respondedAt?: Date;
  createdAt: Date;
}

export type BudgetStatus =
  | "PENDING"
  | "REVIEWED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type ServiceType =
  | "FINANCIAL_AUDIT"
  | "GRANT_AUDIT"
  | "ECOEMBES_AUDIT"
  | "DUE_DILIGENCE"
  | "OTHER";

export interface CreateBudgetDTO {
  clientId: string;
  serviceType: ServiceType;
  fiscalYears: number[];
  specialRequests?: string;
}

export interface BudgetResponseDTO {
  amount: number;
  responseNotes: string;
  status: "APPROVED" | "REJECTED";
}
```

### `consultation.ts`

Tipos de consultas.

```typescript
export interface Consultation {
  id: string;
  partnerId: string;
  partner: Partner;
  subject: string;
  status: ConsultationStatus;
  messages: ConsultationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export type ConsultationStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ConsultationMessage {
  id: string;
  consultationId: string;
  senderId: string;
  sender: User;
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface CreateConsultationDTO {
  subject: string;
  message: string;
  attachments?: File[];
}
```

### `meeting.ts`

Tipos de reuniones.

```typescript
export interface Meeting {
  id: string;
  partnerId: string;
  partner: Partner;
  auditorId?: string;
  auditor?: Auditor;
  scheduledAt: Date;
  calendlyEventUrl: string;
  status: MeetingStatus;
  notes?: string;
  createdAt: Date;
}

export type MeetingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
```

### `invoice.ts`

Tipos de facturas.

```typescript
export interface Invoice {
  id: string;
  partnerId: string;
  partner: Partner;
  amount: number;
  concept: string;
  pdfUrl: string;
  status: InvoiceStatus;
  issuedAt: Date;
  paidAt?: Date;
}

export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
```

### `contract.ts`

Tipos de contratos.

```typescript
export interface Contract {
  id: string;
  partnerId: string;
  partner: Partner;
  pdfUrl: string;
  signedAt?: Date;
  expiresAt?: Date;
  status: ContractStatus;
  createdAt: Date;
}

export type ContractStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED";
```

### `news.ts`

Tipos de noticias.

```typescript
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt: Date;
  authorId: string;
  author: User;
  tags: string[];
}

export interface CreateNewsDTO {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
}
```

### `api.ts`

Tipos para respuestas de API.

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}
```

## Convenciones

1. **Naming**:

   - Interfaces: `PascalCase` (e.g., `User`, `Partner`)
   - Types: `PascalCase` (e.g., `AuthRole`, `BudgetStatus`)
   - DTOs: Sufijo `DTO` (e.g., `CreatePartnerDTO`)

2. **Organización**:

   - Un archivo por entidad principal
   - Tipos relacionados en el mismo archivo
   - Re-exportar desde `index.ts`

3. **DTOs (Data Transfer Objects)**:

   - Para datos de entrada (formularios, requests)
   - Validados con Zod en runtime

4. **Enums vs Union Types**:
   - Preferir union types para mejor type safety
   - Usar `as const` cuando sea apropiado

## Uso

```typescript
// Importar tipos específicos
import { Partner, CreatePartnerDTO } from "@/types/partner";

// O importar desde index
import type { Partner, Budget, User } from "@/types";

// Uso en componentes
interface PartnerFormProps {
  partner?: Partner;
  onSubmit: (data: CreatePartnerDTO) => void;
}

// Uso en servicios
async function createPartner(data: CreatePartnerDTO): Promise<Partner> {
  // ...
}
```

## Sincronización con Prisma

Los tipos deben estar sincronizados con el schema de Prisma:

```typescript
// Opción 1: Usar tipos generados por Prisma
import { Partner as PrismaPartner } from "@prisma/client";

// Opción 2: Extender tipos de Prisma
import { Partner as PrismaPartner } from "@prisma/client";

export interface Partner extends PrismaPartner {
  // Campos adicionales calculados
  fullName: string;
}
```
