import { ColumnDef } from '@tanstack/react-table'
import { TableColumnHeader } from '@/components/table/table-column-header'
import { Product } from '../data/schema'
import { DataTableRowActions } from './products-actions'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'codigo',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Código' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('codigo')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate'>
        {row.getValue('descripcion')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'precioUnitario',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Precio Unitario' />
    ),
    cell: ({ row }) => {
      const precio = parseFloat(row.getValue('precioUnitario'))
      const formatted = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
      }).format(precio)
      return <div className='font-medium'>{formatted}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'unidadMedida',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Unidad de Medida' />
    ),
    cell: ({ row }) => {
      const unidadMedida = row.original.unidadMedida
      return (
        <div className='text-sm'>
          {unidadMedida ? unidadMedida.descripcionSin : 'Sin unidad'}
        </div>
      )
    },
    enableSorting: false,
    filterFn: (row, _id, value) => {
      const unidadMedida = row.original.unidadMedida
      if (!unidadMedida) return false
      return unidadMedida.descripcionSin
        .toLowerCase()
        .includes(value.toLowerCase())
    },
  },
  {
    accessorKey: 'codigoProductoSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Código SIN' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground text-sm'>
        {row.getValue('codigoProductoSin')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Fecha Creación' />
    ),
    cell: ({ row }) => {
      const fecha = new Date(row.getValue('createdAt'))
      return (
        <div className='text-sm'>
          {fecha.toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
