// components/navigation/ScrollNavigation.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation'
import { useHashNavigation } from '@/lib/navigation/hashManager'
import { ReadingProgress, SectionProgress, EstimatedTime } from './ReadingProgress'

interface ScrollNavigationProps {
  className?: string
  showProgress?: boolean
  showSectionList?: boolean
  showKeyboardShortcuts?: boolean
  estimatedReadingTime?: number
  onTocToggle?: () => void
}

export function ScrollNavigation({
  className,
  showProgress = true,
  showSectionList = false,
  showKeyboardShortcuts = false,
  estimatedReadingTime = 0,
  onTocToggle
}: ScrollNavigationProps) {
  const [showHelp, setShowHelp] = useState(false)
  
  const {
    activeSection,
    visibleSections,
    sectionVisibilities,
    readingProgress,
    isScrolling,
    nextSection,
    previousSection
  } = useAdvancedSectionObserver()

  const { navigateToNext, navigateToPrevious } = useHashNavigation()
  
  const { shortcuts, getShortcutsByCategory, formatShortcut } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableShortcuts: true,
    enableTocToggle: true
  }, onTocToggle)

  // Convert section visibilities to section progress format
  const sectionProgressData = sectionVisibilities.map(section => ({
    id: section.id,
    title: section.element.textContent?.slice(0, 50) || section.id,
    completed: section.visibility > 0.8,
    current: section.id === activeSection
  }))

  return (
    <div className={cn('scroll-navigation', className)}>
      {/* Reading Progress Bar */}
      {showProgress && (
        <ReadingProgress
          progress={readingProgress}
          position="fixed-top"
          animated={!isScrolling}
          className="z-50"
        />
      )}

      {/* Mini Navigation Controls */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {/* Navigation Buttons */}
        <div className="flex flex-col space-y-2">
          <motion.button
            onClick={() => navigateToPrevious()}
            disabled={!previousSection}
            className={cn(
              'p-3 rounded-full bg-background border border-border shadow-lg',
              'hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-foreground',
              !previousSection && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Previous section (↑ or K)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => navigateToNext()}
            disabled={!nextSection}
            className={cn(
              'p-3 rounded-full bg-background border border-border shadow-lg',
              'hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-foreground',
              !nextSection && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Next section (↓ or J)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>

        {/* Progress Indicator */}
        {showProgress && (
          <motion.div
            className="bg-background border border-border rounded-lg p-3 shadow-lg min-w-48"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(readingProgress * 100)}%</span>
              </div>
              
              <ReadingProgress
                progress={readingProgress}
                variant="minimal"
                position="top"
                showPercentage={false}
              />
              
              {estimatedReadingTime > 0 && (
                <EstimatedTime
                  totalMinutes={estimatedReadingTime}
                  currentProgress={readingProgress}
                />
              )}
              
              {activeSection && (
                <div className="text-xs text-muted-foreground truncate">
                  Current: {sectionVisibilities.find(s => s.id === activeSection)?.element.textContent?.slice(0, 30) || activeSection}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Keyboard Shortcuts Help Toggle */}
        {showKeyboardShortcuts && (
          <motion.button
            onClick={() => setShowHelp(!showHelp)}
            className="p-3 rounded-full bg-background border border-border shadow-lg hover:bg-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Keyboard shortcuts (?)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Section Progress Sidebar */}
      {showSectionList && sectionProgressData.length > 0 && (
        <motion.div
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <SectionProgress sections={sectionProgressData} />
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-background border border-border rounded-lg shadow-xl p-6 max-w-md max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(getShortcutsByCategory()).map(([category, categoryShortcuts]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-foreground">{shortcut.description}</span>
                            <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-mono">
                              {formatShortcut(shortcut)}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll Position Indicator */}
      <div className="fixed left-4 bottom-4 z-30">
        <motion.div
          className={cn(
            'bg-background border border-border rounded-lg p-2 shadow-lg transition-opacity',
            isScrolling ? 'opacity-100' : 'opacity-0'
          )}
          animate={{ opacity: isScrolling ? 1 : 0 }}
        >
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Scrolling...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}