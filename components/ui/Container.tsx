import { cn } from '@/lib/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  size?: 'narrow' | 'normal' | 'wide' | 'full'
  className?: string
}

export function Container({ 
  children, 
  size = 'normal', 
  className 
}: ContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-2xl',      // ~672px - for focused reading
    normal: 'max-w-4xl',      // ~896px - for general content
    wide: 'max-w-6xl',        // ~1152px - for visualizations
    full: 'max-w-7xl'         // ~1280px - for full-width layouts
  }

  return (
    <div 
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}