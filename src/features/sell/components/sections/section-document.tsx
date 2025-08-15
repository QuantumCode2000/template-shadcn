import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { SellCreateInput } from '../../data/schema'

interface Props {
  form: UseFormReturn<SellCreateInput>
  docAct: any
}

export function SectionDocument({ form, docAct }: Props) {
  const currentDoc = form.watch('codigoDocumentoSectorSin')
  const raw = docAct?.data || docAct || {}
  const documentosSector: any[] = Array.isArray(raw.documentosSector)
    ? raw.documentosSector
    : []
  const documentosActividadesSector: any[] = Array.isArray(
    raw.documentosActividadesSector
  )
    ? raw.documentosActividadesSector
    : []

  const docItems = documentosSector.map((d: any) => ({
    label: d.descripcion_sin || d.descripcion || `Doc ${d.codigo_sin}`,
    value: String(d.codigo_sin),
  }))

  const actividadItems = useMemo(() => {
    if (!currentDoc)
      return documentosActividadesSector.map((a: any) => ({
        label:
          a.descripcion_actividad_sin ||
          a.descripcion_actividad ||
          a.descripcionActividad ||
          a.descripcion ||
          `Act ${a.codigo_actividad_sin || a.codigoActividadEconomicaSin}`,
        value: String(
          a.codigo_actividad_sin || a.codigoActividadEconomicaSin || a.id
        ),
      }))
    return documentosActividadesSector
      .filter(
        (a: any) =>
          (a.codigo_documento_sector_sin || a.codigoDocumentoSectorSin) ===
          currentDoc
      )
      .map((a: any) => ({
        label:
          a.descripcion_actividad_sin ||
          a.descripcion_actividad ||
          a.descripcionActividad ||
          a.descripcion ||
          `Act ${a.codigo_actividad_sin || a.codigoActividadEconomicaSin}`,
        value: String(
          a.codigo_actividad_sin || a.codigoActividadEconomicaSin || a.id
        ),
      }))
  }, [documentosActividadesSector, currentDoc])

  if (!documentosSector.length) {
    return (
      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-semibold'>Documento</h4>
          <p className='text-muted-foreground text-xs'>
            No hay documentos sector disponibles.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div>
        <h4 className='text-sm font-semibold'>Documento</h4>
        <p className='text-muted-foreground text-xs'>
          Documento sector y actividad económica.
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormField
          name='codigoDocumentoSectorSin'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento sector *</FormLabel>
              <SelectDropdown
                placeholder='Seleccione documento'
                defaultValue={field.value ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                items={docItems}
                isControlled
              />
              {field.value ? (
                <p className='text-muted-foreground mt-1 text-[10px]'>
                  Seleccionado:{' '}
                  {docItems.find((d) => d.value === String(field.value))?.label}
                </p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='codigoActividadEconomicaSin'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actividad económica *</FormLabel>
              <SelectDropdown
                placeholder='Seleccione actividad'
                defaultValue={field.value ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                items={actividadItems}
                isControlled
              />
              {field.value ? (
                <p className='text-muted-foreground mt-1 text-[10px]'>
                  Seleccionada:{' '}
                  {
                    actividadItems.find((a) => a.value === String(field.value))
                      ?.label
                  }
                </p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
