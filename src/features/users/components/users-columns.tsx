import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { TableColumnHeader } from '@/components/table/table-column-header'
import { User } from '../data/schema'
import { DataTableRowActions } from './users-actions'

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'usuario',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Usuario' />
    ),
    cell: ({ row }) => <div>{row.getValue('usuario')}</div>,
  },

  {
    id: 'nombreCompleto',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Nombre Completo' />
    ),
    cell: ({ row }) => {
      const nombre = `${row.original.nombre} ${row.original.apellido}`.trim()
      return <div>{nombre}</div>
    },
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
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
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const estado = row.getValue(id) as boolean
      return value.includes(estado ? 'Activo' : 'Inactivo')
    },
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Creado' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
