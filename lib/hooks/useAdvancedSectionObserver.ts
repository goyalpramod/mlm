// lib/hooks/useAdvancedSectionObserver.ts
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAdvancedSectionObserverReturn {
  activeSection: string | null
  readingProgress: number
  isScrolling: boolean
}

export function useAdvancedSectionObserver(): UseAdvancedSectionObserverReturn {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollTimeoutRef = useRef<number>()

  // Calculate reading progress
  const calculateProgress = useCallback(() => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTop = window.pageYOffset
    
    if (documentHeight <= 0) return 1
    return Math.min(scrollTop / documentHeight, 1)
  }, [])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    setIsScrolling(true)
    setReadingProgress(calculateProgress())
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set scroll end timeout
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [calculateProgress])

  // Handle intersection observer
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the most visible heading
    let mostVisible: IntersectionObserverEntry | null = null
    let maxVisibility = 0

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
        maxVisibility = entry.intersectionRatio
        mostVisible = entry
      }
    })

    if (mostVisible) {
      setActiveSection(mostVisible.target.id)
    }
  }, [])

  // Initialize observer
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    if (headings.length === 0) return

    // Create intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    })

    // Observe all headings
    headings.forEach(heading => {
      if (observerRef.current && heading.id) {
        observerRef.current.observe(heading)
      }
    })

    // Initial calculation
    handleScroll()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, handleScroll])

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return {
    activeSection,
    readingProgress,
    isScrolling
  }
}