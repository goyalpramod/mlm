// components/navigation/ToCPanel.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ToCItem as ToCItemType } from '@/types/navigation'
import { ToCItem } from './ToCItem'
import { cn } from '@/lib/utils/cn'
import { useEffect } from 'react'

interface ToCPanelProps {
  isExpanded: boolean
  items: ToCItemType[]
  onClose: () => void
  onItemClick?: (id: string) => void
  className?: string
}

export function ToCPanel({ 
  isExpanded, 
  items, 
  onClose, 
  onItemClick,
  className 
}: ToCPanelProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isExpanded, onClose])
  
  const handleItemClick = (id: string) => {
    onItemClick?.(id)
    onClose() // Close panel after navigation
  }
  
  return (
    <AnimatePresence>
      {isExpanded && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-30"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              'fixed top-16 right-4 bottom-4 w-80 z-40',
              'bg-background border border-border rounded-lg shadow-xl',
              'flex flex-col overflow-hidden',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Table of Contents
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-accent transition-colors"
                aria-label="Close table of contents"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length > 0 ? (
                <div className="space-y-1">
                  {items.map((item) => (
                    <ToCItem
                      key={item.id}
                      item={item}
                      onItemClick={handleItemClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No headings found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}