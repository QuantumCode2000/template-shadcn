import { PrimaryButtons, type PrimaryButtonAction } from './primary-buttons'

interface TableHeaderProps {
  title: string
  subtitle: string
  actions?: (Omit<PrimaryButtonAction, 'onClick'> & { action: string })[]
  useData?: () => (action: string) => void
}

export const TableHeader = ({
  title,
  subtitle,
  actions = [],
  useData,
}: TableHeaderProps) => {
  const dispatcher = useData ? useData() : undefined
  const boundActions: PrimaryButtonAction[] = dispatcher
    ? actions.map(({ action, ...rest }) => ({
        ...rest,
        onClick: () => dispatcher(action),
      }))
    : actions

  return (
    <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        <p className='text-muted-foreground'>{subtitle}</p>
      </div>
      {boundActions.length > 0 && <PrimaryButtons actions={boundActions} />}
    </div>
  )
}
