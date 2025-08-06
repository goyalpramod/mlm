// lib/hooks/useSectionObserver.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseSectionObserverReturn {
  activeSection: string | null
  visibleSections: Set<string>
}

export function useSectionObserver(headingSelector = 'h1, h2, h3, h4, h5, h6'): UseSectionObserverReturn {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headingElements = useRef<Element[]>([])
  
  useEffect(() => {
    // Find all headings in the document
    const headings = Array.from(document.querySelectorAll(headingSelector))
    headingElements.current = headings
    
    if (headings.length === 0) return
    
    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = new Set<string>()
        
        entries.forEach((entry) => {
          const id = entry.target.id
          if (!id) return
          
          if (entry.isIntersecting) {
            visible.add(id)
          }
        })
        
        setVisibleSections((prev) => {
          const newVisible = new Set(prev)
          
          entries.forEach((entry) => {
            const id = entry.target.id
            if (!id) return
            
            if (entry.isIntersecting) {
              newVisible.add(id)
            } else {
              newVisible.delete(id)
            }
          })
          
          return newVisible
        })
        
        // Determine the most relevant active section
        const currentVisible = Array.from(visible)
        if (currentVisible.length > 0) {
          // Use the first visible section as active
          setActiveSection(currentVisible[0])
        }
      },
      {
        rootMargin: '-80px 0px -80px 0px', // Account for fixed header
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )
    
    // Observe all headings
    headings.forEach((heading) => {
      if (observerRef.current) {
        observerRef.current.observe(heading)
      }
    })
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headingSelector])
  
  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && document.getElementById(hash)) {
        setActiveSection(hash)
      }
    }
    
    // Check initial hash
    handleHashChange()
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  
  return {
    activeSection,
    visibleSections
  }
}