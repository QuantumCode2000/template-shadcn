import { IconUserPlus } from '@tabler/icons-react'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns, CompaniesProvider } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
// import { UsersDialogType, useUsers } from './context/users-context'
import { UsersProvider } from './context/users-context'
import { useUsers } from './hooks/use-users'
import { useUsersUI } from './stores/users-ui-store'

const actions = [
  {
    label: 'Agregar Usuario',
    icon: IconUserPlus,
    action: 'add',
    onClick: () => {
      const { setOpen } = useUsersUI()
      setOpen('add')
    },
  },
]

const filterToolbar = {
  search: { columnId: 'usuario', placeholder: 'Filtrar usuarios…' },

  filters: [
    {
      columnId: 'activo',
      title: 'Estado',
      options: [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ],
    },
    // {
    //   columnId: 'roles',
    //   title: 'Roles',
    //   options: [
    //     { label: 'Paciente', value: 'Paciente' },
    //     { label: 'Doctor', value: 'Doctor' },
    //     { label: 'Recepcionista', value: 'Recepcionista' },
    //     { label: 'Admin', value: 'Admin' },
    //   ],
    // },
  ],
}

export default function Users() {
  const { data, isLoading } = useUsers()
  const { setOpen } = useUsersUI()
  return (
    <CompaniesProvider>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Usuarios'
          subtitle='Maneja tus usuarios y sus roles aquí.'
          // useData={() => {
          //   const { setOpen } = useUsers()
          //   return (action: string) => setOpen(action as UsersDialogType)
          // }}
          useData={() => {
            const { setOpen } = useUsersUI()
            return (action: string) =>
              setOpen(action as 'add' | 'edit' | 'delete' | 'invite')
          }}
          actions={actions}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TableData
            columns={columns}
            useData={() => data}
            toolbar={filterToolbar}
          />
        </div>
      </Main>
      <UsersDialogs />
    </CompaniesProvider>
  )
}
