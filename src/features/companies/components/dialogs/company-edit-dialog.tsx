import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCompanies } from '@/features/companies/context/use-companies'
import {
  Company,
  UpdateCompany,
  updateCompanySchema,
} from '@/features/companies/data/schema'

interface CompanyEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

export function CompanyEditDialog({
  open,
  onOpenChange,
  company,
}: CompanyEditDialogProps) {
  const { updateCompany } = useCompanies()

  const form = useForm<UpdateCompany>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      nit: 0,
      codigoSistemaSin: '',
      codigoAmbienteSin: 1,
      codigoModalidadSin: 1,
      tokenDelegado: '',
    },
  })

  useEffect(() => {
    if (company && open) {
      form.reset({
        codigo: company.codigo,
        nombre: company.nombre,
        descripcion: company.descripcion,
        nit: company.nit,
        codigoSistemaSin: company.codigoSistemaSin,
        codigoAmbienteSin: company.codigoAmbienteSin,
        codigoModalidadSin: company.codigoModalidadSin,
        tokenDelegado: company.tokenDelegado,
      })
    }
  }, [company, open, form])

  const onSubmit = async (values: UpdateCompany) => {
    if (!company) return

    try {
      await updateCompany({ id: company.id, body: values })
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating company:', error)
    }
  }

  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Modifique los datos de la empresa
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='company-edit-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {/* Código */}
            <FormField
              control={form.control}
              name='codigo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder='4001' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre */}
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder='Nombre de la empresa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name='descripcion'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descripción de la empresa'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NIT */}
            <FormField
              control={form.control}
              name='nit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='51441111'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código Sistema SIN */}
            <FormField
              control={form.control}
              name='codigoSistemaSin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Sistema SIN</FormLabel>
                  <FormControl>
                    <Input placeholder='12312312312' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              {/* Código Ambiente SIN */}
              <FormField
                control={form.control}
                name='codigoAmbienteSin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente SIN</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>1 - Producción</SelectItem>
                        <SelectItem value='2'>2 - Pruebas</SelectItem>
                        {/* <SelectItem value='3'>3 - Desarrollo</SelectItem>
                        <SelectItem value='4'>4 - Capacitación</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Código Modalidad SIN */}
              <FormField
                control={form.control}
                name='codigoModalidadSin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad SIN</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>
                          1 - Computarizada en línea
                        </SelectItem>
                        <SelectItem value='2'>
                          2 - Computarizada en lote
                        </SelectItem>
                        {/* <SelectItem value='3'>
                          3 - Electrónica fuera de línea
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Token Delegado */}
            <FormField
              control={form.control}
              name='tokenDelegado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Delegado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Token delegado del SIN'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type='submit' form='company-edit-form'>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
