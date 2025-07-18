// components/table-pagination.tsx
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TablePaginationProps<TData> {
  table: Table<TData>
  /**  Opcional: tamaños de página disponibles */
  pageSizes?: number[]
  /**  Opcional: oculta el mensaje de filas seleccionadas */
  hideSelectionInfo?: boolean
}

export function TablePagination<TData>({
  table,
  pageSizes = [10, 20, 30, 40, 50],
  hideSelectionInfo = false,
}: TablePaginationProps<TData>) {
  return (
    <div
      className='flex items-center justify-between overflow-clip px-2'
      style={{ overflowClipMargin: 1 }}
    >
      {!hideSelectionInfo && (
        <div className='text-muted-foreground hidden flex-1 text-sm sm:block'>
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
      )}

      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        {/* Selector de filas por página */}
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>
            Filas por página:
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información de página actual */}
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </div>

        {/* Controles de navegación */}
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Ir a la primera página</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Ir a la página anterior</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Ir a la página siguiente</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Ir a la última página</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
