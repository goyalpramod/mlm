// lib/hooks/useKeyboardNavigation.ts
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { hashManager } from '@/lib/navigation/hashManager'
import { smoothScroll } from '@/lib/utils/smoothScroll'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void | Promise<void>
  description: string
  category: 'navigation' | 'toc' | 'general'
}

interface UseKeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableShortcuts?: boolean
  enableTocToggle?: boolean
  customShortcuts?: KeyboardShortcut[]
}

export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {},
  onTocToggle?: () => void
) {
  const {
    enableArrowKeys = true,
    enableShortcuts = true,
    enableTocToggle = true,
    customShortcuts = []
  } = options

  const isHandlingRef = useRef(false)

  // Default keyboard shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'j',
      action: () => hashManager.navigateToNext(),
      description: 'Go to next section',
      category: 'navigation'
    },
    {
      key: 'k',
      action: () => hashManager.navigateToPrevious(),
      description: 'Go to previous section',
      category: 'navigation'
    },
    {
      key: 'ArrowUp',
      action: () => hashManager.navigateToPrevious(),
      description: 'Go to previous section',
      category: 'navigation'
    },
    {
      key: 'ArrowDown',
      action: () => hashManager.navigateToNext(),
      description: 'Go to next section',
      category: 'navigation'
    },
    
    // General shortcuts
    {
      key: 'Home',
      action: () => smoothScroll.scrollTo({ element: document.documentElement }),
      description: 'Go to top of page',
      category: 'general'
    },
    {
      key: 'End',
      action: () => {
        const documentHeight = document.documentElement.scrollHeight
        window.scrollTo({ top: documentHeight, behavior: 'smooth' })
      },
      description: 'Go to bottom of page',
      category: 'general'
    },
    {
      key: 'g',
      action: () => smoothScroll.scrollTo({ element: document.documentElement }),
      description: 'Go to top (vim-style)',
      category: 'general'
    },
    {
      key: 'G',
      shiftKey: true,
      action: () => {
        const documentHeight = document.documentElement.scrollHeight
        window.scrollTo({ top: documentHeight, behavior: 'smooth' })
      },
      description: 'Go to bottom (vim-style)',
      category: 'general'
    },

    // Table of Contents shortcuts
    {
      key: 't',
      action: () => onTocToggle?.(),
      description: 'Toggle table of contents',
      category: 'toc'
    },
    {
      key: 'o',
      action: () => onTocToggle?.(),
      description: 'Open table of contents',
      category: 'toc'
    },

    // URL management
    {
      key: 'u',
      action: async () => {
        const currentHash = hashManager.getCurrentHash()
        if (currentHash) {
          const url = hashManager.generateSectionUrl(currentHash)
          try {
            await navigator.clipboard.writeText(url)
            // Show a brief notification (you might want to implement a toast system)
            console.log('Section URL copied to clipboard')
          } catch (error) {
            console.warn('Failed to copy URL:', error)
          }
        }
      },
      description: 'Copy current section URL',
      category: 'general'
    },

    // Help shortcut
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // You might want to implement a help modal
        console.log('Keyboard shortcuts help')
      },
      description: 'Show keyboard shortcuts help',
      category: 'general'
    }
  ]

  // Combine default and custom shortcuts
  const allShortcuts = [...defaultShortcuts, ...customShortcuts]

  // Check if the user is currently typing in an input
  const isTyping = useCallback((): boolean => {
    const activeElement = document.activeElement
    if (!activeElement) return false

    const tagName = activeElement.tagName.toLowerCase()
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'
    const isInput = ['input', 'textarea', 'select'].includes(tagName)

    return isInput || isContentEditable
  }, [])

  // Handle key combinations
  const matchesShortcut = useCallback((event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    if (event.key !== shortcut.key) return false
    if (!!event.ctrlKey !== !!shortcut.ctrlKey) return false
    if (!!event.altKey !== !!shortcut.altKey) return false
    if (!!event.shiftKey !== !!shortcut.shiftKey) return false
    if (!!event.metaKey !== !!shortcut.metaKey) return false

    return true
  }, [])

  // Main keyboard event handler
  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    // Prevent handling if user is typing or already handling an event
    if (isTyping() || isHandlingRef.current) return

    // Check if shortcuts are enabled
    if (!enableShortcuts) return

    // Check arrow keys separately
    if (!enableArrowKeys && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return
    }

    // Find matching shortcut
    const matchingShortcut = allShortcuts.find(shortcut => matchesShortcut(event, shortcut))

    if (matchingShortcut) {
      // Prevent default browser behavior
      event.preventDefault()
      event.stopPropagation()

      // Set handling flag to prevent multiple triggers
      isHandlingRef.current = true

      try {
        await matchingShortcut.action()
      } catch (error) {
        console.error('Error executing keyboard shortcut:', error)
      } finally {
        // Reset handling flag after a short delay
        setTimeout(() => {
          isHandlingRef.current = false
        }, 100)
      }
    }
  }, [isTyping, enableShortcuts, enableArrowKeys, allShortcuts, matchesShortcut])

  // Add event listeners
  useEffect(() => {
    if (!enableShortcuts) return

    document.addEventListener('keydown', handleKeyDown, { passive: false })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enableShortcuts])

  // Return available shortcuts for help/documentation
  const getShortcutsByCategory = useCallback(() => {
    const categories: Record<string, KeyboardShortcut[]> = {}
    
    allShortcuts.forEach(shortcut => {
      if (!categories[shortcut.category]) {
        categories[shortcut.category] = []
      }
      categories[shortcut.category].push(shortcut)
    })

    return categories
  }, [allShortcuts])

  // Format shortcut for display
  const formatShortcut = useCallback((shortcut: KeyboardShortcut): string => {
    const parts: string[] = []
    
    if (shortcut.ctrlKey) parts.push('Ctrl')
    if (shortcut.altKey) parts.push('Alt')
    if (shortcut.shiftKey) parts.push('Shift')
    if (shortcut.metaKey) parts.push('Cmd')
    
    parts.push(shortcut.key)
    
    return parts.join(' + ')
  }, [])

  return {
    shortcuts: allShortcuts,
    getShortcutsByCategory,
    formatShortcut,
    isHandling: isHandlingRef.current
  }
}

// Hook for components that need to show keyboard shortcuts help
export function useKeyboardShortcutsHelp() {
  const { shortcuts, getShortcutsByCategory, formatShortcut } = useKeyboardNavigation({ 
    enableShortcuts: false // Don't actually handle keys, just get the info
  })

  return {
    shortcuts,
    getShortcutsByCategory,
    formatShortcut
  }
}