import { IconBuilding } from '@tabler/icons-react'
import { useCompaniesUI } from '@/stores/companies-ui-store'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns } from './components/companies-columns'
import { CompaniesDialogs } from './components/companies-dialogs'
import { useCompanies } from './context/use-companies'

const actions = [
  {
    label: 'Agregar Empresa',
    icon: IconBuilding,
    action: 'add',
    onClick: () => {
      const { setOpen } = useCompaniesUI()
      setOpen('add')
    },
  },
]

const filterToolbar = {
  search: { columnId: 'nombre', placeholder: 'Filtrar empresas…' },
  filters: [
    {
      columnId: 'activo',
      title: 'Estado',
      options: [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ],
    },
    {
      columnId: 'codigoAmbienteSin',
      title: 'Ambiente SIN',
      options: [
        { label: 'Producción', value: 1 },
        { label: 'Pruebas y Piloto', value: 2 },
        // { label: 'Desarrollo', value: 3 },
        // { label: 'Capacitación', value: 4 },
      ],
    },
  ],
}

export default function Companies() {
  const { data, isLoading } = useCompanies()
  console.log('Companies data:', data, 'Loading:', isLoading)
  const { setOpen } = useCompaniesUI()
  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Empresas'
          subtitle='Maneja las empresas del sistema aquí.'
          useData={() => {
            const { setOpen } = useCompaniesUI()
            return (action: string) =>
              setOpen(action as 'add' | 'edit' | 'delete' | 'view')
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
      <CompaniesDialogs />
    </>
  )
}
