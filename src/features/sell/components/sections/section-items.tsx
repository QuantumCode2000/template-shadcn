import { UseFormReturn } from 'react-hook-form'
import { SellCreateInput, SellItem } from '../../data/schema'
import { SellItemsTable } from '../sell-items-table'

interface Props {
  form: UseFormReturn<SellCreateInput>
}

export function SectionItems({ form }: Props) {
  const items = form.watch('detalle')
  const setItems = (next: SellItem[]) =>
    form.setValue('detalle', next, { shouldDirty: true, shouldTouch: true })
  return (
    <div className='space-y-4'>
      <div>
        <h4 className='text-sm font-semibold'>Detalle de productos</h4>
        <p className='text-muted-foreground text-xs'>
          Agregue los productos a vender.
        </p>
      </div>
      <SellItemsTable items={items} onChange={setItems} />
    </div>
  )
}
