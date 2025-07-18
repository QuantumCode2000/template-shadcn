import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Usuario
  {
    accessorKey: 'usuario',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Usuario' />
    ),
    cell: ({ row }) => <div>{row.getValue('usuario')}</div>,
  },

  // Nombre completo
  {
    id: 'nombreCompleto',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Nombre Completo' />
    ),
    cell: ({ row }) => {
      const fullName =
        `${row.original.nombre} ${row.original.paterno} ${row.original.materno || ''}`.trim()
      return <div>{fullName}</div>
    },
  },

  // Email
  {
    accessorKey: 'email',
    header: ({ column }) => <TableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },

  // Whatsapp
  {
    id: 'telefono',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Whatsapp' />
    ),
    cell: ({ row }) => {
      const phone =
        row.original.whatsapp && row.original.codigo_pais
          ? `+${row.original.codigo_pais} ${row.original.whatsapp}`
          : '-'
      return <div>{phone}</div>
    },
    enableSorting: false,
  },

  // Roles
  {
    id: 'roles',
    header: ({ column }) => <TableColumnHeader column={column} title='Roles' />,
    cell: ({ row }) => {
      const roles = (row.original.roles ?? []) as {
        id: number
        nombre: string
      }[]
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.length > 0 ? (
            roles.map((role, idx) => (
              <Badge key={`${role.id}-${idx}`} variant='outline'>
                {role.nombre}
              </Badge>
            ))
          ) : (
            <span className='text-gray-400'>Sin rol</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },

  // Estado (badge de color)
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estadoRaw = row.getValue('estado') as string | null
      const estado = estadoRaw ?? 'desconocido' // fallback

      const badgeColor =
        estado?.toLowerCase() === 'activo'
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {estado}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const v = row.getValue(id) as string | null
      return v ? value.includes(v) : false
    },
  },

  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Actualizado' />
    ),
    cell: ({ row }) => {
      const date = row.original.updated_at
      return date ? new Date(date).toLocaleDateString() : '-'
    },
    sortingFn: 'datetime',
    enableSorting: true,
    filterFn: (row, _unused, value) => {
      const date = row.original.updated_at
      if (!date || !value) return false
      return new Date(date).toLocaleDateString().includes(value)
    },
  },

  // Acciones (sin cambios)
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
