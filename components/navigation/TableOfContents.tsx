// components/navigation/TableOfContents.tsx
'use client'

import { useState, useEffect } from 'react'
import { ToCToggle } from './ToCToggle'
import { ToCPanel } from './ToCPanel'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'
import { generatePageToC, updateToCActiveStates } from '@/lib/navigation/tocGenerator'
import { ToCItem } from '@/types/navigation'

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tocItems, setTocItems] = useState<ToCItem[]>([])
  const { activeSection } = useAdvancedSectionObserver()
  
  // Generate ToC on mount and when content changes
  useEffect(() => {
    const generateToC = () => {
      const items = generatePageToC()
      setTocItems(items)
    }
    
    // Generate initial ToC
    generateToC()
    
    // Regenerate on navigation or content changes
    const handleNavigation = () => {
      setTimeout(generateToC, 100) // Small delay to ensure DOM is updated
    }
    
    window.addEventListener('popstate', handleNavigation)
    
    return () => {
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])
  
  // Update active states when active section changes
  const itemsWithActiveStates = updateToCActiveStates(tocItems, activeSection)
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  
  const handleClose = () => {
    setIsExpanded(false)
  }
  
  // Don't render if no items
  if (itemsWithActiveStates.length === 0) {
    return null
  }
  
  return (
    <div className={className}>
      <ToCToggle
        isExpanded={isExpanded}
        onToggle={handleToggle}
      />
      
      <ToCPanel
        isExpanded={isExpanded}
        items={itemsWithActiveStates}
        onClose={handleClose}
      />
    </div>
  )
}