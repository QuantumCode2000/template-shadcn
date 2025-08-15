import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { SelectDropdown } from '@/components/select-dropdown'
import {
  customerCreateSchema,
  type CustomerCreateInput,
} from '../../data/schema'
import { useCreateCustomer, useDocTypes } from '../../hooks/use-customers'
import { useCustomersUI } from '../../stores/customers-ui-store'

export function CustomerQuickCreateDialog() {
  const { openQuickCreate, setOpenQuickCreate, setSelectedCustomerId } =
    useCustomersUI()
  const { data: docTypes = [] } = useDocTypes()
  const createMutation = useCreateCustomer()

  const form = useForm<CustomerCreateInput>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      codigoDocumentoIdentidadSin: 0,
      numeroDocumentoIdentidad: '',
      complemento: '',
      razonSocial: '',
      celular: '',
      email: '',
    },
  })

  const handleChange = (v: boolean) => {
    if (!v) {
      form.reset()
      setOpenQuickCreate(false)
    }
  }

  const onSubmit = async (values: CustomerCreateInput) => {
    try {
      const created = await createMutation.mutateAsync(values)
      toast.success('Cliente creado')
      setOpenQuickCreate(false)
      setSelectedCustomerId(created.id)
    } catch (e: any) {
      toast.error(e.message || 'Error al crear cliente')
    }
  }

  const docTypeItems = docTypes.map((d) => ({
    label: d.descripcionSin,
    value: String(d.codigoSin),
  }))

  return (
    <Dialog open={openQuickCreate} onOpenChange={handleChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
          <DialogDescription>
            Registra un nuevo cliente en el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='customer-quick-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              name='codigoDocumentoIdentidadSin'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento *</FormLabel>
                  <SelectDropdown
                    placeholder='Seleccione tipo'
                    defaultValue={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                    items={docTypeItems}
                    isControlled
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='numeroDocumentoIdentidad'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de documento *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='12345678' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='complemento'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder='(Opcional)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='razonSocial'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Nombre o razón social' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='celular'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder='7xxxxxxx'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      type='email'
                      placeholder='user@example.com'
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
            variant='outline'
            type='button'
            onClick={() => setOpenQuickCreate(false)}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            form='customer-quick-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando…' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
