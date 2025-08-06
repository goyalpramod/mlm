// components/navigation/ToCToggle.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface ToCToggleProps {
  isExpanded: boolean
  onToggle: () => void
  className?: string
}

export function ToCToggle({ isExpanded, onToggle, className }: ToCToggleProps) {
  return (
    <AnimatePresence>
      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={cn(
            'fixed top-20 right-4 z-40',
            'p-3 rounded-lg shadow-lg',
            'bg-background border border-border',
            'hover:bg-accent transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2',
            className
          )}
          aria-label="Open table of contents"
          type="button"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}