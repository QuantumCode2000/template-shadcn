import { getRoleName } from '@/lib/userRoles'
import { Badge } from '@/components/ui/badge'

interface UserRoleBadgeProps {
  roleId: number
}

export function UserRoleBadge({ roleId }: UserRoleBadgeProps) {
  const roleName = getRoleName(roleId)

  const getBadgeVariant = (role: number) => {
    switch (role) {
      case 1: // Super Admin
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 2: // Admin
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 3: // Invoicer
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Badge className={`text-xs ${getBadgeVariant(roleId)}`}>{roleName}</Badge>
  )
}
