import { IconPackages } from '@tabler/icons-react'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { columns } from './components/products-columns'
import { ProductsDialogs } from './components/products-dialogs'
import { useProducts } from './hooks/use-products'
import { useProductsUI } from './stores/products-ui-store'

const filterToolbar = {
  search: { columnId: 'descripcion', placeholder: 'Filtrar productos…' },
}

export default function Products() {
  const { data } = useProducts()
  const ui = useProductsUI()

  const actions = [
    {
      label: 'Agregar Producto',
      icon: IconPackages,
      action: 'create',
      onClick: () => ui.openDialog('create'),
    },
  ]

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Lista de Productos'
          subtitle='Maneja los productos de tu empresa aquí.'
          useData={() => (action: string) => ui.openDialog(action as any)}
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
      <ProductsDialogs />
    </>
  )
}
