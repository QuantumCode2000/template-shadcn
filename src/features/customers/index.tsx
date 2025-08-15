import HeaderMain from '@/components/header-main'
import { Main } from '@/components/layout/main'
import { CustomersDialogs } from './components/customers-dialogs'
import { CustomersPanels } from './components/customers-panels'

export default function CustomersIndex() {
  return (
    <>
      <HeaderMain />
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Clientes</h2>
          <p className='text-muted-foreground'>
            Busca y gestiona tus clientes.
          </p>
        </div>
        <CustomersPanels />
      </Main>
      <CustomersDialogs />
    </>
  )
}
