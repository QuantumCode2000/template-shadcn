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
import { NewCompany, newCompanySchema } from '@/features/companies/data/schema'

interface CompanyCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyCreateDialog({
  open,
  onOpenChange,
}: CompanyCreateDialogProps) {
  const { createCompany } = useCompanies()

  const form = useForm<NewCompany>({
    resolver: zodResolver(newCompanySchema),
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

  const onSubmit = async (values: NewCompany) => {
    try {
      await createCompany(values)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating company:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Empresa</DialogTitle>
          <DialogDescription>
            Complete los datos para crear una nueva empresa
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='company-form'
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
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>1 - Producción</SelectItem>
                        <SelectItem value='2'>2 - Pruebas y Piloto</SelectItem>
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
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>1 - En línea</SelectItem>
                        {/* <SelectItem value='2'>
                          2 - Computarizada en lote
                        </SelectItem> */}
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
          <Button type='submit' form='company-form'>
            Crear Empresa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
