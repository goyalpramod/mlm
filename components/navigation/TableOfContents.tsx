'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'
import { generatePageToC, updateToCActiveStates } from '@/lib/navigation/tocGenerator'
import { ToCItem } from '@/types/navigation'
import { chapters } from '@/lib/data/chapters'
import { cn } from '@/lib/utils/cn'

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tocItems, setTocItems] = useState<ToCItem[]>([])
  const { activeSection } = useAdvancedSectionObserver()
  const router = useRouter()
  
  // Generate ToC on mount
  useEffect(() => {
    const items = generatePageToC()
    setTocItems(items)
  }, [])
  
  const itemsWithActiveStates = updateToCActiveStates(tocItems, activeSection)
  
  return (
    <div className={className}>
      {/* ToC Toggle Button */}
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-2 bg-background border border-border rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Notion-style ToC Panel with smooth transition */}
      <div 
        className={cn(
          "absolute top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2",
          "w-80 bg-background border border-border rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto",
          "transition-all duration-300 ease-out origin-center",
          isVisible 
            ? "opacity-100 scale-100 visible" 
            : "opacity-0 scale-95 invisible"
        )}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {/* Navigation Links */}
        <div className="space-y-1 mb-4">
          <Link 
            href="/" 
            className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/#why" 
            className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
          >
            Why I built this
          </Link>
        </div>
        
        <div className="border-t border-border pt-4 mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">CHAPTERS</div>
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/${chapter.slug}`}
              className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
            >
              {chapter.title}
            </Link>
          ))}
        </div>
        
        {/* Current Chapter Sections */}
        {itemsWithActiveStates.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">ON THIS PAGE</div>
            <div className="space-y-1">
              {itemsWithActiveStates.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    'block px-2 py-1 text-sm rounded transition-colors',
                    item.isActive
                      ? 'text-foreground bg-accent font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                  style={{ paddingLeft: `${8 + (item.level - 1) * 12}px` }}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}