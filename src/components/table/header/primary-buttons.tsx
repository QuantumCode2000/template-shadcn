import { ComponentType } from 'react'
import { Button } from '@/components/ui/button'

type Base = {
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

type WithHandler = Base & {
  onClick: () => void
}

type WithAction = Base & {
  action: string
}

/** Unión discriminada */
export type PrimaryButtonAction = WithHandler | WithAction

interface PrimaryButtonsProps {
  /** Lista de acciones */
  actions: PrimaryButtonAction[]
  /**
   * Disparador global para acciones declarativas.
   * Ej.: `setOpen`, `dispatch`, router push, etc.
   */
  onAction?: (action: string) => void
}

/* ─────────── Componente ─────────── */

export function PrimaryButtons({ actions, onAction }: PrimaryButtonsProps) {
  return (
    <div className='flex gap-2'>
      {actions.map(({ label, icon: Icon, variant = 'default', ...rest }) => {
        const handleClick =
          'onClick' in rest ? rest.onClick : () => onAction?.(rest.action)

        return (
          <Button
            key={label}
            variant={variant}
            className='space-x-1'
            onClick={handleClick}
          >
            <span>{label}</span>
            <Icon size={18} />
          </Button>
        )
      })}
    </div>
  )
}
