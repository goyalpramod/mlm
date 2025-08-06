// lib/hooks/usePageHeadings.ts
'use client'

import { useState, useEffect } from 'react'

interface PageHeading {
  id: string
  title: string
  level: number
}

export function usePageHeadings(): PageHeading[] {
  const [headings, setHeadings] = useState<PageHeading[]>([])

  useEffect(() => {
    // Wait a bit for MDX content to render
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      
      const foundHeadings: PageHeading[] = Array.from(headingElements).map(element => ({
        id: element.id || '',
        title: element.textContent?.trim() || '',
        level: parseInt(element.tagName.charAt(1))
      })).filter(heading => heading.id && heading.title) // Only include headings with both ID and title

      setHeadings(foundHeadings)
    }, 100) // Small delay to ensure MDX content is rendered

    return () => clearTimeout(timer)
  }, [])

  return headings
}