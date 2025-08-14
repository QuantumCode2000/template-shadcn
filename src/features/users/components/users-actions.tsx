import Cookies from 'js-cookie'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import {
  IconEdit,
  IconTrash,
  IconUserCheck,
  IconUserX,
} from '@tabler/icons-react'
import { decodeToken } from '@/lib/jwtUtils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '../data/schema'
// import { useUsers } from '../context/users-context'
import { useUsersUI } from '../stores/users-ui-store'

interface DataTableRowActionsProps {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsersUI()
  const user = row.original

  // Verificar si es admin para usar diálogos admin
  const isAdmin = (() => {
    try {
      const cookieToken = Cookies.get('thisisjustarandomstring')
      if (!cookieToken) return false
      const token = JSON.parse(cookieToken)
      const decoded = decodeToken(token)
      return decoded?.rolId === 2
    } catch {
      return false
    }
  })()

  const handleToggleStatus = () => {
    setCurrentRow(user)
    setOpen('toggle-status')
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen(isAdmin ? 'edit-admin' : 'edit')
            }}
          >
            Editar
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {user.activo ? 'Inhabilitar' : 'Habilitar'} Usuario
            <DropdownMenuShortcut>
              {user.activo ? (
                <IconUserX size={16} />
              ) : (
                <IconUserCheck size={16} />
              )}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className='text-red-500!'
          >
            Eliminar
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
