// lib/hooks/useAdvancedSectionObserver.ts
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { visibilityCalculator, SectionVisibility } from '@/lib/utils/visibilityCalculator'
import { defaultNavigationConfig } from '@/lib/config/scrollConfig'

interface UseAdvancedSectionObserverOptions {
  headingSelector?: string
  throttleMs?: number
  debounceMs?: number
  rootMargin?: string
  threshold?: number[]
}

interface AdvancedSectionObserverReturn {
  activeSection: string | null
  visibleSections: string[]
  sectionVisibilities: SectionVisibility[]
  readingProgress: number
  isScrolling: boolean
  nextSection: SectionVisibility | null
  previousSection: SectionVisibility | null
}

export function useAdvancedSectionObserver(
  options: UseAdvancedSectionObserverOptions = {}
): AdvancedSectionObserverReturn {
  const {
    headingSelector = 'h1, h2, h3, h4, h5, h6',
    throttleMs = defaultNavigationConfig.performance.throttleMs,
    debounceMs = defaultNavigationConfig.performance.debounceMs,
    rootMargin = defaultNavigationConfig.intersection.rootMargin,
    threshold = defaultNavigationConfig.intersection.threshold
  } = options

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const [sectionVisibilities, setSectionVisibilities] = useState<SectionVisibility[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [nextSection, setNextSection] = useState<SectionVisibility | null>(null)
  const [previousSection, setPreviousSection] = useState<SectionVisibility | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const headingElementsRef = useRef<Element[]>([])
  const throttleTimeoutRef = useRef<number>()
  const debounceTimeoutRef = useRef<number>()
  const scrollTimeoutRef = useRef<number>()
  const isUpdatingRef = useRef(false)

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (isUpdatingRef.current) return

    // Set scrolling state
    setIsScrolling(true)
    
    // Clear existing scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Throttle the actual calculation
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
    }

    throttleTimeoutRef.current = window.setTimeout(() => {
      if (headingElementsRef.current.length === 0) return

      isUpdatingRef.current = true

      // Calculate section visibilities
      const visibilities = visibilityCalculator.calculateSectionVisibilities(
        headingElementsRef.current
      )

      // Find most relevant section
      const mostRelevant = visibilityCalculator.findMostRelevantSection(visibilities)
      
      // Calculate reading progress
      const progress = visibilityCalculator.calculateReadingProgress(visibilities)

      // Get visible sections
      const visible = visibilityCalculator.getVisibleSections(visibilities)

      // Get next/previous sections
      const next = visibilityCalculator.getNextSection(visibilities)
      const prev = visibilityCalculator.getPreviousSection(visibilities)

      // Update state
      setSectionVisibilities(visibilities)
      setActiveSection(mostRelevant?.id || null)
      setVisibleSections(visible.map(v => v.id))
      setReadingProgress(progress)
      setNextSection(next)
      setPreviousSection(prev)

      isUpdatingRef.current = false
    }, throttleMs)

    // Set scroll end timeout
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
    }, debounceMs)
  }, [throttleMs, debounceMs])

  // Debounced intersection handler
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      handleScroll()
    }, debounceMs / 2) // Use half debounce time for intersection
  }, [handleScroll, debounceMs])

  // Initialize observer and find headings
  useEffect(() => {
    const initializeObserver = () => {
      // Find all heading elements
      const headings = Array.from(document.querySelectorAll(headingSelector))
      headingElementsRef.current = headings

      if (headings.length === 0) {
        console.warn('No heading elements found for section observer')
        return
      }

      // Create intersection observer
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin,
        threshold
      })

      // Observe all headings
      headings.forEach(heading => {
        if (observerRef.current) {
          observerRef.current.observe(heading)
        }
      })

      // Initial calculation
      handleScroll()
    }

    // Initialize on mount
    initializeObserver()

    // Re-initialize on content changes (with delay for DOM updates)
    const reinitializeTimeout = setTimeout(initializeObserver, 100)

    return () => {
      clearTimeout(reinitializeTimeout)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headingSelector, handleIntersection, handleScroll, rootMargin, threshold])

  // Add scroll listener
  useEffect(() => {
    const handleScrollEvent = () => {
      if (defaultNavigationConfig.performance.enableRAF) {
        requestAnimationFrame(handleScroll)
      } else {
        handleScroll()
      }
    }

    window.addEventListener('scroll', handleScrollEvent, { passive: true })
    window.addEventListener('resize', handleScrollEvent, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScrollEvent)
      window.removeEventListener('resize', handleScrollEvent)
    }
  }, [handleScroll])

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && document.getElementById(hash)) {
        setActiveSection(hash)
      }
    }

    handleHashChange() // Check initial hash
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return {
    activeSection,
    visibleSections,
    sectionVisibilities,
    readingProgress,
    isScrolling,
    nextSection,
    previousSection
  }
}