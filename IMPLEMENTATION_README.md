# IMA Incident Manager - Documentación de Implementación

## 📋 Descripción del Proyecto

**IMA Incident Manager** es una Single Page Application (SPA) para gestionar incidentes de servicios de telecomunicaciones. La aplicación permite autenticarse, visualizar dashboards con gráficos, gestionar incidentes y visualizar el flujo de estados.

---

## 🛠️ Stack Tecnológico

| Categoría           | Tecnología                 | Justificación                               |
| ------------------- | -------------------------- | ------------------------------------------- |
| **Framework**       | React 19 + TypeScript      | Última versión estable con tipado estático  |
| **Build Tool**      | Vite                       | Build rápido con HMR instantáneo            |
| **Routing**         | React Router DOM v7        | Routing declarativo con protección de rutas |
| **Estado Servidor** | TanStack Query             | Cache automático, refetching, mutations     |
| **Estado Cliente**  | Zustand                    | Estado global ligero con persistencia       |
| **Estilos**         | TailwindCSS                | Utility-first CSS con diseño consistente    |
| **Formularios**     | React Hook Form + Zod      | Validaciones performantes con schema        |
| **HTTP Client**     | Axios                      | Interceptores para auth y manejo de errores |
| **Gráficos**        | Chart.js + react-chartjs-2 | Visualizaciones interactivas                |
| **Code Quality**    | ESLint, Prettier, Husky    | Calidad y consistencia de código            |

---

## 🏗️ Arquitectura y Patrones de Diseño

### Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI genéricos (Button, Input, Modal...)
│   ├── layout/         # Layout components (Header, MainLayout)
│   ├── incidents/      # Componentes específicos de incidentes
│   ├── charts/         # Componentes de gráficos
│   └── workflow/       # Grafo de estados
├── hooks/              # Custom hooks (React Query wrappers)
├── lib/                # Utilidades y configuración
├── pages/              # Páginas/Vistas principales
├── providers/          # Context providers
├── router/             # Configuración de rutas
├── services/           # Capa de servicios (API calls)
├── store/              # Estado global (Zustand)
└── types/              # TypeScript types e interfaces
```

### Patrones Implementados

#### 1. **Repository Pattern** (Services Layer)

```typescript
// services/incident.service.ts
export const incidentService = {
  async getAll(filters?: IncidentFilters): Promise<Incident[]> {
    const { data } = await apiClient.get<Incident[]>('/api/incidentes');
    return data;
  },
  // ...más métodos
};
```

**Por qué**: Abstrae la lógica de acceso a datos, facilita testing y cambios en la API.

#### 2. **Custom Hooks Pattern**

```typescript
// hooks/useIncidents.ts
export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentService.getAll(filters),
  });
}
```

**Por qué**: Encapsula lógica de fetching con React Query, reutilizable en múltiples componentes.

#### 3. **Compound Components** (UI Components)

```typescript
// Componentes UI reutilizables con API consistente
<Button variant="primary" size="md" isLoading={loading}>
  Guardar
