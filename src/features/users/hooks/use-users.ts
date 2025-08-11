import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NewUser } from '@/features/users/data/schema'
import { usersApi } from '../lib/users-service'

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

  /* ---- create ---- */
  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: (newUser) => {
      // actualiza cache optimista
      qc.setQueryData(['users'], (old: any = []) => [newUser, ...old])
    },
  })

  /* ---- update ---- */
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: any }) =>
      usersApi.update(id, body),
    onSuccess: (updated) => {
      qc.setQueryData(['users'], (old: any = []) =>
        old.map((u: any) => (u.id === updated.id ? updated : u))
      )
    },
  })

  return {
    data,
    isLoading,
    error,
    createUser: (u: NewUser) => createMutation.mutateAsync(u),
    updateUser: updateMutation.mutateAsync,
    refetch: () => qc.invalidateQueries({ queryKey: ['users'] }),
  }
}
