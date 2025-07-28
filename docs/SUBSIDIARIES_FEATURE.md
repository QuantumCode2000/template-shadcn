# Feature: Sucursales (Subsidiaries)

## 📋 Descripción
Implementación completa del CRUD para sucursales, siguiendo el mismo patrón arquitectónico usado en usuarios y empresas.

## 🏗️ Estructura de Archivos

```
src/features/subsidiaries/
├── components/
│   ├── dialogs/
│   │   ├── subsidiary-create-dialog.tsx    # Diálogo para crear sucursal
│   │   ├── subsidiary-edit-dialog.tsx      # Diálogo para editar sucursal
│   │   └── subsidiary-delete-dialog.tsx    # Diálogo para eliminar sucursal
│   ├── subsidiaries-actions.tsx            # Acciones de fila (editar/eliminar)
│   ├── subsidiaries-columns.tsx            # Definición de columnas de tabla
│   └── subsidiaries-dialogs.tsx            # Contenedor de todos los diálogos
├── context/
│   └── use-subsidiaries.ts                 # Hooks de React Query
├── data/
│   └── schema.ts                           # Esquemas Zod y tipos TypeScript
├── lib/
│   └── subsidiaries-service.ts            # Servicios API
└── index.tsx                              # Página principal
```

## 🔌 API Endpoints

### Base URL: `/sucursales`

#### GET `/sucursales`
Obtiene todas las sucursales

**Respuesta:**
```json
{
  "data": [
    {
      "id": 1,
      "empresaId": 1,
      "codigo": 1100,
      "nombre": "Casa Matriz",
      "municipio": "La Paz",
      "direccion": "(AV. COSTANERITA) ENTRE CALLES 5 Y 6...",
      "telefono": 22785566,
      "descripcion": null,
      "codigoSin": 0,
      "activo": true,
      "createdBy": 1,
      "updatedBy": 1,
      "createdAt": "2025-07-28T13:43:01.709Z",
      "updatedAt": "2025-07-28T13:43:01.709Z"
    }
  ],
  "status": "success"
}
```

#### POST `/sucursales`
Crea una nueva sucursal

**Body:**
```json
{
  "empresaId": 2,
  "codigo": 1400,
  "nombre": "Sucursal 2",
  "municipio": "Laja",
  "direccion": "Test direccion",
  "telefono": 234343,
  "codigoSin": 2
}
```

#### PUT `/sucursales/:id`
Actualiza una sucursal existente

#### DELETE `/sucursales/:id`
Elimina una sucursal

## 📊 Modelo de Datos

### Subsidiary Type
```typescript
interface Subsidiary {
  id: number
  empresaId: number
  codigo: number
  nombre: string
  municipio: string
  direccion: string
  telefono: number
  descripcion: string | null
  codigoSin: number
  activo: boolean
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
}
```

### NewSubsidiary Type (Para crear)
```typescript
interface NewSubsidiary {
  empresaId: number
  codigo: number
  nombre: string
  municipio: string
  direccion: string
  telefono: number
  codigoSin: number
}
```

## 🎛️ Funcionalidades

### ✅ Implementadas
- **Listado de sucursales** con tabla ordenable y filtrable
- **Crear sucursal** con validación de formulario
- **Editar sucursal** con precarga de datos
- **Eliminar sucursal** con confirmación
- **Filtros** por estado y municipio
- **Búsqueda** por nombre
- **Selección de empresa** con dropdown dinámico
- **Gestión de estado** con Zustand
- **Cache y sincronización** con React Query
- **Validación** con Zod
- **Ruta autenticada** `/subsidiaries`
- **Navegación** en sidebar

### 🔧 Componentes Principales

#### SubsidiaryCreateDialog
- Formulario completo para crear sucursal
- Validación en tiempo real
- Selección dinámica de empresa
- Layout responsive con grid

#### SubsidiaryEditDialog
- Precarga datos de la sucursal seleccionada
- Misma validación que el create
- Actualización optimista

#### SubsidiaryDeleteDialog
- Confirmación de eliminación
- Muestra nombre de la sucursal a eliminar
- Prevención de eliminación accidental

#### SubsidiariesTable
- Columnas: Código, Nombre, Municipio, Dirección, Teléfono, Código SIN, Estado
- Ordenamiento por cualquier columna
- Filtros por estado y municipio
- Búsqueda por nombre
- Acciones por fila (editar/eliminar)

