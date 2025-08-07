// components/navigation/ReadingProgress.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface ReadingProgressProps {
  progress: number // 0-1
  className?: string
}

export function ReadingProgress({
  progress,
  className
}: ReadingProgressProps) {
  const percentage = Math.round(progress * 100)
  
  return (
    <div className={cn(
      'w-full h-1 bg-border',
      className
    )}>
      <div
        className="h-full bg-foreground transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}