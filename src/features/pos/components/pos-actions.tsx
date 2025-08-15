import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import type { Pos } from '../data/schema'
import { usePosUI } from '../stores/pos-ui-store'

interface Props {
  row: Row<Pos>
}

export function PosHeaderActions() {
  const { setOpen } = usePosUI()
  return (
    <Button onClick={() => setOpen('create')} size='sm'>
      <IconPlus className='mr-2 h-4 w-4' /> Crear punto de venta
    </Button>
  )
}

export function PosRowActions({ row }: Props) {
  const { setOpen, setSelectedId } = usePosUI()
  const pos = row.original
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setSelectedId(pos.id)
            setOpen('view')
          }}
        >
          Ver
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedId(pos.id)
            setOpen('delete')
          }}
          className='text-red-600 focus:text-red-600'
        >
          Eliminar
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
