import { useMemo } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { decodeToken } from '@/lib/jwtUtils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { CompanyInformation } from './company-information'
// import { TeamSwitcher } from '@/components/layout/team-switcher'
import { getSidebarData } from './data/sidebar-data'
import { useCompanyInfo } from './hooks/use-company-info'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { accessToken } = useAuthStore((state) => state.auth)

  const userInfo = useMemo(() => {
    if (accessToken) {
      return decodeToken(accessToken)
    }
    return null
  }, [accessToken])

  const companyInfo = useCompanyInfo(userInfo?.empresaId)

  const sidebarData = useMemo(() => {
    return getSidebarData(userInfo, companyInfo)
  }, [userInfo, companyInfo])

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={sidebarData.teams} />
         */}
        <CompanyInformation
          companyInformation={sidebarData.companyInformation}
        />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
