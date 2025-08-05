// Definición de roles del sistema
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  INVOICER: 3,
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Mapeo de roles para mostrar nombres
export const ROLE_NAMES = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.INVOICER]: 'Invoicer',
} as const

// Función helper para verificar roles
export const hasRole = (userRole: number, requiredRole: UserRole): boolean => {
  return userRole === requiredRole
}

// Función helper para verificar si es admin o superior
export const isAdminOrSuperAdmin = (userRole: number): boolean => {
  return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN
}

// Función helper para verificar si es super admin
export const isSuperAdmin = (userRole: number): boolean => {
  return userRole === USER_ROLES.SUPER_ADMIN
}

// Función helper para obtener el nombre del rol basado en el número
export const getRoleName = (roleId: number): string => {
  return ROLE_NAMES[roleId as UserRole] || 'Rol desconocido'
}
