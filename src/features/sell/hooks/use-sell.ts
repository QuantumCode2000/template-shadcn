import Cookies from 'js-cookie'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { decodeToken } from '@/lib/jwtUtils'
import type { SellCreateInput } from '../data/schema'
import { sellCreateSchema } from '../data/schema'
import { sellService } from '../lib/sell-service'

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

export function useEmpresaId() {
  return getEmpresaId()
}

export function useBranches() {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ['sell', 'branches', empresaId],
    queryFn: () => sellService.fetchBranches(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 10,
  })
}
export function usePosList() {
  return useQuery({
    queryKey: ['sell', 'pos'],
    queryFn: sellService.fetchPos,
    staleTime: 1000 * 60 * 10,
  })
}
export function useDocActivity() {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ['sell', 'doc-act', empresaId],
    queryFn: () => sellService.fetchDocAct(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 10,
  })
}
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['sell', 'payment-methods'],
    queryFn: sellService.fetchPaymentMethods,
    staleTime: 1000 * 60 * 10,
  })
}
export function useCurrencies() {
  return useQuery({
    queryKey: ['sell', 'currencies'],
    queryFn: sellService.fetchCurrencies,
    staleTime: 1000 * 60 * 10,
  })
}
export function useProducts() {
  const empresaId = useEmpresaId()
  return useQuery({
    queryKey: ['sell', 'products', empresaId],
    queryFn: () => sellService.fetchProducts(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5,
  })
}
export function useCustomerById(id: number | null) {
  return useQuery({
    queryKey: ['sell', 'customer', id],
    queryFn: () =>
      id ? sellService.fetchCustomerById(id) : Promise.reject('no-id'),
    enabled: !!id,
  })
}

export function useCreateSell() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: SellCreateInput) =>
      sellService.create(sellCreateSchema.parse(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}
