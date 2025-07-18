// import { IconLoader } from '@tabler/icons-react'
// import { cn } from '@/lib/utils'
// import { FormControl } from '@/components/ui/form'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// interface SelectDropdownProps {
//   onValueChange?: (value: string) => void
//   defaultValue: string | undefined
//   placeholder?: string
//   isPending?: boolean
//   items: { label: string; value: string }[] | undefined
//   disabled?: boolean
//   className?: string
//   isControlled?: boolean
// }
// export function SelectDropdown({
//   defaultValue,
//   onValueChange,
//   isPending,
//   items,
//   placeholder,
//   disabled,
//   className = '',
//   isControlled = false,
// }: SelectDropdownProps) {
//   const defaultState = isControlled
//     ? { value: defaultValue, onValueChange }
//     : { defaultValue, onValueChange }
//   return (
//     <Select {...defaultState}>
//       <FormControl>
//         <SelectTrigger disabled={disabled} className={cn(className)}>
//           <SelectValue placeholder={placeholder ?? 'Select'} />
//         </SelectTrigger>
//       </FormControl>
//       <SelectContent>
//         {isPending ? (
//           <SelectItem disabled value='loading' className='h-14'>
//             <div className='flex items-center justify-center gap-2'>
//               <IconLoader className='h-5 w-5 animate-spin' />
//               {'  '}
//               Loading...
//             </div>
//           </SelectItem>
//         ) : (
//           items?.map(({ label, value }) => (
//             <SelectItem key={value} value={value}>
//               {label}
//             </SelectItem>
//           ))
//         )}
//       </SelectContent>
//     </Select>
//   )
// }
import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
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

interface ComboboxDropdownProps {
  onValueChange?: (value: string) => void
  defaultValue: string | undefined
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items = [],
  placeholder = 'Select',
  disabled,
  className = '',
  isControlled = false,
}: ComboboxDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue || '')
  const [inputValue, setInputValue] = React.useState('')

  const formContext = useFormContext()
  const isInFormContext = !!formContext

  React.useEffect(() => {
    if (isControlled && defaultValue !== undefined) {
      setValue(defaultValue)
    }
  }, [isControlled, defaultValue])

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? '' : currentValue
      setValue(newValue)
      if (onValueChange) {
        onValueChange(newValue)
      }
      setOpen(false)
    },
    [value, onValueChange]
  )

  const selectedLabel = React.useMemo(() => {
    return items?.find((item) => item.value === value)?.label || placeholder
  }, [items, value, placeholder])

  const filteredItems = React.useMemo(() => {
    if (!inputValue) return items

    return items.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }, [items, inputValue])

  const triggerButton = (
    <Button
      variant='outline'
      role='combobox'
      aria-expanded={open}
      disabled={disabled}
      className={cn('w-full justify-between', className)}
    >
      <span
        className={`truncate ${value ? 'font-normal' : 'font-normal text-gray-500'}`}
      >
        {value ? selectedLabel : placeholder}
      </span>
      {isPending ? (
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
          <CommandInput
            placeholder={`Busque y ${placeholder.toLowerCase()}`}
            className='h-9'
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {isPending ? (
                <CommandItem value='loading' disabled>
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Cargando...</span>
                  </span>
                </CommandItem>
              ) : (
                filteredItems?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={handleSelect}
                  >
                    <span>{item.label}</span>
                    <Check
                      className={cn(
                        'ml-auto',
                        value === item.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
