import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NewUser, UpdateUser, User } from '@/features/users/data/schema'
import { usersApi } from '../lib/users-service'

// Nota: Antes se hacía una actualización optimista agregando el nuevo usuario directamente al cache.
// Eso provocaba que apareciera una fila con datos incompletos ("Sin empresa", "Sin rol") porque
// el backend todavía no había procesado/enriquecido la entidad. Ahora esperamos la confirmación
// del servidor (refetch) para mostrar datos consistentes.

export function useUsers() {
  const qc = useQueryClient()

  /* ---- list ---- */
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  })

  /* ---- create (sin inserción optimista para evitar datos incompletos) ---- */
  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      // Fuerza refetch para obtener la versión final del backend
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })

  /*
   * Si más adelante quieres volver a una versión "optimista" pero marcando el registro como
   * pendiente, podrías usar algo como:
   *
   * const createMutation = useMutation({
   *   mutationFn: usersApi.create,
   *   onMutate: async (vars) => {
   *     await qc.cancelQueries({ queryKey: ['users'] })
   *     const prev = qc.getQueryData(['users'])
   *     const optimistic = { id: `temp-${Date.now()}`, ...vars, activo: true, empresaId: vars.empresaId, __optimistic: true }
   *     qc.setQueryData(['users'], (old: any = []) => [optimistic, ...old])
   *     return { prev }
   *   },
   *   onError: (_err, _vars, ctx) => {
   *     if (ctx?.prev) qc.setQueryData(['users'], ctx.prev)
   *   },
   *   onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
   * })
   */

  /* ---- get single (para edición) ---- */
  const getUser = async (id: number | string): Promise<User> => {
    return usersApi.get(id)
  }

  /* ---- update ---- */
  /* ---- update (sin optimista: refetch para datos consistentes) ---- */
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string | number
      body: Partial<UpdateUser>
    }) => usersApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    data,
    isLoading,
    error,
    createUser: (u: NewUser) => createMutation.mutateAsync(u),
    getUser,
    updateUser: updateMutation.mutateAsync,
    refetch: () => qc.invalidateQueries({ queryKey: ['users'] }),
  }
}
