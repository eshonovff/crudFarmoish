import type { Priority } from '../../types/task'

interface BadgeProps {
  priority: Priority
}

const styles: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-orange-100 text-orange-500',
  low: 'bg-green-100 text-green-600',
}

const labels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function Badge({ priority }: BadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}
