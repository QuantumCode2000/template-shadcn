import { useEffect } from 'react'
import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { SellForm } from './components/sell-form'
import { useSellUIStore } from './stores/sell-ui-store'

export default function SellPage() {
  const { dirty } = useSellUIStore()

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  return (
    <>
      <HeaderMain />
      <Main>
        <div className='mb-6'>
          <h1 className='text-lg font-semibold'>Hacer una venta</h1>
          <p className='text-muted-foreground text-sm'>
            Complete el formulario para registrar una nueva venta.
          </p>
        </div>
        <SellForm />
      </Main>
    </>
  )
}
