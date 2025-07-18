// components/table-view-options.tsx
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface TableViewOptionsProps<TData> {
  table: Table<TData>
  /** Texto del botón (por defecto “Columnas”) */
  buttonLabel?: string
  /** Encabezado dentro del menú (por defecto “Columnas visibles”) */
  heading?: string
}

export function TableViewOptions<TData>({
  table,
  buttonLabel = 'Columnas',
  heading = 'Columnas visibles',
}: TableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <MixerHorizontalIcon className='mr-2 h-4 w-4' />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-[170px]'>
        <DropdownMenuLabel>{heading}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()
          )
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className='capitalize'
              checked={col.getIsVisible()}
              onCheckedChange={(v) => col.toggleVisibility(!!v)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
