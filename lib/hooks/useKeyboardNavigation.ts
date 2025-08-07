// lib/hooks/useKeyboardNavigation.ts
'use client'

import { useEffect, useCallback } from 'react'

export function useKeyboardNavigation() {
  // Get all headings for navigation
  const getHeadings = useCallback((): Element[] => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(
      heading => heading.id
    )
  }, [])

  // Navigate to next section
  const navigateToNext = useCallback(() => {
    const headings = getHeadings()
    const currentHash = window.location.hash.slice(1)
    const currentIndex = headings.findIndex(h => h.id === currentHash)
    
    if (currentIndex < headings.length - 1) {
      const nextHeading = headings[currentIndex + 1]
      nextHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `#${nextHeading.id}`)
    }
  }, [getHeadings])

  // Navigate to previous section
  const navigateToPrevious = useCallback(() => {
    const headings = getHeadings()
    const currentHash = window.location.hash.slice(1)
    const currentIndex = headings.findIndex(h => h.id === currentHash)
    
    if (currentIndex > 0) {
      const prevHeading = headings[currentIndex - 1]
      prevHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `#${prevHeading.id}`)
    }
  }, [getHeadings])

  // Check if user is typing in an input
  const isTyping = useCallback((): boolean => {
    const activeElement = document.activeElement
    if (!activeElement) return false

    const tagName = activeElement.tagName.toLowerCase()
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'
    const isInput = ['input', 'textarea', 'select'].includes(tagName)

    return isInput || isContentEditable
  }, [])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle if user is typing
    if (isTyping()) return

    switch (event.key) {
      case 'ArrowUp':
      case 'k':
        event.preventDefault()
        navigateToPrevious()
        break
      case 'ArrowDown':
      case 'j':
        event.preventDefault()
        navigateToNext()
        break
    }
  }, [isTyping, navigateToNext, navigateToPrevious])

  // Add event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    navigateToNext,
    navigateToPrevious
  }
}