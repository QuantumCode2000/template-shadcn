import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableColumnHeader } from '@/components/table/table-column-header'
import { type Subsidiary } from '../data/schema'
import { DataTableRowActions } from './subsidiaries-actions'

export const columns: ColumnDef<Subsidiary>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todo'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'codigo',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Código' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('codigo')}</div>
    ),
  },

  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
  },

  {
    accessorKey: 'municipio',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Municipio' />
    ),
    cell: ({ row }) => <div>{row.getValue('municipio')}</div>,
  },

  {
    accessorKey: 'direccion',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Dirección' />
    ),
    cell: ({ row }) => {
      const direccion = row.getValue('direccion') as string
      return (
        <div className='max-w-[200px] truncate' title={direccion}>
          {direccion}
        </div>
      )
    },
  },

  {
    accessorKey: 'telefono',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Teléfono' />
    ),
    cell: ({ row }) => <div>{row.getValue('telefono')}</div>,
  },

  {
    accessorKey: 'codigoSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Código SIN' />
    ),
    cell: ({ row }) => <div>{row.getValue('codigoSin')}</div>,
  },

  {
    accessorKey: 'activo',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const activo = row.getValue('activo') as boolean
      const badgeColor = activo
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

      return (
        <Badge className={badgeColor}>{activo ? 'Activo' : 'Inactivo'}</Badge>
      )
    },
    filterFn: (row, id, value) => {
      const estado = row.getValue(id) as boolean
      return value.includes(estado ? 'Activo' : 'Inactivo')
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
