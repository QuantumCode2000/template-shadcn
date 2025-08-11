import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Subsidiary } from '../data/schema'
import { useSubsidiariesUI } from '../stores/subsidiaries-ui-store'

interface DataTableRowActionsProps {
  row: Row<Subsidiary>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setSelectedSubsidiary, setOpen } = useSubsidiariesUI()

  const handleEdit = () => {
    setSelectedSubsidiary(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setSelectedSubsidiary(row.original)
    setOpen('delete')
  }

  return (
    <DropdownMenu>
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
        <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
