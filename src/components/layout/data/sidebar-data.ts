import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconBuilding,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconBuildingStore,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type DecodedToken } from '@/lib/jwtUtils'
import { type SidebarData, type CompanyInformation } from '../types'

export const getDefaultCompanyInfo = (): CompanyInformation => ({
  name: 'Codex - Facturación',
  logo: Command,
  plan: 'by Sinergya America S.R.L.',
})

export const getSidebarData = (
  userInfo?: DecodedToken | null,
  companyInfo?: CompanyInformation
): SidebarData => {
  return {
    user: {
      name: userInfo?.nombre || 'Usuario',
      email: userInfo?.email || 'No email disponible',
      avatar: '/avatars/shadcn.jpg',
    },
    companyInformation: companyInfo || getDefaultCompanyInfo(),
    teams: [
      {
        name: 'Codex - Facturación',
        logo: Command,
        plan: 'by Sinergya America S.R.L.',
      },
      // {
      //   name: 'Acme Inc',
      //   logo: GalleryVerticalEnd,
      //   plan: 'Enterprise',
      // },
      // {
      //   name: 'Acme Corp.',
      //   logo: AudioWaveform,
      //   plan: 'Startup',
      // },
    ],
    navGroups: [
      {
        title: 'General',
        items: [
          // {
          //   title: 'Dashboard',
          //   url: '/',
          //   icon: IconLayoutDashboard,
          // },
          // {
          //   title: 'Tasks',
          //   url: '/tasks',
          //   icon: IconChecklist,
          // },
          // {
          //   title: 'Apps',
          //   url: '/apps',
          //   icon: IconPackages,
          // },
          // {
          //   title: 'Chats',
          //   url: '/chats',
          //   badge: '3',
          //   icon: IconMessages,
          // },
          {
            title: 'Usuarios',
            url: '/users',
            icon: IconUsers,
          },
          {
            title: 'Empresas',
            url: '/companies',
            icon: IconBuilding,
          },
          {
            title: 'Sucursales',
            url: '/subsidiaries',
            icon: IconBuildingStore,
          },
          // {
          //   title: 'Secured by Clerk',
          //   icon: ClerkLogo,
          //   items: [
          //     {
          //       title: 'Sign In',
          //       url: '/clerk/sign-in',
          //     },
          //     {
          //       title: 'Sign Up',
          //       url: '/clerk/sign-up',
          //     },
          //     {
          //       title: 'User Management',
          //       url: '/clerk/user-management',
          //     },
          //   ],
          // },
        ],
      },
      // {
      //   title: 'Pages',
      //   items: [
      //     {
      //       title: 'Auth',
      //       icon: IconLockAccess,
      //       items: [
      //         {
      //           title: 'Sign In',
      //           url: '/sign-in',
      //         },
      //         {
      //           title: 'Sign In (2 Col)',
      //           url: '/sign-in-2',
      //         },
      //         {
      //           title: 'Sign Up',
      //           url: '/sign-up',
      //         },
      //         {
      //           title: 'Forgot Password',
      //           url: '/forgot-password',
      //         },
      //         {
      //           title: 'OTP',
      //           url: '/otp',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Errors',
      //       icon: IconBug,
      //       items: [
      //         {
      //           title: 'Unauthorized',
      //           url: '/401',
      //           icon: IconLock,
      //         },
      //         {
      //           title: 'Forbidden',
      //           url: '/403',
      //           icon: IconUserOff,
      //         },
      //         {
      //           title: 'Not Found',
      //           url: '/404',
      //           icon: IconError404,
      //         },
      //         {
      //           title: 'Internal Server Error',
      //           url: '/500',
      //           icon: IconServerOff,
      //         },
      //         {
      //           title: 'Maintenance Error',
      //           url: '/503',
      //           icon: IconBarrierBlock,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   title: 'Other',
      //   items: [
      //     {
      //       title: 'Settings',
      //       icon: IconSettings,
      //       items: [
      //         {
      //           title: 'Profile',
      //           url: '/settings',
      //           icon: IconUserCog,
      //         },
      //         {
      //           title: 'Account',
      //           url: '/settings/account',
      //           icon: IconTool,
      //         },
      //         {
      //           title: 'Appearance',
      //           url: '/settings/appearance',
      //           icon: IconPalette,
      //         },
      //         {
      //           title: 'Notifications',
      //           url: '/settings/notifications',
      //           icon: IconNotification,
      //         },
      //         {
      //           title: 'Display',
      //           url: '/settings/display',
      //           icon: IconBrowserCheck,
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Help Center',
      //       url: '/help-center',
      //       icon: IconHelp,
      //     },
      //   ],
      // },
    ],
  }
}

// Mantener compatibilidad hacia atrás con una versión estática por defecto
export const sidebarData: SidebarData = getSidebarData()
