import Cookies from 'js-cookie'
import { IconUserPlus } from '@tabler/icons-react'
import { decodeToken } from '@/lib/jwtUtils'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { useUsers } from './hooks/use-users'
import { useUsersUI } from './stores/users-ui-store'

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
  search: { columnId: 'usuario', placeholder: 'Filtrar usuarios…' },
  asyncSelectFilters: [
    {
      columnId: 'empresa',
      endpoint: '/empresas',
      placeholder: 'Empresa…',
      searchParam: 'nombre[lk]',
      minChars: 1,
      debounceMs: 400,
      mapItem: (it: any) => ({ value: String(it.id), label: it.nombre }),
    },
  ],
  filters: [
    {
      columnId: 'activo',
      title: 'Estado',
      options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
      ],
    },
  ],
}

export default function Users() {
  const { data } = useUsers()
  const ui = useUsersUI()
  const isAdmin = getIsAdminFromCookie()

  const actions = isAdmin
    ? [
        {
          label: 'Agregar Usuario',
          icon: IconUserPlus,
          action: 'add-admin',
          onClick: () => ui.setOpen('add-admin'),
        },
      ]
    : [
        {
          label: 'Agregar Usuario',
          icon: IconUserPlus,
          action: 'add',
          onClick: () => ui.setOpen('add'),
        },
      ]

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Usuarios'
          subtitle='Maneja tus usuarios y sus roles aquí.'
          useData={() => (action: string) => ui.setOpen(action as any)}
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
      <UsersDialogs />
    </>
  )
}
