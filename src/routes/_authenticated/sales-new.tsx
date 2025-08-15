import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sales-new')({
  beforeLoad: () => {
    throw redirect({ to: '/sell' })
  },
  component: () => null,
})
