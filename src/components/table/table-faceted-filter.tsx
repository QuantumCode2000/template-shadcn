// // components/table-faceted-filter.tsx
// import * as React from 'react'
// import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
// import { Column } from '@tanstack/react-table'
// import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from '@/components/ui/command'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
// import { Separator } from '@/components/ui/separator'
// /* ──────────── Tipado ──────────── */
// export interface TableFacetedFilterProps<TData, TValue> {
//   column?: Column<TData, TValue>
//   title?: string
//   options: {
//     label: string
//     value: string
//     icon?: React.ComponentType<{ className?: string }>
//   }[]
//   showCounts?: boolean
//   clearLabel?: string
// }
// /* ──────────── Componente ──────────── */
// export function TableFacetedFilter<TData, TValue>({
//   column,
//   title,
//   options,
//   showCounts = true,
//   clearLabel = 'Limpiar filtros',
// }: TableFacetedFilterProps<TData, TValue>) {
//   /* 1. Verifica si hay filas faceteadas antes de usar .rows */
//   const facetedRowModel = column?.getFacetedRowModel?.()
//   const hasRows = facetedRowModel?.rows?.length ?? 0
//   /* 2. Calcula valores únicos solo cuando existan filas */
//   const facets = React.useMemo(
//     () => (hasRows ? column?.getFacetedUniqueValues() : undefined),
//     [column, hasRows]
//   )
//   const selected = new Set(column?.getFilterValue() as string[])
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant='outline' size='sm' className='h-8 border-dashed'>
//           <PlusCircledIcon className='mr-2 h-4 w-4' />
//           {title}
//           {selected.size > 0 && (
//             <>
//               <Separator orientation='vertical' className='mx-2 h-4' />
//               <Badge
//                 variant='secondary'
//                 className='rounded-sm px-1 font-normal lg:hidden'
//               >
//                 {selected.size}
//               </Badge>
//               <div className='hidden space-x-1 lg:flex'>
//                 {selected.size > 2 ? (
//                   <Badge
//                     variant='secondary'
//                     className='rounded-sm px-1 font-normal'
//                   >
//                     {selected.size} seleccionados
//                   </Badge>
//                 ) : (
//                   options
//                     .filter((o) => selected.has(o.value))
//                     .map((o) => (
//                       <Badge
//                         key={o.value}
//                         variant='secondary'
//                         className='rounded-sm px-1 font-normal'
//                       >
//                         {o.label}
//                       </Badge>
//                     ))
//                 )}
//               </div>
//             </>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className='w-[200px] p-0' align='start'>
//         <Command>
//           <CommandInput placeholder={title} />
//           <CommandList>
//             <CommandEmpty>No se encontraron resultados.</CommandEmpty>
//             {/* Opciones */}
//             <CommandGroup>
//               {options.map((option) => {
//                 const isSelected = selected.has(option.value)
//                 return (
//                   <CommandItem
//                     key={option.value}
//                     onSelect={() => {
//                       isSelected
//                         ? selected.delete(option.value)
//                         : selected.add(option.value)
//                       const next = Array.from(selected)
//                       column?.setFilterValue(next.length ? next : undefined)
//                     }}
//                   >
//                     {/* Checkbox */}
//                     <div
//                       className={cn(
//                         'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
//                         isSelected
//                           ? 'bg-primary text-primary-foreground'
//                           : 'opacity-50 [&_svg]:invisible'
//                       )}
//                     >
//                       <CheckIcon className='h-4 w-4' />
//                     </div>
//                     {/* Icono */}
//                     {option.icon && (
//                       <option.icon className='text-muted-foreground mr-2 h-4 w-4' />
//                     )}
//                     <span>{option.label}</span>
//                     {/* Conteo */}
//                     {showCounts && facets?.get(option.value) && (
//                       <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
//                         {facets.get(option.value)}
//                       </span>
//                     )}
//                   </CommandItem>
//                 )
//               })}
//             </CommandGroup>
//             {/* Limpiar */}
//             {selected.size > 0 && (
//               <>
//                 <CommandSeparator />
//                 <CommandGroup>
//                   <CommandItem
//                     onSelect={() => column?.setFilterValue(undefined)}
//                     className='justify-center text-center'
//                   >
//                     {clearLabel}
//                   </CommandItem>
//                 </CommandGroup>
//               </>
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }
// components/table-faceted-filter.tsx
import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Column, Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

/* ──────────── Props ──────────── */
export interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  table: Table<TData>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  showCounts?: boolean
  clearLabel?: string
}

/* ──────────── Componente ──────────── */
export function TableFacetedFilter<TData, TValue>({
  column,
  table,
  title,
  options,
  showCounts = true,
  clearLabel = 'Limpiar filtros',
}: TableFacetedFilterProps<TData, TValue>) {
  /* 1. Verificar filas desde table (siempre presente) */
  const hasRows = table.getRowModel().rows.length > 0

  /* 2. Obtener valores únicos sólo cuando existan filas */
  const facets = React.useMemo(() => {
    if (!hasRows) return undefined
    try {
      return column.getFacetedUniqueValues()
    } catch {
      return undefined
    }
  }, [column, hasRows])

  const selected = new Set(column.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selected.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selected.size > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selected.size} seleccionados
                  </Badge>
                ) : (
                  options
                    .filter((o) => selected.has(o.value))
                    .map((o) => (
                      <Badge
                        key={o.value}
                        variant='secondary'
                        className='rounded-sm px-1 font-normal'
                      >
                        {o.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>

            <CommandGroup>
              {options.map((opt) => {
                const isSelected = selected.has(opt.value)
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => {
                      isSelected
                        ? selected.delete(opt.value)
                        : selected.add(opt.value)

                      const next = Array.from(selected)
                      column.setFilterValue(next.length ? next : undefined)
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className='h-4 w-4' />
                    </div>

                    {opt.icon && (
                      <opt.icon className='text-muted-foreground mr-2 h-4 w-4' />
                    )}

                    <span>{opt.label}</span>

                    {showCounts && facets?.get(opt.value) && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {facets.get(opt.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    {clearLabel}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
