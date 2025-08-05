interface User {
  name: string
  email: string
  avatar: string
}

interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: string // Cambiado de LinkProps['to'] a string para permitir URLs dinámicas
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[] // Cambiado también aquí
  url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
  title: string
  items: NavItem[]
}

interface CompanyInformation {
  name: string
  logo: React.ElementType | string
  plan: string
}

interface SidebarData {
  user: User
  teams: Team[]
  companyInformation: CompanyInformation
  navGroups: NavGroup[]
}

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavCollapsible,
  NavLink,
  CompanyInformation,
}
