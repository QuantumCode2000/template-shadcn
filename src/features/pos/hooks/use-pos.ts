import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { posApi } from '../lib/pos-service'

export function usePosList() {
  return useQuery({ queryKey: ['pos'], queryFn: posApi.list })
}

export function usePosById(id: number | null) {
  return useQuery({
    queryKey: ['pos', id],
    queryFn: () => (id ? posApi.get(id) : Promise.reject('no-id')),
    enabled: !!id,
  })
}

export function useDeletePos() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => posApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pos'] })
    },
  })
}
