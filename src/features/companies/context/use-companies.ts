// hooks/use-companies.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NewCompany } from '@/features/companies/data/schema'
import { companiesApi } from '../lib/companies-service'

export function useCompanies() {
  const qc = useQueryClient()

  /* ---- list ---- */
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('useQuery: fetching companies...')
      try {
        const result = await companiesApi.list()
        console.log('useQuery: companies result:', result)
        return result
      } catch (err) {
        console.error('useQuery: error fetching companies:', err)
        throw err
      }
    },
  })

  console.log(
    'useCompanies hook - data:',
    data,
    'isLoading:',
    isLoading,
    'error:',
    error
  )

  /* ---- create ---- */
  const createMutation = useMutation({
    mutationFn: companiesApi.create,
    onSuccess: (newCompany) => {
      // actualiza cache optimista
      qc.setQueryData(['companies'], (old: any = []) => [newCompany, ...old])
    },
  })

  /* ---- update ---- */
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: any }) =>
      companiesApi.update(id, body),
    onSuccess: (updated) => {
      qc.setQueryData(['companies'], (old: any = []) =>
        old.map((c: any) => (c.id === updated.id ? updated : c))
      )
    },
  })

  /* ---- delete ---- */
  const deleteMutation = useMutation({
    mutationFn: companiesApi.delete,
    onSuccess: (_, deletedId) => {
      qc.setQueryData(['companies'], (old: any = []) =>
        old.filter((c: any) => c.id !== deletedId)
      )
    },
  })

  return {
    data,
    isLoading,
    error,
    createCompany: (c: NewCompany) => createMutation.mutateAsync(c),
    updateCompany: updateMutation.mutateAsync,
    deleteCompany: (id: string | number) => deleteMutation.mutateAsync(id),
    refetch: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  }
}
