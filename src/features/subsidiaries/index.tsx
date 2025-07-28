import { IconPlus } from '@tabler/icons-react'
import { useSubsidiariesUI } from '@/stores/subsidiaries-ui-store'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns } from './components/subsidiaries-columns'
import { SubsidiariesDialogs } from './components/subsidiaries-dialogs'
import { useSubsidiaries } from './context/use-subsidiaries'

const actions = [
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
  const { data, isLoading } = useSubsidiaries()
  const { setOpen } = useSubsidiariesUI()

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Sucursales'
          subtitle='Maneja las sucursales de tu empresa aquí.'
          useData={() => {
            const { setOpen } = useSubsidiariesUI()
            return (action: string) =>
              setOpen(action as 'add' | 'edit' | 'delete')
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
      <SubsidiariesDialogs />
    </>
  )
}
