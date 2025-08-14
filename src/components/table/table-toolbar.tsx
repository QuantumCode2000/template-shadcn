// components/table-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AsyncSelectDropdown } from '@/components/async-select-dropdown'
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

  /** Filtros asíncronos (dropdown con búsqueda remota) */
  asyncSelectFilters?: {
    columnId: string
    endpoint: string
    placeholder?: string
    searchParam?: string
    minChars?: number
    debounceMs?: number
    mapItem?: (item: any) => { value: string; label: string }
    /** Si true, permite limpiar al volver a seleccionar */
    clearOnSame?: boolean
  }[]

  /** Texto para el botón de limpiar filtros */
  clearLabel?: string
}

export function TableToolbar<TData>({
  table,
  search,
  filters = [],
  asyncSelectFilters = [],
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
          {asyncSelectFilters.map(
            ({
              columnId,
              endpoint,
              placeholder = 'Buscar…',
              searchParam = 'q',
              minChars = 1,
              debounceMs = 350,
              mapItem = (it: any) => ({
                value: String(it.id),
                label: it.nombre || it.label || it.title || String(it.id),
              }),
              clearOnSame = true,
            }) => {
              const column = table.getColumn(columnId)
              if (!column) return null
              const current = column.getFilterValue() as string | undefined
              return (
                <div key={columnId} className='w-[190px]'>
                  <AsyncSelectDropdown
                    endpoint={endpoint}
                    searchParam={searchParam}
                    placeholder={placeholder}
                    minChars={minChars}
                    debounceMs={debounceMs}
                    mapItem={mapItem}
                    defaultValue={current || ''}
                    isControlled
                    onValueChange={(val) => {
                      if (clearOnSame && current && current === val) {
                        column.setFilterValue(undefined)
                      } else {
                        column.setFilterValue(val || undefined)
                      }
                    }}
                  />
                </div>
              )
            }
          )}
          {filters.map(({ columnId, title, options }) => {
            const column = table.getColumn(columnId)
            if (!column) return null
            return (
              <TableFacetedFilter
                table={table}
                key={columnId}
                column={column}
                title={title}
                options={options}
              />
            )
          })}
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
