import Cookies from 'js-cookie'
import { IconPlus } from '@tabler/icons-react'
import { decodeToken } from '@/lib/jwtUtils'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns } from './components/subsidiaries-columns'
import { SubsidiariesDialogs } from './components/subsidiaries-dialogs'
import { useSubsidiaries } from './context/use-subsidiaries'
import { useSubsidiariesUI } from './stores/subsidiaries-ui-store'

// Función para obtener si es admin desde cookie
function getIsAdminFromCookie(): boolean {
  try {
    const cookieToken = Cookies.get('thisisjustarandomstring')
    if (!cookieToken) return false
    const token = JSON.parse(cookieToken)
    const decoded = decodeToken(token)
    return decoded?.rolId === 2
  } catch {
    return false
  }
}

const filterToolbar = {
  search: { columnId: 'nombre', placeholder: 'Filtrar sucursales…' },
  filters: [
    {
      columnId: 'activo',
      title: 'Estado',
      options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
      ],
    },
    {
      columnId: 'municipio',
      title: 'Municipio',
      options: [
        { label: 'La Paz', value: 'La Paz' },
        { label: 'Cochabamba', value: 'Cochabamba' },
        { label: 'Santa Cruz', value: 'Santa Cruz' },
        { label: 'Laja', value: 'Laja' },
      ],
    },
  ],
}

export default function Subsidiaries() {
  const { data } = useSubsidiaries()
  const isAdmin = getIsAdminFromCookie()

  const actions = isAdmin
    ? [
        {
          label: 'Agregar Sucursal',
          icon: IconPlus,
          action: 'add-admin',
          onClick: () => {
            const { setOpen } = useSubsidiariesUI()
            setOpen('add-admin')
          },
        },
      ]
    : [
        {
          label: 'Agregar Sucursal',
          icon: IconPlus,
          action: 'add',
          onClick: () => {
            const { setOpen } = useSubsidiariesUI()
            setOpen('add')
          },
        },
      ]

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Sucursales'
          subtitle='Maneja las sucursales de tu empresa aquí.'
          useData={() => {
            const { setOpen } = useSubsidiariesUI()
            return (action: string) => setOpen(action as any)
          }}
          actions={actions}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TableData
            columns={columns}
            data={Array.isArray(data) ? data : []}
            toolbar={filterToolbar}
          />
        </div>
      </Main>
      <SubsidiariesDialogs />
    </>
  )
}
