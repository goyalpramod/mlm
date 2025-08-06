'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { chapters } from '@/lib/data/chapters'
import { cn } from '@/lib/utils/cn'

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
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
      
      {/* ToC Panel */}
      <div 
        className={cn(
          "absolute top-1/2 left-0 transform -translate-y-1/2",
          "w-80 bg-background border border-border rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto",
          "transition-all duration-300 ease-out origin-left",
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
        
        {/* ON THIS PAGE - We'll add this back later with a simpler approach */}
        <div className="border-t border-border pt-4">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">ON THIS PAGE</div>
          <div className="text-xs text-muted-foreground px-2">
            Headings will appear here
          </div>
        </div>
      </div>
    </div>
  )
}