import { createFileRoute } from '@tanstack/react-router'
import SalesIndex from '@/features/sales'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: SalesIndex,
})