</Button>
```

**Por qué**: Componentes flexibles con props bien definidas para consistencia visual.

#### 4. **Store Pattern** (Zustand)

```typescript
// store/filters.store.ts
export const useFiltersStore = create<FiltersStore>()(
  persist(
    set => ({
      estado: '',
      canal: '',
      setEstado: estado => set({ estado }),
      // ...
    }),
    { name: 'ima-filters-storage' }
  )
);
```

**Por qué**: Estado global con persistencia automática en localStorage.

#### 5. **Protected Routes Pattern**

```typescript
// components/layout/ProtectedRoute.tsx
export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
```

**Por qué**: Protección de rutas centralizada y declarativa.

---

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login**: Usuario envía credenciales a `/api/auth/login`
2. **Token Storage**: Token JWT se almacena en cookies HttpOnly-like (js-cookie)
3. **User Storage**: Datos del usuario se guardan en localStorage + Zustand
4. **Interceptor**: Axios añade `Authorization: Bearer <token>` automáticamente
5. **Protección**: `ProtectedRoute` verifica autenticación antes de renderizar

### Implementación

```typescript
// lib/api-client.ts
apiClient.interceptors.request.use(config => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Cookies.remove(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Credenciales de Prueba

```
Usuario: admin
Contraseña: password123
```

---

## 📊 Grafo de Estados (Workflow)

### Estados del Incidente

| Estado              | Descripción                        |
| ------------------- | ---------------------------------- |
| NUEVO               | Incidente recién creado            |
| EN_ANALISIS         | En proceso de análisis             |
| ASIGNADO            | Asignado a un técnico              |
| EN_CURSO            | Trabajo en progreso                |
| ESPERANDO_CLIENTE   | Pendiente de respuesta del cliente |
| ESPERANDO_PROVEEDOR | Pendiente de proveedor externo     |
| RESUELTO            | Problema solucionado               |
| CERRADO             | Caso cerrado definitivamente       |
| CANCELADO           | Incidente cancelado                |

### Transiciones Válidas

```
NUEVO → EN_ANALISIS, CANCELADO
EN_ANALISIS → ASIGNADO, CANCELADO
ASIGNADO → EN_CURSO, CANCELADO
EN_CURSO → ESPERANDO_CLIENTE, ESPERANDO_PROVEEDOR, RESUELTO, CANCELADO
ESPERANDO_CLIENTE → EN_CURSO
ESPERANDO_PROVEEDOR → EN_CURSO
RESUELTO → CERRADO
```

### Implementación del Grafo

El grafo se implementa usando **Canvas API** nativo de HTML5:

```typescript
// components/workflow/StateGraph.tsx
- Renderizado con Canvas 2D
- Nodos posicionados estratégicamente
- Flechas direccionales entre estados
- Estado actual resaltado en azul
- Transiciones válidas en verde (clickeables)
- Click en nodo verde = cambio de estado
```

**Por qué Canvas en lugar de Draw2D**:

- Zero dependencies adicionales
- Control total sobre el renderizado
- Mejor performance
- Más fácil de mantener

---

## 🚀 Instrucciones de Instalación

### Requisitos Previos

- Node.js >= 18
- npm >= 9

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd ima-incident-manager

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Scripts Disponibles

| Script             | Descripción              |
| ------------------ | ------------------------ |
| `npm run dev`      | Servidor de desarrollo   |
| `npm run build`    | Build de producción      |
| `npm run preview`  | Preview del build        |
| `npm run lint`     | Ejecutar ESLint          |
| `npm run lint:fix` | Fix automático de ESLint |
| `npm run format`   | Formatear con Prettier   |

---

## 📁 Decisiones de Diseño

### 1. TanStack Query vs Redux

**Elegido**: TanStack Query
**Razón**: Maneja el estado del servidor (datos de API) de forma óptima con:

- Cache automático
- Background refetching
- Deduplicación de requests
- Optimistic updates
- Retry automático

### 2. Zustand vs Context API

**Elegido**: Zustand
**Razón**:

- API más simple que Redux
- Persistencia integrada
- No necesita providers anidados
- Mejor performance (suscripciones granulares)

### 3. React Hook Form vs Formik

**Elegido**: React Hook Form + Zod
**Razón**:

- Menos re-renders
- Validación con schema (Zod)
- API más moderna y TypeScript-friendly

### 4. Canvas vs Draw2D para el grafo

**Elegido**: Canvas API nativo
**Razón**:

- Sin dependencias externas pesadas
- Control total del renderizado
- Mejor integración con React
- Más fácil de personalizar

---

## 🔄 Flujo de Datos

```
[Usuario] → [Componente] → [Custom Hook] → [Service] → [API]
                ↓
           [TanStack Query Cache]
                ↓
           [Re-render con datos]
```

### Ejemplo: Listar Incidentes

1. `DashboardPage` llama a `useIncidents(filters)`
2. `useIncidents` usa `useQuery` de TanStack Query
3. `incidentService.getAll()` hace el request con Axios
4. Respuesta se cachea automáticamente
5. Componente recibe `{ data, isLoading, error }`

---

## 🎨 Diseño UI/UX

### Paleta de Colores

- **Primary (IMA Blue)**: `#1a4b8c`
- **Primary Dark**: `#0f3460`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Danger**: `#ef4444`

### Componentes UI

Todos los componentes UI siguen el patrón:

- Props tipadas con TypeScript
- Variantes (primary, secondary, danger)
- Tamaños (sm, md, lg)
- Estados (loading, disabled)
- Composición con `cn()` (clsx + tailwind-merge)

---

## 📝 Convenciones de Código

### Commits (Conventional Commits)

```
feat: add new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

### Naming Conventions

- **Componentes**: PascalCase (`IncidentTable.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useIncidents.ts`)
- **Services**: camelCase con sufijo `.service` (`incident.service.ts`)
- **Types**: PascalCase (`Incident`, `EstadoIncidente`)
- **Constants**: SCREAMING_SNAKE_CASE (`ESTADO_LABELS`)

---

## 🔗 API Endpoints

| Método | Endpoint                     | Descripción          |
| ------ | ---------------------------- | -------------------- |
| POST   | `/api/auth/login`            | Autenticación        |
| GET    | `/api/incidentes`            | Listar incidentes    |
| GET    | `/api/incidentes/:id`        | Obtener incidente    |
| POST   | `/api/incidentes`            | Crear incidente      |
| PATCH  | `/api/incidentes/:id`        | Actualizar incidente |
| PATCH  | `/api/incidentes/:id/estado` | Cambiar estado       |
| GET    | `/api/dashboard/stats`       | Estadísticas         |

**Base URL**: `https://kinetix-ima-backend.onrender.com`

---

## 🧪 Testing (Opcional)

La estructura está preparada para agregar tests con:

- **Vitest** para unit tests
- **React Testing Library** para component tests
- **Playwright** para E2E tests

---

## 📦 Deploy

La aplicación está lista para deploy en:

- **Vercel**: `vercel deploy`
- **Netlify**: Conectar repo y auto-deploy
- **GitHub Pages**: Con configuración de base path

### Build de Producción

```bash
npm run build
# Output en /dist
```

---

## 🤔 Preguntas Frecuentes para Entrevistador

### ¿Por qué elegiste esta arquitectura?

> La arquitectura sigue el principio de **separación de responsabilidades**: Services para API, Hooks para lógica de negocio, Components para UI. Esto facilita testing, mantenimiento y escalabilidad.

### ¿Cómo manejas el estado?

> Uso un enfoque **dual**: TanStack Query para estado del servidor (datos de API con cache) y Zustand para estado del cliente (filtros, UI). Esto evita la complejidad de Redux mientras mantiene el estado organizado.

### ¿Por qué no usaste Redux?

> Para esta aplicación, Redux sería over-engineering. TanStack Query maneja el 90% del estado (datos de API) de forma más eficiente. Zustand cubre el resto con una API más simple.

### ¿Cómo aseguras la calidad del código?

> ESLint + Prettier + TypeScript strict mode + Husky pre-commit hooks + Conventional Commits. Esto garantiza consistencia y detecta errores temprano.

### ¿Cómo escalarías esta aplicación?

> 1. Feature-based folder structure
> 2. Code splitting con React.lazy()
> 3. Internacionalización con react-intl
> 4. Tests automatizados
> 5. CI/CD pipeline

---

## 👨‍💻 Autor

Desarrollado como prueba técnica para demostrar conocimientos en:

- React moderno (hooks, functional components)
- TypeScript
- Arquitectura de aplicaciones frontend
- Patrones de diseño
- Best practices y clean code