## 🎨 Características UX/UI

### Layout y Diseño
- **Grid responsive** para formularios
- **Scroll automático** en diálogos largos
- **Estados de carga** en dropdowns
- **Badges de estado** (Activo/Inactivo)
- **Truncado de texto** para direcciones largas
- **Tooltips** para contenido truncado

### Validación
- **Validación en tiempo real** con Zod
- **Mensajes de error** claros y específicos
- **Campos requeridos** marcados visualmente
- **Validación de números** para código, teléfono y código SIN

### Estados
- **Loading states** durante operaciones API
- **Error handling** con mensajes de usuario
- **Optimistic updates** para mejor UX
- **Cache invalidation** automática

## 🔄 Integración con el Sistema

### Rutas
- Agregada ruta `/subsidiaries` al sistema de autenticación
- Configurada en el sidebar como "Sucursales"
- Ícono: `IconBuildingStore`

### Estado Global
- **Zustand store** para estado UI (diálogos, selección)
- **React Query** para estado de servidor
- **Sincronización automática** entre componentes

### Dependencias
- Reutiliza componentes existentes (SelectDropdown, TableData, etc.)
- Sigue patrones establecidos en Users y Companies
- Compatible con el sistema de tema existente

## 🚀 Uso

### Navegación
1. Iniciar sesión en la aplicación
2. Navegar a "Sucursales" en el sidebar
3. La tabla se carga automáticamente

### Crear Sucursal
1. Click en "Agregar Sucursal"
2. Llenar formulario obligatorio
3. Seleccionar empresa del dropdown
4. Guardar - se actualiza la tabla automáticamente

### Editar Sucursal
1. Click en menú de acciones (3 puntos) en cualquier fila
2. Seleccionar "Editar"
3. Modificar campos necesarios
4. Guardar cambios

### Eliminar Sucursal
1. Click en menú de acciones (3 puntos)
2. Seleccionar "Eliminar"
3. Confirmar eliminación
4. La sucursal se elimina de la tabla

### Filtros y Búsqueda
- **Buscador**: Escribir en el campo de búsqueda para filtrar por nombre
- **Filtro Estado**: Seleccionar "Activo" o "Inactivo"
- **Filtro Municipio**: Seleccionar municipios específicos
- **Ordenamiento**: Click en headers de columna para ordenar

## 🧪 Testing

### Casos de Prueba Recomendados
1. **Crear sucursal** con todos los campos válidos
2. **Validación** de campos requeridos
3. **Edición** de sucursal existente
4. **Eliminación** con confirmación
5. **Filtros** y búsqueda funcionando correctamente
6. **Responsividad** en diferentes tamaños de pantalla
7. **Estados de carga** durante operaciones API
8. **Manejo de errores** de API

## 📝 Notas de Implementación

### Decisiones de Diseño
- **Seguimiento de patrones**: Mantiene consistencia con Users/Companies
- **Validación robusta**: Uses Zod para validación tipada
- **UX optimizada**: Loading states, confirmaciones, etc.
- **Arquitectura escalable**: Fácil de extender con nuevas funcionalidades

### Mejoras Futuras Posibles
- **Geocodificación** para direcciones
- **Validación de teléfonos** por región
- **Subida de imágenes** para sucursales
- **Mapas integrados** para visualizar ubicaciones
- **Reportes** de sucursales por empresa
- **Estados personalizados** más allá de activo/inactivo

### Consideraciones de Performance
- **React Query** maneja cache automáticamente
- **Lazy loading** de empresas solo cuando se abre el diálogo
- **Memoización** de componentes pesados cuando sea necesario
- **Optimistic updates** para UX fluida

## ✅ Checklist de Implementación

- [x] Schema de datos (Zod + TypeScript)
- [x] Servicio API (CRUD completo)
- [x] Hooks React Query
- [x] Store UI (Zustand)
- [x] Componentes de tabla
- [x] Diálogos CRUD
- [x] Validación de formularios
- [x] Ruta autenticada
- [x] Integración en sidebar
- [x] Manejo de errores
- [x] Estados de carga
- [x] Filtros y búsqueda
- [x] Diseño responsive
- [x] Documentación

La implementación está completa y lista para uso en producción! 🎉
