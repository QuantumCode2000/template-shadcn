import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconBuilding,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconBuildingStore,
  IconFileInvoice,
  IconReceipt,
  IconFileText,
  IconRefresh,
  IconX,
  IconSearch,
  IconCash,
  IconShieldCheck,
  IconCertificate,
  IconReport,
  IconChartBar,
  IconDatabase,
  IconTemplate,
  IconPlugConnected,
  IconBell,
  IconActivity,
  IconCloud,
  IconCreditCard,
  IconHeadset,
  IconEye,
  IconClipboardList,
  IconCalendar,
  IconFileCheck,
  IconAlertTriangle,
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
        title: 'Panel de Control',
        items: [
          {
            title: 'Dashboard Global',
            url: '/admin',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Empresas',
            url: '/companies',
            icon: IconBuilding,
          },
          {
            title: 'Usuarios',
            url: '/users',
            icon: IconUsers,
          },
          {
            title: 'Subsidiarias',
            url: '/subsidiaries',
            icon: IconBuildingStore,
          },
          {
            title: 'Impersonar',
            url: '/admin/impersonate',
            icon: IconEye,
          },
        ],
      },
      {
        title: 'Monitoreo & Operación',
        items: [
          {
            title: 'SIAT Monitor',
            url: '/admin/siat/monitor',
            icon: IconActivity,
          },
          {
            title: 'Colas & Reintentos',
            url: '/admin/queues',
            icon: IconRefresh,
          },
          {
            title: 'Logs & Auditoría',
            url: '/admin/logs',
            icon: IconFileText,
          },
          {
            title: 'Salud de Servicios',
            url: '/admin/health',
            icon: IconShieldCheck,
          },
        ],
      },
      {
        title: 'Catálogos & Config',
        items: [
          {
            title: 'Catálogos Globales',
            url: '/admin/catalogs',
            icon: IconDatabase,
          },
          {
            title: 'Ambientes SIAT',
            url: '/admin/siat/env',
            icon: IconCloud,
          },
          {
            title: 'Certificados',
            url: '/admin/certificates',
            icon: IconCertificate,
          },
          {
            title: 'Mantenimiento',
            url: '/admin/maintenance',
            icon: IconTool,
          },
        ],
      },
      {
        title: 'Comercial',
        items: [
          {
            title: 'Planes & Cobros',
            url: '/admin/billing',
            icon: IconCreditCard,
          },
          {
            title: 'Soporte',
            url: '/admin/support',
            icon: IconHeadset,
          },
        ],
      },
    ]
  }

  // Admin de Empresa (rolId: 2) - Configuración SIAT y administración
  if (isAdminOrSuperAdmin(userRole) && userRole === USER_ROLES.ADMIN) {
    return [
      {
        title: 'Inicio',
        items: [
          {
            title: 'Dashboard',
            url: '/app',
            icon: IconLayoutDashboard,
          },
        ],
      },
      {
        title: 'Operación (Facturación)',
        items: [
          {
            title: 'Emitir Factura',
            url: '/app/facturar',
            icon: IconFileInvoice,
          },
          {
            title: 'Recepción por Paquete',
            url: '/app/paquetes',
            icon: IconPackages,
          },
          {
            title: 'Borradores',
            url: '/app/borradores',
            icon: IconFileText,
          },
          {
            title: 'Notas C/D',
            url: '/app/notas',
            icon: IconReceipt,
          },
          {
            title: 'Anulaciones',
            url: '/app/anulaciones',
            icon: IconX,
          },
          {
            title: 'Contingencia',
            url: '/app/contingencia',
            icon: IconAlertTriangle,
          },
          {
            title: 'Seguimiento de Envíos',
            url: '/app/envios',
            icon: IconSearch,
          },
        ],
      },
      {
        title: 'Maestros',
        items: [
          {
            title: 'Clientes',
            url: '/app/clientes',
            icon: IconUsers,
          },
          {
            title: 'Productos/Servicios',
            url: '/app/items',
            icon: IconClipboardList,
          },
          {
            title: 'Sucursales & PDV',
            url: '/app/sucursales',
            icon: IconBuildingStore,
          },
        ],
      },
      {
        title: 'SIAT (Admin)',
        items: [
          {
            title: 'CUIS/CUFD',
            url: '/app/siat/credenciales',
            icon: IconShieldCheck,
          },
          {
            title: 'Sincronizaciones',
            url: '/app/siat/sync',
            icon: IconRefresh,
          },
          {
            title: 'Eventos Significativos',
            url: '/app/siat/eventos',
            icon: IconBell,
          },
          {
            title: 'Certificados Digitales',
            url: '/app/siat/certificados',
            icon: IconCertificate,
          },
        ],
      },
      {
        title: 'Reportes',
        items: [
          {
            title: 'Libro de Ventas IVA',
            url: '/app/reportes/libro-ventas',
            icon: IconReport,
          },
          {
            title: 'KPIs de Venta',
            url: '/app/reportes/kpis',
            icon: IconChartBar,
          },
          {
            title: 'Estados de Envío',
            url: '/app/reportes/envios',
            icon: IconFileCheck,
          },
          {
            title: 'Export Contable',
            url: '/app/reportes/contabilidad',
            icon: IconCalendar,
          },
        ],
      },
      {
        title: 'Administración',
        items: [
          {
            title: 'Usuarios & Roles',
            url: '/users',
            icon: IconUserCog,
          },
          {
            title: 'Sucursales',
            url: '/subsidiaries',
            icon: IconBuildingStore,
          },
          {
            title: 'Plantillas PDF',
            url: '/app/plantillas',
            icon: IconTemplate,
          },
          {
            title: 'Integraciones',
            url: '/app/integraciones',
            icon: IconPlugConnected,
          },
          {
            title: 'Configuración Empresa',
            url: '/app/config',
            icon: IconSettings,
          },
        ],
      },
    ]
  }

  // Invoicer/Facturador (rolId: 3) - Solo emisión y gestión básica
  if (userRole === USER_ROLES.INVOICER) {
    return [
      {
        title: 'Trabajo Diario',
        items: [
          {
            title: 'Inicio',
            url: '/app',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Emitir Factura',
            url: '/app/facturar',
            icon: IconFileInvoice,
          },
          {
            title: 'Borradores',
            url: '/app/borradores',
            icon: IconFileText,
          },
          {
            title: 'Notas C/D',
            url: '/app/notas',
            icon: IconReceipt,
          },
          {
            title: 'Anulaciones',
            url: '/app/anulaciones',
            icon: IconX,
          },
          {
            title: 'Seguimiento',
            url: '/app/envios',
            icon: IconSearch,
          },
        ],
      },
      {
        title: 'Maestros (Limitado)',
        items: [
          {
            title: 'Clientes',
            url: '/app/clientes',
            icon: IconUsers,
          },
          {
            title: 'Productos/Servicios',
            url: '/app/items',
            icon: IconClipboardList,
          },
        ],
      },
      {
        title: 'Caja (Opcional)',
        items: [
          {
            title: 'Caja Diaria',
            url: '/app/caja',
            icon: IconCash,
          },
        ],
      },
      {
        title: 'Mi Cuenta',
        items: [
          {
            title: 'Mi Actividad',
            url: '/app/mis-emisiones',
            icon: IconActivity,
          },
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
