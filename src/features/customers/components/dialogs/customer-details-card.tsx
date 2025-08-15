import { formatDateTime } from '@/lib/date-format'
import { useCustomerById, useDocTypes } from '../../hooks/use-customers'

interface Props {
  id: number | null
}

export function CustomerDetailsCard({ id }: Props) {
  const { data, isLoading } = useCustomerById(id)
  const { data: docTypes = [] } = useDocTypes()

  if (!id) return null
  if (isLoading)
    return (
      <div className='text-muted-foreground text-sm'>Cargando detalles…</div>
    )
  if (!data)
    return <div className='text-muted-foreground text-sm'>Sin datos.</div>

  const docType = docTypes.find(
    (d) => d.codigoSin === data.codigoDocumentoIdentidadSin
  )

  return (
    <div className='bg-card rounded-2xl border p-6 shadow-sm'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
        <h3 className='text-base font-semibold'>Detalles del cliente</h3>
        <div className='text-muted-foreground text-xs'>
          Última actualización: {formatDateTime(data.updatedAt)}
        </div>
      </div>
      <div className='grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2'>
        <Field
          label='Tipo de documento'
          value={docType?.descripcionSin || data.codigoDocumentoIdentidadSin}
        />
        <Field
          label='Número de documento'
          value={data.numeroDocumentoIdentidad}
        />
        {data.complemento && (
          <Field label='Complemento' value={data.complemento} />
        )}
        <Field label='Razón social' value={data.razonSocial} />
        {data.celular && <Field label='Celular' value={data.celular} />}
        {data.email && <Field label='Email' value={data.email} />}
        <Field label='Creado' value={formatDateTime(data.createdAt)} />
        <Field label='Actualizado' value={formatDateTime(data.updatedAt)} />
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
        {label}
      </span>
      <span className='text-foreground font-medium break-all'>
        {value ?? '—'}
      </span>
    </div>
  )
}
