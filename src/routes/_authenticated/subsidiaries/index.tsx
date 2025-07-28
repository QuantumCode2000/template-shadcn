import { createFileRoute } from '@tanstack/react-router'
import Subsidiaries from '@/features/subsidiaries'

export const Route = createFileRoute('/_authenticated/subsidiaries/')({
  component: Subsidiaries,
})
