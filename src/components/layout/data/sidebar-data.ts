import {
  IconBuilding,
  IconLayoutDashboard,
  IconPackages,
  IconUserCog,
  IconUsers,
  IconBuildingStore,
  IconFileInvoice,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type DecodedToken } from '@/lib/jwtUtils'
import { USER_ROLES, isSuperAdmin, isAdminOrSuperAdmin } from '@/lib/userRoles'
import {
  type SidebarData,
  type CompanyInformation,
  type NavGroup,
} from '../types'

export const getDefaultCompanyInfo = (): CompanyInformation => ({
  name: 'Codex - Facturación',
  logo: Command,
  plan: 'by Sinergya America S.R.L.',
})

// Función para obtener la navegación según el rol del usuario
const getNavigationByRole = (userRole: number): NavGroup[] => {
  // Super Admin (rolId: 1) - Vista global del SaaS
  if (isSuperAdmin(userRole)) {
    return [
      {
        title: 'Administración SaaS',
        items: [
          // Rutas /admin* NO existen todavía -> comentadas
          // { title: 'Dashboard Global', url: '/admin', icon: IconLayoutDashboard },
          { title: 'Empresas', url: '/companies', icon: IconBuilding }, // existe
          { title: 'Usuarios', url: '/users', icon: IconUsers }, // existe
          {
            title: 'Subsidiarias',
            url: '/subsidiaries',
            icon: IconBuildingStore,
          }, // existe
          // { title: 'Impersonar', url: '/admin/impersonate', icon: IconEye },
        ],
      },
      {
        title: 'Módulos Empresa',
        items: [
          { title: 'Productos', url: '/products', icon: IconPackages }, // existe
          { title: 'Ventas', url: '/sales', icon: IconFileInvoice }, // existe
          { title: 'Hacer Venta', url: '/sell', icon: IconFileInvoice }, // existe
          { title: 'Puntos de Venta', url: '/pos', icon: IconBuildingStore }, // existe
          { title: 'Clientes', url: '/customers', icon: IconUsers }, // existe
        ],
      },
    ]
  }

  // Admin de Empresa (rolId: 2) - Configuración SIAT y administración
  if (isAdminOrSuperAdmin(userRole) && userRole === USER_ROLES.ADMIN) {
    return [
      // Secciones /app* NO implementadas aún -> comentadas para no mostrar enlaces rotos
      {
        title: 'Administración',
        items: [
          { title: 'Usuarios & Roles', url: '/users', icon: IconUserCog },
          {
            title: 'Sucursales',
            url: '/subsidiaries',
            icon: IconBuildingStore,
          },
          { title: 'Productos', url: '/products', icon: IconPackages },
          { title: 'Ventas', url: '/sales', icon: IconFileInvoice },
          { title: 'Hacer Venta', url: '/sell', icon: IconFileInvoice },
          { title: 'Puntos de Venta', url: '/pos', icon: IconBuildingStore },
          { title: 'Clientes', url: '/customers', icon: IconUsers },
          // { title: 'Plantillas PDF', url: '/app/plantillas', icon: IconTemplate },
          // { title: 'Integraciones', url: '/app/integraciones', icon: IconPlugConnected },
          // { title: 'Configuración Empresa', url: '/app/config', icon: IconSettings },
        ],
      },
    ]
  }

  // Invoicer/Facturador (rolId: 3) - Solo emisión y gestión básica
  if (userRole === USER_ROLES.INVOICER) {
    return [
      {
        title: 'Operación Básica',
        items: [
          // Secciones /app* no implementadas -> omitidas
          { title: 'Ventas', url: '/sales', icon: IconFileInvoice },
          { title: 'Hacer Venta', url: '/sell', icon: IconFileInvoice },
          { title: 'Clientes', url: '/customers', icon: IconUsers },
          { title: 'Productos', url: '/products', icon: IconPackages },
        ],
      },
    ]
  }

  // Default/Fallback - navegación básica para roles no definidos
  return [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/app',
          icon: IconLayoutDashboard,
        },
      ],
    },
  ]
}

export const getSidebarData = (
  userInfo?: DecodedToken | null,
  companyInfo?: CompanyInformation
): SidebarData => {
  const userRole = userInfo?.rolId || USER_ROLES.INVOICER // Default a Invoicer si no hay rol

  return {
    user: {
      name: userInfo?.nombre || 'Usuario',
      email: userInfo?.email || 'No email disponible',
      avatar: '/avatars/shadcn.jpg',
    },
    companyInformation: companyInfo || getDefaultCompanyInfo(),
    teams: [
      {
        name: 'Codex - Facturación',
        logo: Command,
        plan: 'by Sinergya America S.R.L.',
      },
    ],
    navGroups: getNavigationByRole(userRole),
  }
}

// Mantener compatibilidad hacia atrás con una versión estática por defecto
export const sidebarData: SidebarData = getSidebarData()
