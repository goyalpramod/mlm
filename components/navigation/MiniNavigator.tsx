// components/navigation/MiniNavigator.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'
import { useHashNavigation } from '@/lib/navigation/hashManager'

interface MiniNavigatorProps {
  className?: string
  autoHide?: boolean
  autoHideDelay?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  showSectionInfo?: boolean
}

export function MiniNavigator({
  className,
  autoHide = true,
  autoHideDelay = 3000,
  position = 'bottom-right',
  showSectionInfo = true
}: MiniNavigatorProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    activeSection,
    sectionVisibilities,
    nextSection,
    previousSection,
    isScrolling
  } = useAdvancedSectionObserver()

  const { navigateToNext, navigateToPrevious } = useHashNavigation()

  // Auto-hide logic
  useEffect(() => {
    if (!autoHide) return

    let timeoutId: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeoutId)
      setIsVisible(true)
      
      if (!isHovered && !isScrolling) {
        timeoutId = setTimeout(() => {
          setIsVisible(false)
        }, autoHideDelay)
      }
    }

    // Show on scroll or mouse movement
    const handleActivity = () => resetTimer()

    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('mousemove', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity, { passive: true })

    // Initial timer
    resetTimer()

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [autoHide, autoHideDelay, isHovered, isScrolling])

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  }

  const currentSectionData = activeSection 
    ? sectionVisibilities.find(s => s.id === activeSection)
    : null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-40 select-none',
            positionClasses[position],
            className
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Section Info */}
            {showSectionInfo && currentSectionData && (
              <div className="px-3 py-2 border-b border-border bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Current Section</div>
                <div className="text-sm font-medium text-foreground truncate max-w-48">
                  {currentSectionData.element.textContent?.slice(0, 40) || activeSection}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex">
              {/* Previous Button */}
              <motion.button
                onClick={() => navigateToPrevious()}
                disabled={!previousSection}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 text-sm transition-colors',
                  'hover:bg-accent focus:outline-none focus:bg-accent',
                  !previousSection && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={previousSection ? { backgroundColor: 'rgb(var(--accent))' } : {}}
                whileTap={previousSection ? { scale: 0.98 } : {}}
                title={previousSection ? `Previous: ${previousSection.element.textContent?.slice(0, 30)}` : 'No previous section'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </motion.button>

              {/* Divider */}
              <div className="w-px bg-border" />

              {/* Next Button */}
              <motion.button
                onClick={() => navigateToNext()}
                disabled={!nextSection}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 text-sm transition-colors',
                  'hover:bg-accent focus:outline-none focus:bg-accent',
                  !nextSection && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={nextSection ? { backgroundColor: 'rgb(var(--accent))' } : {}}
                whileTap={nextSection ? { scale: 0.98 } : {}}
                title={nextSection ? `Next: ${nextSection.element.textContent?.slice(0, 30)}` : 'No next section'}
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Progress Indicator */}
            <div className="px-3 py-2 bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{activeSection ? sectionVisibilities.findIndex(s => s.id === activeSection) + 1 : 0} of {sectionVisibilities.length}</span>
              </div>
              <div className="w-full bg-border rounded-full h-1">
                <motion.div
                  className="bg-foreground h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: activeSection 
                      ? `${((sectionVisibilities.findIndex(s => s.id === activeSection) + 1) / sectionVisibilities.length) * 100}%`
                      : '0%'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Keyboard Hint */}
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-muted-foreground bg-background border border-border rounded px-2 py-1">
              Use ↑↓ or J/K
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}