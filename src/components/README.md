# 📦 Componentes

Esta carpeta contiene todos los componentes React del proyecto, organizados por categoría.

## Estructura

### `/ui` - Componentes UI Primitivos

Componentes base reutilizables (botones, inputs, cards, etc.) basados en shadcn/ui.

- Diseño consistente
- Accesibilidad (ARIA)
- Variantes y tamaños
- Totalmente tipados

**Ejemplos**: `Button`, `Input`, `Card`, `Dialog`, `Select`, `Table`

### `/layout` - Componentes de Layout

Componentes estructurales que definen la disposición de las páginas.

- Header (navegación principal)
- Footer (pie de página)
- Sidebar (navegación lateral)
- DashboardNav (navegación del dashboard)
- MobileNav (navegación móvil)

### `/landing` - Componentes de Landing Page

Componentes específicos para la página de inicio pública.

- Hero (sección principal)
- ServicesSection (servicios destacados)
- StatsSection (estadísticas)
- WhyChooseUs (ventajas)
- CTASection (llamadas a la acción)
- TrustPilotWidget (reseñas)
- LogosCarousel (logos de partners)

### `/auth` - Componentes de Autenticación

Componentes relacionados con login, registro y autenticación.

- LoginForm
- RegisterForm
- MagicLinkForm
- AuthGuard (protección de rutas)

### `/partner` - Componentes del Partner

Componentes específicos para el panel del partner/asociado.

- ClientForm (formulario de clientes)
- ClientList (lista de clientes)
- BudgetRequestForm (solicitud de presupuesto)
- BudgetCard (tarjeta de presupuesto)
- ConsultationForm (formulario de consulta)
- ConsultationThread (hilo de mensajes)
- AccountStatement (estado de cuenta)
- RatingWidget (valoración)
- DocumentUploader (subida de documentos)

### `/auditor` - Componentes del Auditor

Componentes específicos para el panel del auditor.

- PartnerForm (formulario de partners)
- PartnerList (lista de partners)
- BudgetResponseForm (respuesta a presupuesto)
- ConsultationResponse (respuesta a consulta)
- CommunicationForm (comunicados)
- MetricsDashboard (dashboard de métricas)
- StatsCards (tarjetas de estadísticas)

### `/shared` - Componentes Compartidos

Componentes reutilizables entre diferentes módulos.

- FileUpload (subida de archivos)
- DocumentViewer (visor de documentos)
- DatePicker (selector de fecha)
- RichTextEditor (editor de texto enriquecido)
- DataTable (tabla de datos)
- SearchBar (barra de búsqueda)
- Pagination (paginación)
- LoadingSpinner (spinner de carga)
- EmptyState (estado vacío)
- ErrorBoundary (manejo de errores)

### `/forms` - Formularios Específicos

Formularios complejos que combinan múltiples componentes.

- BudgetRequestForm
- ContactForm
- ScheduleCallForm
- ProfileForm

## Convenciones

1. **Naming**: PascalCase para componentes (`MyComponent.tsx`)
2. **Props**: Interfaces tipadas con TypeScript
3. **Exports**: Named exports preferidos
4. **Styling**: Tailwind CSS classes
5. **Accesibilidad**: ARIA labels y roles
6. **Responsividad**: Mobile-first approach

## Ejemplo de Uso

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClientForm } from "@/components/partner/ClientForm";

export function MyPage() {
  return (
    <Card>
      <ClientForm />
      <Button>Guardar</Button>
    </Card>
  );
}
```
