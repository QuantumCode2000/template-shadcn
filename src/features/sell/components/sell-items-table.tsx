import { useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { SellItem } from '../data/schema'
import { useProducts } from '../hooks/use-sell'

interface Props {
  items: SellItem[]
  onChange: (next: SellItem[]) => void
}

export function SellItemsTable({ items, onChange }: Props) {
  const update = useCallback(
    (index: number, patch: Partial<SellItem>) => {
      const next = [...items]
      next[index] = { ...next[index], ...patch }
      onChange(next)
    },
    [items, onChange]
  )

  const remove = (index: number) => {
    const next = items.filter((_, i) => i !== index)
    onChange(next)
  }

  const add = () => {
    onChange([
      ...items,
      { productoId: 0, cantidad: 1, montoDescuento: null, precioUnitario: 0 },
    ])
  }

  const productsQuery = useProducts()
  const productItems = useMemo(() => {
    const arr = Array.isArray(productsQuery.data) ? productsQuery.data : []
    return arr.map((p: any) => ({
      label: `${p.codigo || p.id} – ${p.descripcion}`,
      value: String(p.id),
      precio: parseFloat(p.precioUnitario || p.precio || '0') || 0,
      unidad: p.unidadMedida?.descripcionSin,
    }))
  }, [productsQuery.data])

  const handleSelectProduct = (rowIndex: number, value: string) => {
    const prod = productItems.find((p) => p.value === value)
    update(rowIndex, {
      productoId: prod ? parseInt(value) : 0,
      precioUnitario: prod?.precio || 0,
    })
  }

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        {items.map((it, i) => (
          <div
            key={i}
            className='grid grid-cols-12 gap-2 rounded-md border p-3'
          >
            <div className='col-span-5'>
              <label className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
                Producto *
              </label>
              <SelectDropdown
                placeholder='Seleccione producto'
                defaultValue={it.productoId ? String(it.productoId) : ''}
                onValueChange={(v) => handleSelectProduct(i, v)}
                items={productItems}
                isControlled
                isPending={productsQuery.isLoading}
              />
              {it.precioUnitario != null && it.precioUnitario > 0 && (
                <p className='text-muted-foreground mt-1 text-[10px]'>
                  Precio: {it.precioUnitario.toFixed(2)}
                </p>
              )}
            </div>
            <div className='col-span-3'>
              <label className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
                Cantidad *
              </label>
              <Input
                type='number'
                value={it.cantidad ? String(it.cantidad) : ''}
                onChange={(e) =>
                  update(i, { cantidad: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className='col-span-3'>
              <label className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
                Desc. (opcional)
              </label>
              <Input
                type='number'
                value={
                  it.montoDescuento == null ? '' : String(it.montoDescuento)
                }
                onChange={(e) =>
                  update(i, {
                    montoDescuento: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div className='col-span-1 flex items-end'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => remove(i)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type='button' variant='secondary' onClick={add}>
        Agregar ítem
      </Button>
    </div>
  )
}
