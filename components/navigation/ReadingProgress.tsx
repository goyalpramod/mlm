// components/navigation/ReadingProgress.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface ReadingProgressProps {
  progress: number // 0-1
  className?: string
  showPercentage?: boolean
  variant?: 'bar' | 'circle' | 'minimal'
  position?: 'top' | 'bottom' | 'fixed-top' | 'fixed-bottom'
  color?: 'primary' | 'secondary' | 'accent'
  animated?: boolean
}

export function ReadingProgress({
  progress,
  className,
  showPercentage = false,
  variant = 'bar',
  position = 'fixed-top',
  color = 'primary',
  animated = true
}: ReadingProgressProps) {
  const percentage = Math.round(progress * 100)
  
  const colorClasses = {
    primary: 'bg-foreground',
    secondary: 'bg-muted-foreground',
    accent: 'bg-accent-foreground'
  }

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
    'fixed-top': 'fixed top-0 z-50',
    'fixed-bottom': 'fixed bottom-0 z-50'
  }

  if (variant === 'bar') {
    return (
      <div className={cn(
        'w-full h-1 bg-border',
        positionClasses[position],
        className
      )}>
        <motion.div
          className={cn('h-full', colorClasses[color])}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={animated ? {
            duration: 0.3,
            ease: 'easeOut'
          } : { duration: 0 }}
        />
        {showPercentage && (
          <div className="absolute right-2 top-2 text-xs text-muted-foreground bg-background px-1 rounded">
            {percentage}%
          </div>
        )}
      </div>
    )
  }

  if (variant === 'circle') {
    const circumference = 2 * Math.PI * 16 // radius of 16
    const strokeDashoffset = circumference - (progress * circumference)

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg className="transform -rotate-90 w-10 h-10">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="rgb(var(--border))"
            strokeWidth="2"
            fill="transparent"
          />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            stroke="rgb(var(--foreground))"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : false}
            animate={{ strokeDashoffset }}
            transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
          />
        </svg>
        {showPercentage && (
          <span className="absolute text-xs font-medium text-foreground">
            {percentage}%
          </span>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(
        'flex items-center space-x-2 text-sm text-muted-foreground',
        className
      )}>
        <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', colorClasses[color])}
            initial={animated ? { width: 0 } : false}
            animate={{ width: `${percentage}%` }}
            transition={animated ? {
              duration: 0.3,
              ease: 'easeOut'
            } : { duration: 0 }}
          />
        </div>
        {showPercentage && (
          <span className="text-xs font-medium">
            {percentage}%
          </span>
        )}
      </div>
    )
  }

  return null
}

interface SectionProgressProps {
  sections: Array<{
    id: string
    title: string
    completed: boolean
    current?: boolean
  }>
  className?: string
}

export function SectionProgress({ sections, className }: SectionProgressProps) {
  const completedCount = sections.filter(s => s.completed).length
  const totalCount = sections.length
  const overallProgress = totalCount > 0 ? completedCount / totalCount : 0

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Chapter Progress
          </span>
          <span className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} sections
          </span>
        </div>
        <ReadingProgress
          progress={overallProgress}
          variant="bar"
          position="top"
          showPercentage={false}
          className="relative"
        />
      </div>

      {/* Individual Sections */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              'flex items-center space-x-3 p-2 rounded-lg transition-colors',
              section.current && 'bg-accent',
              section.completed && 'opacity-75'
            )}
          >
            <div className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              section.completed 
                ? 'bg-foreground border-foreground' 
                : section.current
                ? 'border-foreground bg-background'
                : 'border-border bg-background'
            )}>
              {section.completed ? (
                <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : section.current ? (
                <div className="w-2 h-2 bg-foreground rounded-full" />
              ) : (
                <span className="text-xs text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              'text-sm flex-1',
              section.completed 
                ? 'text-muted-foreground line-through' 
                : section.current
                ? 'text-foreground font-medium'
                : 'text-foreground'
            )}>
              {section.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface EstimatedTimeProps {
  totalMinutes: number
  currentProgress: number
  className?: string
}

export function EstimatedTime({ totalMinutes, currentProgress, className }: EstimatedTimeProps) {
  const remainingMinutes = Math.max(0, totalMinutes * (1 - currentProgress))
  const hours = Math.floor(remainingMinutes / 60)
  const minutes = Math.round(remainingMinutes % 60)

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    if (minutes > 1) {
      return `${minutes}m remaining`
    }
    if (minutes === 1) {
      return '1m remaining'
    }
    return 'Almost done!'
  }

  return (
    <div className={cn('text-xs text-muted-foreground', className)}>
      {formatTime()}
    </div>
  )
}