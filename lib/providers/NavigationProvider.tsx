// lib/providers/NavigationProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation'
import { hashManager } from '@/lib/navigation/hashManager'
import { SectionVisibility } from '@/lib/utils/visibilityCalculator'

interface NavigationContextValue {
  // Section observation
  activeSection: string | null
  visibleSections: string[]
  sectionVisibilities: SectionVisibility[]
  readingProgress: number
  isScrolling: boolean
  nextSection: SectionVisibility | null
  previousSection: SectionVisibility | null

  // Navigation actions
  navigateToSection: (sectionId: string) => Promise<void>
  navigateToNext: () => Promise<boolean>
  navigateToPrevious: () => Promise<boolean>
  
  // Table of contents
  tocExpanded: boolean
  toggleToc: () => void
  
  // Keyboard shortcuts
  shortcutsEnabled: boolean
  toggleShortcuts: () => void
  
  // Settings
  settings: NavigationSettings
  updateSettings: (updates: Partial<NavigationSettings>) => void
}

interface NavigationSettings {
  showProgress: boolean
  showSectionList: boolean
  showKeyboardShortcuts: boolean
  autoHideNavigation: boolean
  smoothScrolling: boolean
  respectReducedMotion: boolean
}

const defaultSettings: NavigationSettings = {
  showProgress: true,
  showSectionList: false,
  showKeyboardShortcuts: true,
  autoHideNavigation: true,
  smoothScrolling: true,
  respectReducedMotion: true
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined)

interface NavigationProviderProps {
  children: React.ReactNode
  initialSettings?: Partial<NavigationSettings>
}

export function NavigationProvider({ 
  children, 
  initialSettings = {} 
}: NavigationProviderProps) {
  const [tocExpanded, setTocExpanded] = useState(false)
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true)
  const [settings, setSettings] = useState<NavigationSettings>({
    ...defaultSettings,
    ...initialSettings
  })

  // Advanced section observation
  const sectionObserver = useAdvancedSectionObserver({
    headingSelector: 'h1, h2, h3, h4, h5, h6',
    throttleMs: 16,
    debounceMs: 100
  })

  // Keyboard navigation
  useKeyboardNavigation({
    enableArrowKeys: true,
    enableShortcuts: shortcutsEnabled,
    enableTocToggle: true
  }, toggleToc)

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedSettings = localStorage.getItem('ml-math-nav-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to load navigation settings:', error)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('ml-math-nav-settings', JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save navigation settings:', error)
    }
  }, [settings])

  // Navigation actions
  const navigateToSection = async (sectionId: string): Promise<void> => {
    await hashManager.navigateToHash(sectionId, { 
      smooth: settings.smoothScrolling 
    })
  }

  const navigateToNext = async (): Promise<boolean> => {
    return await hashManager.navigateToNext()
  }

  const navigateToPrevious = async (): Promise<boolean> => {
    return await hashManager.navigateToPrevious()
  }

  const toggleToc = (): void => {
    setTocExpanded(prev => !prev)
  }

  const toggleShortcuts = (): void => {
    setShortcutsEnabled(prev => !prev)
  }

  const updateSettings = (updates: Partial<NavigationSettings>): void => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  // Handle reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.respectReducedMotion) {
        updateSettings({ smoothScrolling: !e.matches })
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // Apply initial setting
    if (settings.respectReducedMotion && mediaQuery.matches) {
      updateSettings({ smoothScrolling: false })
    }

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings.respectReducedMotion])

  const contextValue: NavigationContextValue = {
    // Section observation
    ...sectionObserver,
    
    // Navigation actions
    navigateToSection,
    navigateToNext,
    navigateToPrevious,
    
    // Table of contents
    tocExpanded,
    toggleToc,
    
    // Keyboard shortcuts
    shortcutsEnabled,
    toggleShortcuts,
    
    // Settings
    settings,
    updateSettings
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  
  return context
}

// Convenience hooks for specific navigation features
export function useScrollNavigation() {
  const { 
    activeSection, 
    readingProgress, 
    navigateToNext, 
    navigateToPrevious,
    nextSection,
    previousSection 
  } = useNavigation()
  
  return {
    activeSection,
    readingProgress,
    navigateToNext,
    navigateToPrevious,
    hasNext: !!nextSection,
    hasPrevious: !!previousSection
  }
}

export function useTableOfContents() {
  const { 
    tocExpanded, 
    toggleToc, 
    sectionVisibilities, 
    activeSection 
  } = useNavigation()
  
  return {
    isExpanded: tocExpanded,
    toggle: toggleToc,
    sections: sectionVisibilities,
    activeSection
  }
}

export function useReadingProgress() {
  const { 
    readingProgress, 
    sectionVisibilities, 
    activeSection 
  } = useNavigation()
  
  const completedSections = sectionVisibilities.filter(s => s.visibility > 0.8)
  const currentSectionIndex = sectionVisibilities.findIndex(s => s.id === activeSection)
  
  return {
    overallProgress: readingProgress,
    sectionsCompleted: completedSections.length,
    totalSections: sectionVisibilities.length,
    currentSectionIndex,
    sections: sectionVisibilities.map(section => ({
      id: section.id,
      title: section.element.textContent?.slice(0, 50) || section.id,
      completed: section.visibility > 0.8,
      current: section.id === activeSection,
      progress: section.visibility
    }))
  }
}