import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/date-format'
import { TableColumnHeader } from '@/components/table/table-column-header'
import type { Sale } from '../data/schema'
import { SalesRowActions } from './sales-row-actions'

export const salesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableColumnHeader column={column} title='ID' />,
  },
  {
    accessorKey: 'clienteId',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Cliente' />
    ),
  },
  {
    accessorKey: 'sucursalId',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Sucursal' />
    ),
  },
  {
    accessorKey: 'puntoVentaId',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Punto Venta' />
    ),
  },
  {
    accessorKey: 'codigoDocumentoSectorSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Doc. Sector' />
    ),
  },
  {
    accessorKey: 'codigoMetodoPagoSin',
    header: ({ column }) => <TableColumnHeader column={column} title='Pago' />,
  },
  {
    accessorKey: 'codigoMonedaSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Moneda' />
    ),
  },
  {
    accessorKey: 'tipoCambioSin',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Cambio' />
    ),
  },
  {
    accessorKey: 'montoTotal',
    header: ({ column }) => <TableColumnHeader column={column} title='Total' />,
  },
  {
    accessorKey: 'fechaEmision',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Emisión' />
    ),
    cell: ({ row }) => formatDateTime(row.getValue('fechaEmision')),
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
  { id: 'actions', cell: ({ row }) => <SalesRowActions row={row} /> },
]
