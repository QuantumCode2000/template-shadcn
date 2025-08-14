import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react'
import apiService from '@/lib/apiService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type AnyRecord = Record<string, any>

type MappedItem = { value: string; label: string }

interface AsyncSelectDropdownProps<T = AnyRecord> {
  /** Endpoint de la API, ej: "/empresas" */
  endpoint: string
  /** Nombre del parámetro de búsqueda, ej: "nombre[lk]" */
  searchParam?: string
  /** Parámetros adicionales a enviar en cada request */
  additionalParams?: Record<
    string,
    string | number | boolean | null | undefined
  >
  /** Función para extraer el array de items desde la respuesta */
  extractItems?: (responseData: any) => T[]
  /** Función para mapear cada item del backend a { value, label } */
  mapItem: (item: T) => MappedItem

  /** Comportamiento UI/forma */
  placeholder?: string
  defaultValue?: string
  onValueChange?: (value: string, item?: T) => void
  disabled?: boolean
  className?: string
  isControlled?: boolean

  /** UX de búsqueda */
  minChars?: number // mínimo de caracteres para disparar la búsqueda
  debounceMs?: number // debounce de input
  /** Lista inicial opcional para precargar (ej. cuando ya tienes un valor por defecto) */
  initialItems?: T[]
}

export function AsyncSelectDropdown<T = AnyRecord>({
  endpoint,
  searchParam = 'q',
  additionalParams,
  extractItems = (resp) => resp?.data?.data ?? resp?.data ?? [],
  mapItem,
  placeholder = 'Selecciona',
  defaultValue = '',
  onValueChange,
  disabled,
  className = '',
  isControlled = false,
  minChars = 1,
  debounceMs = 350,
  initialItems,
}: AsyncSelectDropdownProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [inputValue, setInputValue] = React.useState('')
  const [items, setItems] = React.useState<T[]>(initialItems ?? [])
  const [loading, setLoading] = React.useState(false)
  const [fetchedOnce, setFetchedOnce] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const formContext = useFormContext()
  const isInFormContext = !!formContext

  // Mantener controlado si así lo piden
  React.useEffect(() => {
    if (isControlled && defaultValue !== undefined) {
      setValue(defaultValue)
    }
  }, [isControlled, defaultValue])

  // Debounce para input
  const debouncedValue = useDebounced(inputValue, debounceMs)

  // Fetch de items cuando escribe y abre el popover
  React.useEffect(() => {
    if (!open) return
    if (debouncedValue.trim().length < minChars) {
      // Limpiar cuando hay pocos caracteres
      setError(null)
      if (!fetchedOnce) setItems(initialItems ?? [])
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        // parámetros adicionales
        if (additionalParams) {
          Object.entries(additionalParams).forEach(([k, v]) => {
            if (v !== undefined && v !== null) params.append(k, String(v))
          })
        }
        // parámetro de búsqueda
        params.append(searchParam, debouncedValue)

        const url = `${endpoint}?${params.toString()}`
        const resp = await apiService.get(url)
        if (!resp.ok) throw new Error(resp.message || 'Error de búsqueda')

        const list = extractItems(resp)
        setItems(Array.isArray(list) ? list : [])
        setFetchedOnce(true)
      } catch (e: any) {
        setError(e?.message ?? 'Error al cargar opciones')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, debouncedValue, endpoint, searchParam])

  const mappedItems = React.useMemo<MappedItem[]>(() => {
    return items.map((it) => mapItem(it))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, mapItem])

  const selectedLabel = React.useMemo(() => {
    if (!value) return placeholder
    return mappedItems.find((m) => m.value === value)?.label ?? placeholder
  }, [mappedItems, value, placeholder])

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? '' : currentValue
      setValue(newValue)
      if (onValueChange) {
        const original = items.find((it) => mapItem(it).value === newValue)
        onValueChange(newValue, original)
      }
      setOpen(false)
    },
    [value, onValueChange, items, mapItem]
  )

  const triggerButton = (
    <Button
      variant='outline'
      role='combobox'
      aria-expanded={open}
      disabled={disabled}
      className={cn('w-full justify-between', className)}
      onClick={() => setOpen((p) => !p)}
      type='button'
    >
      <span className={cn('truncate', !value && 'text-gray-500')}>
        {value ? selectedLabel : placeholder}
      </span>
      {loading ? (
        <Loader2 className='ml-2 h-4 w-4 shrink-0 animate-spin' />
      ) : (
        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      )}
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        {isInFormContext ? (
          <FormControl>{triggerButton}</FormControl>
        ) : (
          triggerButton
        )}
      </PopoverTrigger>

      <PopoverContent className='w-full p-0' align='start'>
        <Command shouldFilter={false}>
          <div className='flex items-center gap-2 px-2 pt-2'>
            <Search className='h-4 w-4 opacity-60' />
            <CommandInput
              placeholder={`Busca y ${placeholder.toLowerCase()}`}
              className='h-9'
              value={inputValue}
              onValueChange={setInputValue}
            />
          </div>

          <CommandList>
            {error ? (
              <CommandEmpty>Error: {error}</CommandEmpty>
            ) : debouncedValue.trim().length < minChars && !loading ? (
              <CommandEmpty>
                Escribe al menos {minChars} caracter{minChars > 1 ? 'es' : ''}…
              </CommandEmpty>
            ) : (
              <CommandEmpty>
                {loading ? 'Cargando…' : 'No se encontraron resultados.'}
              </CommandEmpty>
            )}

            <CommandGroup>
              {mappedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                >
                  <span className='truncate'>{item.label}</span>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              {loading && (
                <CommandItem value='loading' disabled>
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Cargando…</span>
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

/** Hook sencillo de debounce */
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
