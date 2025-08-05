'use client'

import { HomePageContent } from '@/components/content/HomePageContent'
import { getPublishedChapters } from '@/lib/data/chapters'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }
  
  const chapters = getPublishedChapters()
  
  return <HomePageContent chapters={chapters} />
}