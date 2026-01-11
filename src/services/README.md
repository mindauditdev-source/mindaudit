# 🛠️ Servicios

Esta carpeta contiene la lógica de negocio del proyecto, separada de los componentes React.

## Propósito

Los servicios encapsulan:

- Lógica de negocio compleja
- Llamadas a APIs
- Transformación de datos
- Operaciones reutilizables

## Servicios Disponibles

### `auth.service.ts`

Gestión de autenticación y sesiones.

- Login con email/password
- Magic links
- Verificación de email
- Gestión de sesiones
- Logout

### `partner.service.ts`

Operaciones relacionadas con partners.

- CRUD de partners
- Actualización de perfil
- Gestión de estado
- Cálculo de comisiones

### `auditor.service.ts`

Operaciones relacionadas con auditores.

- CRUD de auditores
- Asignación de partners
- Gestión de especialidades

### `client.service.ts`

Gestión de clientes aportados por partners.

- CRUD de clientes
- Validación de CIF
- Historial de auditorías

### `budget.service.ts`

Gestión de presupuestos.

- Creación de solicitudes
- Respuestas de auditores
- Cálculo de precios
- Estados del presupuesto

### `consultation.service.ts`

Sistema de consultas entre partners y auditores.

- Creación de consultas
- Respuestas
- Adjuntos
- Notificaciones

### `meeting.service.ts`

Gestión de reuniones.

- Integración con Calendly
- Agendamiento
- Recordatorios

### `invoice.service.ts`

Gestión de facturación.

- Generación de facturas
- Cálculo de comisiones
- Historial de pagos

### `contract.service.ts`

Gestión de contratos.

- Generación de contratos
- Almacenamiento
- Firma digital (futuro)

### `news.service.ts`

Gestión de noticias y comunicados.

- Publicación de noticias
- Comunicados masivos
- Notificaciones

### `email.service.ts`

Envío de emails transaccionales.

- Templates de email
- Envío mediante Resend/Nodemailer
- Tracking de emails

### `storage.service.ts`

Gestión de archivos.

- Upload a S3/Cloudinary
- Descarga de archivos
- Gestión de URLs firmadas

### `notification.service.ts`

Sistema de notificaciones.

- Notificaciones en app
- Emails
- Push notifications (futuro)

## Patrón de Uso

```typescript
// Ejemplo: budget.service.ts
import { prisma } from "@/lib/db/prisma";
import { Budget, BudgetStatus } from "@/types/budget";

export class BudgetService {
  async createBudgetRequest(data: CreateBudgetDTO): Promise<Budget> {
    // Validación
    // Lógica de negocio
    // Persistencia en DB
    // Notificaciones
    return budget;
  }

  async respondToBudget(
    budgetId: string,
    response: BudgetResponseDTO
  ): Promise<Budget> {
    // Lógica de respuesta
    return updatedBudget;
  }

  async calculateCommission(budget: Budget): Promise<number> {
    // Cálculo de comisión
    return commission;
  }
}

export const budgetService = new BudgetService();
```

## Uso en Componentes

```tsx
// En un componente
import { budgetService } from "@/services/budget.service";

export function BudgetForm() {
  const handleSubmit = async (data) => {
    try {
      const budget = await budgetService.createBudgetRequest(data);
      // Éxito
    } catch (error) {
      // Error
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Uso en API Routes

```typescript
// En app/api/budgets/route.ts
import { budgetService } from "@/services/budget.service";

export async function POST(req: Request) {
  const data = await req.json();
  const budget = await budgetService.createBudgetRequest(data);
  return Response.json(budget);
}
```

## Convenciones

1. **Naming**: `*.service.ts`
2. **Exports**: Instancia singleton exportada
3. **Error Handling**: Throw custom errors
4. **Async**: Todas las operaciones son async
5. **Types**: Importar desde `/types`
6. **DB**: Usar Prisma client desde `/lib/db`

## Ventajas

✅ **Reutilización**: Misma lógica en cliente y servidor
✅ **Testeable**: Fácil de hacer unit tests
✅ **Mantenible**: Lógica centralizada
✅ **Escalable**: Fácil de extender
✅ **Type-safe**: TypeScript completo
