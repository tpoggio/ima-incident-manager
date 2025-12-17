# IMA Incident Manager

Sistema web para gestionar incidentes de servicios de telecomunicaciones (internet, telefonía, MPLS y otros productos).

## 🛠️ Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS v4** - Estilos
- **React Router DOM v7** - Routing
- **TanStack Query** - Estado del servidor
- **Zustand** - Estado global
- **Chart.js** - Gráficos
- **React Hook Form + Zod** - Formularios

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔑 Credenciales de Prueba

```
Usuario: admin
Contraseña: password123
```

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── ui/        # Componentes UI genéricos
│   ├── layout/    # Layout y navegación
│   ├── incidents/ # Componentes de incidentes
│   ├── charts/    # Gráficos Chart.js
│   └── workflow/  # Grafo de estados
├── hooks/         # Custom hooks (React Query)
├── lib/           # Utilidades y API client
├── pages/         # Páginas principales
├── providers/     # Context providers
├── router/        # Configuración de rutas
├── services/      # Capa de servicios (API)
├── store/         # Estado global (Zustand)
└── types/         # TypeScript types
```

## 📚 Documentación Detallada

Ver [IMPLEMENTATION_README.md](./IMPLEMENTATION_README.md) para documentación técnica completa incluyendo:

- Patrones de diseño utilizados
- Flujo de autenticación
- Grafo de estados del workflow
- Decisiones de arquitectura

## 🔗 API

**Base URL:** `https://kinetix-ima-backend.onrender.com`

| Endpoint                           | Descripción       |
| ---------------------------------- | ----------------- |
| `POST /api/auth/login`             | Autenticación     |
| `GET /api/incidentes`              | Listar incidentes |
| `GET /api/incidentes/:id`          | Obtener incidente |
| `POST /api/incidentes`             | Crear incidente   |
| `PATCH /api/incidentes/:id/estado` | Cambiar estado    |
| `GET /api/dashboard/stats`         | Estadísticas      |

## 📝 Scripts

| Script                  | Descripción                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Desarrollo                     |
| `npm run build`         | Producción                     |
| `npm run lint`          | ESLint                         |
| `npm run format`        | Prettier                       |
| `npm run test`          | Tests en modo watch            |
| `npm run test:run`      | Ejecutar tests una vez         |
| `npm run test:coverage` | Tests con reporte de cobertura |

## 🧪 Testing

El proyecto incluye tests unitarios con **Vitest** y **React Testing Library**.

### Ejecutar tests

```bash
# Modo watch (desarrollo)
npm run test

# Ejecutar una vez
npm run test:run

# Con reporte de cobertura
npm run test:coverage
```

### Cobertura de código

El reporte de cobertura se genera en la carpeta `./coverage` con formatos:

- **HTML**: `./coverage/index.html` (abrir en navegador)
- **LCOV**: `./coverage/lcov.info`
- **JSON**: `./coverage/coverage-final.json`

**Umbral mínimo configurado:** 25% statements, 60% branches, 35% functions, 25% lines.

### Tests incluidos

| Módulo          | Descripción                      |
| --------------- | -------------------------------- |
| Auth Store      | Login, logout, estado inicial    |
| Filters Store   | Filtros, clear, setters          |
| Utils           | cn, formatDate, formatShortDate  |
| Button          | Variants, sizes, click, disabled |
| Input           | Label, error, disabled, onChange |
| Modal           | Open/close, backdrop, sizes      |
| IncidentFilters | Render, search text              |
| Incident Types  | Labels, colors, transitions      |
