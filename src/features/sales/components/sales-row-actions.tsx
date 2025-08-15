import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Sale } from '../data/schema'
import { useSalesUI } from '../stores/sales-ui-store'

interface Props {
  row: Row<Sale>
}

export function SalesRowActions({ row }: Props) {
  const { setOpen, setSelectedId } = useSalesUI()
  const sale = row.original
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setSelectedId(sale.id)
            setOpen('view')
          }}
        >
          Ver detalle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
