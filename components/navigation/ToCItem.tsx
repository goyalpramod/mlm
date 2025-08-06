// components/navigation/ToCItem.tsx
'use client'

import { motion } from 'framer-motion'
import { ToCItem as ToCItemType } from '@/types/navigation'
import { scrollToElement } from '@/lib/utils/scrollUtils'
import { cn } from '@/lib/utils/cn'

interface ToCItemProps {
  item: ToCItemType
  onItemClick?: (id: string) => void
}

export function ToCItem({ item, onItemClick }: ToCItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToElement(item.id)
    onItemClick?.(item.id)
  }
  
  const indentLevel = Math.max(0, (item.level - 1) * 16) // 16px per level
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="toc-item"
    >
      <a
        href={`#${item.id}`}
        onClick={handleClick}
        className={cn(
          'block py-1 px-2 text-sm rounded transition-colors',
          'hover:bg-accent hover:text-foreground',
          'focus:outline-none focus:bg-accent',
          item.isActive
            ? 'bg-foreground text-background font-medium'
            : 'text-muted-foreground'
        )}
        style={{ paddingLeft: `${8 + indentLevel}px` }}
      >
        <span className="truncate block">{item.title}</span>
      </a>
      
      {item.children && item.children.length > 0 && (
        <div className="ml-2">
          {item.children.map((child) => (
            <ToCItem
              key={child.id}
              item={child}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}