import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Product } from '../data/schema'
import { useProductsUI } from '../stores/products-ui-store'

interface DataTableRowActionsProps {
  row: Row<Product>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { openDialog } = useProductsUI()
  const product = row.original

  const handleEdit = () => {
    openDialog('edit', product)
  }

  const handleDelete = () => {
    openDialog('delete', product)
  }

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
        <DropdownMenuItem onClick={handleEdit}>
          Editar
          <DropdownMenuShortcut>
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
          Eliminar
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
