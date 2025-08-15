import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiService from '@/lib/apiService'
import { decodeToken } from '@/lib/jwtUtils'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { usePosUI } from '../../stores/pos-ui-store'

// Schema for create
const posCreateSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  tipo: z.number().min(1, 'Seleccione un tipo'),
  sucursalId: z.number().min(1, 'Seleccione una sucursal'),
})
type PosCreateInput = z.infer<typeof posCreateSchema>

function getEmpresaId(): number | null {
  try {
    const cookieToken = Cookies.get('thisisjustarandomstring')
    if (!cookieToken) return null
    const token = JSON.parse(cookieToken)
    const decoded = decodeToken(token)
    return decoded?.empresaId || null
  } catch {
    return null
  }
}

async function fetchBranches(empresaId: number | null) {
  if (!empresaId) return []
  const res = await apiService.get<any>(
    `/sucursales?empresa_id[eq]=${empresaId}`
  )
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}

async function fetchPosTypes() {
  const res = await apiService.get<any>('/sincronizacion/tipos-punto-venta')
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}

export function PosCreateDialog() {
  const { open, setOpen } = usePosUI()
  const empresaId = getEmpresaId()
  const qc = useQueryClient()
  const branchesQuery = useQuery({
    queryKey: ['branches', empresaId],
    queryFn: () => fetchBranches(empresaId),
    enabled: !!empresaId,
  })
  const typesQuery = useQuery({
    queryKey: ['pos-types'],
    queryFn: fetchPosTypes,
  })

  const form = useForm<PosCreateInput>({
    resolver: zodResolver(posCreateSchema),
    defaultValues: { nombre: '', tipo: 0, sucursalId: 0 },
  })

  const createMutation = useMutation({
    mutationFn: async (body: PosCreateInput) => {
      const res = await apiService.post<any>('/puntos-venta', body)
      if (!res.ok) throw new Error(res.message)
      return res.data?.data || res.data || res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pos'] })
    },
  })

  const handleChange = (v: boolean) => {
    if (!v) {
      form.reset()
      setOpen(null)
    }
  }

  const onSubmit = async (values: PosCreateInput) => {
    try {
      await createMutation.mutateAsync(values)
      toast.success('Punto de venta creado')
      setOpen(null)
    } catch (e: any) {
      toast.error(e.message || 'Error al crear')
    }
  }

  const branchItems = (branchesQuery.data || []).map((b: any) => ({
    label: b.nombre || `Sucursal ${b.id}`,
    value: String(b.id),
  }))
  const typeItems = (typesQuery.data || []).map((t: any) => ({
    label: t.descripcion || t.descripcionSin || `Tipo ${t.codigoSin || t.id}`,
    value: String(t.codigoSin || t.id),
  }))

  return (
    <Dialog open={open === 'create'} onOpenChange={handleChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Crear punto de venta</DialogTitle>
          <DialogDescription>
            Complete los campos para registrar un nuevo punto de venta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='pos-create-form'
            className='space-y-4'
          >
            <FormField
              name='nombre'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <Input placeholder='Nombre del punto de venta' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='tipo'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <SelectDropdown
                    placeholder='Seleccione tipo'
                    defaultValue={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                    items={typeItems}
                    isControlled
                    isPending={typesQuery.isLoading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='sucursalId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal *</FormLabel>
                  <SelectDropdown
                    placeholder='Seleccione sucursal'
                    defaultValue={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                    items={branchItems}
                    isControlled
                    isPending={branchesQuery.isLoading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={() => setOpen(null)}>
            Cancelar
          </Button>
          <Button
            type='submit'
            form='pos-create-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando…' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
