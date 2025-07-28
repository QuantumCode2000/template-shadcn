import { Command } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type CompanyInformation as CompanyInfo } from './types'

export function CompanyInformation({
  companyInformation,
}: {
  companyInformation: CompanyInfo
}) {
  const LogoComponent =
    typeof companyInformation.logo === 'string'
      ? () => (
          <img
            src={companyInformation.logo as string}
            alt='Company Logo'
            className='size-4 object-contain'
          />
        )
      : companyInformation.logo || Command

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='cursor-default'>
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <LogoComponent className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {companyInformation.name}
            </span>
            <span className='truncate text-xs'>{companyInformation.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
