'use client'

import React from 'react'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'

export function ProgressBar() {
  const { readingProgress } = useAdvancedSectionObserver()
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
      <div 
        className="h-full bg-black transition-all duration-300 ease-out"
        style={{ width: `${readingProgress * 100}%` }}
      />
    </div>
  )
}