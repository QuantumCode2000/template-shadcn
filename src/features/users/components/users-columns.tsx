import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { ColumnDef } from '@tanstack/react-table'
import apiService from '@/lib/apiService'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableColumnHeader } from '@/components/table/table-column-header'
import { User } from '../data/schema'
import { DataTableRowActions } from './users-actions'

// Contexto para las empresas
interface CompaniesContextType {
  companies: Record<number, string>
  loading: boolean
}

const CompaniesContext = createContext<CompaniesContextType>({
  companies: {},
  loading: true,
})

// Provider de empresas
export const CompaniesProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {}, [])

  return (
    <CompaniesContext.Provider value={{ companies, loading }}>
      {children}
    </CompaniesContext.Provider>
  )
}

// Hook para usar las empresas
const useCompanies = () => {
  return useContext(CompaniesContext)
}

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
    header: ({ column }) => <TableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },

  {
    accessorKey: 'empresa',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Empresa' />
    ),
    cell: ({ row }) => (
      <div>{row.original.empresa?.nombre ?? 'Sin empresa'}</div>
    ),
  },

  {
    accessorKey: 'rol',
    header: ({ column }) => <TableColumnHeader column={column} title='Rol' />,
    cell: ({ row }) => <div>{row.original.rol?.codigo ?? 'Sin rol'}</div>,
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

  // {
  //   accessorKey: 'created_at',
  //   header: ({ column }) => (
  //     <TableColumnHeader column={column} title='Creado' />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue('created_at'))
  //     return <div>{date.toLocaleDateString()}</div>
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
