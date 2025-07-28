import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableColumnHeader } from '@/components/table/table-column-header'
import { Company } from '../data/schema'
import { DataTableRowActions } from './companies-actions'

export const columns: ColumnDef<Company>[] = [
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
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate font-medium'>
        {row.getValue('nombre')}
      </div>
    ),
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground max-w-[150px] truncate'>
        {row.getValue('descripcion')}
      </div>
    ),
  },
  {
    accessorKey: 'nit',
    header: ({ column }) => <TableColumnHeader column={column} title='NIT' />,
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('nit')}</div>
    ),
  },
  {
    accessorKey: 'activo',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const activo = row.getValue('activo') as boolean
      return (
        <Badge
          variant={activo ? 'default' : 'secondary'}
          className={cn(
            activo
              ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
              : 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20'
          )}
        >
          {activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'codigoAmbienteSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Ambiente SIN' />
    ),
    cell: ({ row }) => {
      const ambiente = row.getValue('codigoAmbienteSin') as number
      const ambientes = {
        1: 'Producción',
        2: 'Pruebas',
        3: 'Desarrollo',
        4: 'Capacitación',
      }
      return (
        <Badge variant='outline'>
          {ambientes[ambiente as keyof typeof ambientes] || ambiente}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'codigoModalidadSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Modalidad SIN' />
    ),
    cell: ({ row }) => {
      const modalidad = row.getValue('codigoModalidadSin') as number
      const modalidades = {
        1: 'En línea',
        2: 'En lote',
        3: 'Fuera de línea',
      }
      return (
        <Badge variant='outline'>
          {modalidades[modalidad as keyof typeof modalidades] || modalidad}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
