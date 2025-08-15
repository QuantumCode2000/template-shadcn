import { createFileRoute } from '@tanstack/react-router'
import PosList from '@/features/pos'

export const Route = createFileRoute('/_authenticated/pos/')({
  component: PosList,
})
