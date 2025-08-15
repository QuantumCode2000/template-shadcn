import { IconPlus } from '@tabler/icons-react'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { salesColumns } from './components/sales-columns'
import { SalesDialogs } from './components/sales-dialogs'
import { useSalesList } from './hooks/use-sales'
import { useSalesUI } from './stores/sales-ui-store'

export default function SalesIndex() {
  const { data = [] } = useSalesList()
  const ui = useSalesUI()

  const actions = [
    {
      label: 'Nueva venta',
      action: 'create',
      icon: IconPlus,
      onClick: () => ui.setOpen('create'),
    },
  ]

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Ventas'
          subtitle='Listado de ventas realizadas.'
          useData={() => (action: string) => ui.setOpen(action as any)}
          actions={actions}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <TableData
            columns={salesColumns}
            data={Array.isArray(data) ? data : []}
          />
        </div>
      </Main>
      <SalesDialogs />
    </>
  )
}
