// components/table-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TableFacetedFilter } from '@/components/table/table-faceted-filter'
import { TableViewOptions } from '@/components/table/table-view-options'

/* ──────── 1. Tipado ──────── */
export interface TableToolbarProps<TData> {
  table: Table<TData>

  /** Columna sobre la que se hace la búsqueda “free text” */
  search?: {
    columnId: string
    placeholder?: string
  }

  /** Definición de filtros facetados */
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]

  /** Texto para el botón de limpiar filtros */
  clearLabel?: string
}

export function TableToolbar<TData>({
  table,
  search,
  filters = [],
  clearLabel = 'Limpiar filtros',
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* ──────── Búsqueda libre ──────── */}
        {search && (
          <Input
            placeholder={search.placeholder ?? 'Buscar…'}
            value={
              (table.getColumn(search.columnId)?.getFilterValue() as string) ??
              ''
            }
            onChange={(e) =>
              table.getColumn(search.columnId)?.setFilterValue(e.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {/* ──────── Filtros facetados ──────── */}
        <div className='flex gap-x-2'>
          {filters.map(
            ({ columnId, title, options }) =>
              table.getColumn(columnId) && (
                <TableFacetedFilter
                  table={table}
                  key={columnId}
                  column={table.getColumn(columnId)}
                  title={title}
                  options={options}
                />
              )
          )}
        </div>

        {/* ──────── Botón “limpiar” ──────── */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            {clearLabel}
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* ──────── Visibilidad de columnas ──────── */}
      <TableViewOptions table={table} />
    </div>
  )
}
