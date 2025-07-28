import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Company } from '@/features/company/data/schema'

interface CompanyViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

const getAmbienteText = (codigo: number) => {
  switch (codigo) {
    case 1:
      return 'Producción'
    case 2:
      return 'Pruebas'
    case 3:
      return 'Desarrollo'
    case 4:
      return 'Capacitación'
    default:
      return 'Desconocido'
  }
}

const getModalidadText = (codigo: number) => {
  switch (codigo) {
    case 1:
      return 'Computarizada en línea'
    case 2:
      return 'Computarizada en lote'
    case 3:
      return 'Electrónica fuera de línea'
    default:
      return 'Desconocido'
  }
}

export function CompanyViewDialog({
  open,
  onOpenChange,
  company,
}: CompanyViewDialogProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            Detalles de la Empresa
            <Badge variant={company.activo ? 'default' : 'secondary'}>
              {company.activo ? 'Activa' : 'Inactiva'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa de la empresa
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Información básica */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-muted-foreground text-sm font-medium'>
                Código
              </label>
              <p className='text-sm'>{company.codigo}</p>
            </div>
            <div>
              <label className='text-muted-foreground text-sm font-medium'>
                NIT
              </label>
              <p className='text-sm'>{company.nit}</p>
            </div>
          </div>

          <div>
            <label className='text-muted-foreground text-sm font-medium'>
              Nombre
            </label>
            <p className='text-sm'>{company.nombre}</p>
          </div>

          <div>
            <label className='text-muted-foreground text-sm font-medium'>
              Descripción
            </label>
            <p className='text-sm whitespace-pre-wrap'>{company.descripcion}</p>
          </div>

          {/* Información del SIN */}
          <div className='border-t pt-4'>
            <h4 className='mb-3 text-sm font-medium'>Información del SIN</h4>

            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Código Sistema SIN
                </label>
                <p className='font-mono text-sm'>{company.codigoSistemaSin}</p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Ambiente SIN
                </label>
                <p className='text-sm'>
                  {company.codigoAmbienteSin} -{' '}
                  {getAmbienteText(company.codigoAmbienteSin)}
                </p>
              </div>
            </div>

            <div className='mb-4'>
              <label className='text-muted-foreground text-sm font-medium'>
                Modalidad SIN
              </label>
              <p className='text-sm'>
                {company.codigoModalidadSin} -{' '}
                {getModalidadText(company.codigoModalidadSin)}
              </p>
            </div>

            <div>
              <label className='text-muted-foreground text-sm font-medium'>
                Token Delegado
              </label>
              <div className='bg-muted mt-1 rounded-md p-3'>
                <p className='font-mono text-sm break-all'>
                  {company.tokenDelegado}
                </p>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className='border-t pt-4'>
            <h4 className='mb-3 text-sm font-medium'>
              Información del Sistema
            </h4>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Creado por
                </label>
                <p>Usuario #{company.createdBy}</p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Actualizado por
                </label>
                <p>Usuario #{company.updatedBy}</p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Fecha de creación
                </label>
                <p>
                  {format(new Date(company.createdAt), 'PPP p', { locale: es })}
                </p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Última actualización
                </label>
                <p>
                  {format(new Date(company.updatedAt), 'PPP p', { locale: es })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
