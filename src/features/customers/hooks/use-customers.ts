import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CustomerCreateInput } from '../data/schema'
import { customersApi } from '../lib/customers-service'

export function useCustomerTypeahead(query: string) {
  return useQuery({
    queryKey: ['customers:typeahead', query],
    queryFn: () => customersApi.typeahead(query),
    enabled: query.trim().length > 0,
  })
}

export function useCustomerById(id: number | null) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => (id ? customersApi.get(id) : Promise.reject('no-id')),
    enabled: !!id,
  })
}

export function useDocTypes() {
  return useQuery({
    queryKey: ['customers:doc-types'],
    queryFn: customersApi.getDocTypes,
    staleTime: 1000 * 60 * 60, // 1h
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CustomerCreateInput) => customersApi.create(body),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['customers:typeahead'] })
      qc.setQueryData(['customers', created.id], created)
    },
  })
}
