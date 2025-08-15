import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { salesApi } from '../lib/sales-service'

export function useSalesList() {
  return useQuery({ queryKey: ['sales'], queryFn: salesApi.list })
}

export function useSaleById(id: number | null) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => (id ? salesApi.get(id) : Promise.reject('no-id')),
    enabled: !!id,
  })
}

export function useCreateSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => salesApi.create(body),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.setQueryData(['sales', created.id], created)
    },
  })
}
