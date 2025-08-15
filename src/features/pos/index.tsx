import { IconPlus } from '@tabler/icons-react'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { TableHeader } from '@/components/table/header/table-header'
import { TableData } from '@/components/table/table-data'
import { posColumns } from './components/pos-columns'
import { PosDialogs } from './components/pos-dialogs'
import { usePosList } from './hooks/use-pos'
import { usePosUI } from './stores/pos-ui-store'

export default function PosList() {
  const { data = [] } = usePosList()
  const ui = usePosUI()

  const actions = [
    {
      label: 'Crear punto de venta',
      action: 'create',
      icon: IconPlus,
      onClick: () => ui.setOpen('create' as any),
    },
  ]

  return (
    <>
      <HeaderMain />
      <Main>
        <TableHeader
          title='Puntos de venta'
          subtitle='Gestiona los puntos de venta de tu empresa.'
          useData={() => (action: string) => ui.setOpen(action as any)}
          actions={actions}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <TableData
            columns={posColumns}
            data={Array.isArray(data) ? data : []}
          />
        </div>
      </Main>
      <PosDialogs />
    </>
  )
}
