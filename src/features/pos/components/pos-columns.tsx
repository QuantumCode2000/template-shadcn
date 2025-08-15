import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/date-format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableColumnHeader } from '@/components/table/table-column-header'
import type { Pos } from '../data/schema'
import { PosRowActions } from './pos-actions'

export const posColumns: ColumnDef<Pos>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'codigoSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Código SIN' />
    ),
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Nombre' />
    ),
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Descripción' />
    ),
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => <TableColumnHeader column={column} title='Tipo' />,
  },
  {
    accessorKey: 'sucursalId',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Sucursal' />
    ),
  },
  {
    accessorKey: 'activo',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Activo' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('activo') as boolean
      const badgeColor = value
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Creado' />
    ),
    cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Actualizado' />
    ),
    cell: ({ row }) => formatDateTime(row.getValue('updatedAt')),
  },
  { id: 'actions', cell: ({ row }) => <PosRowActions row={row} /> },
]
