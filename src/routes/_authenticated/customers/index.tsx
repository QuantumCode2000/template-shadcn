import { createFileRoute } from '@tanstack/react-router'
import CustomersIndex from '@/features/customers'

export const Route = createFileRoute('/_authenticated/customers/')({
  component: CustomersIndex,
})
