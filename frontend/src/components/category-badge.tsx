import { getCategoryColor } from '@/lib/category-utils'
import { DynamicIcon } from 'lucide-react/dynamic'

interface CategoryBadgeProps {
  icon: string
  color: string
  title: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CategoryBadge({ icon, color, title, size = 'md', className = '' }: CategoryBadgeProps) {
  const colorConfig = getCategoryColor(color)

  const sizeClasses = {
    sm: 'gap-1 px-2 py-1 text-xs',
    md: 'gap-2 px-3 py-2 text-sm',
    lg: 'gap-3 px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg font-medium ${sizeClasses[size]} ${colorConfig.bgClass} ${className}`}
    >
      <DynamicIcon name={icon} size={iconSizes[size]} className="text-white" />
      <span className="text-white">{title}</span>
    </div>
  )
}

// Versão alternativa apenas com ícone
export function CategoryIcon({ icon, color, size = 'md', className = '' }: Omit<CategoryBadgeProps, 'title'>) {
  const colorConfig = getCategoryColor(color)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${sizeClasses[size]} ${colorConfig.bgClass} ${className}`}
    >
      <DynamicIcon name={icon} size={iconSizes[size]} className="text-white" />
    </div>
  )
}
