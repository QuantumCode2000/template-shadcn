import { Button } from '@/components/ui/button'
import { AsyncSelectDropdown } from '@/components/async-select-dropdown'
import { useCustomersUI } from '../stores/customers-ui-store'
import { CustomerDetailsCard } from './dialogs/customer-details-card'

export function CustomersPanels() {
  const { setOpenQuickCreate, selectedCustomerId, setSelectedCustomerId } =
    useCustomersUI()

  return (
    <div className='space-y-6'>
      <div className='flex items-end gap-4'>
        <div className='flex-1'>
          <label className='mb-1 block text-sm font-medium'>
            Buscar cliente
          </label>
          {/* Placeholder for AsyncSelectDropdown integration; adapt once fully wired */}
          <AsyncSelectDropdown
            endpoint='/clientes'
            searchParam='numero_documento_identidad[lk]'
            placeholder='Buscar por número de documento'
            mapItem={(c: any) => ({
              value: String(c.id),
              label:
                `${c.numeroDocumentoIdentidad || c.numero_documento_identidad} – ${c.razonSocial || c.razon_social}`.trim(),
            })}
            onValueChange={(value) => {
              if (value) setSelectedCustomerId(Number(value))
            }}
          />
        </div>
        <Button type='button' onClick={() => setOpenQuickCreate(true)}>
          Crear cliente
        </Button>
      </div>

      <CustomerDetailsCard id={selectedCustomerId} />
    </div>
  )
}
