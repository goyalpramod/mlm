'use client'

import { Chapter } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ChapterNavigation } from './ChapterNavigation'
import { TableOfContents } from '@/components/navigation/TableOfContents'
import { ProgressBar } from '@/components/navigation/ProgressBar'

interface ChapterLayoutProps {
  chapter: Chapter
  children: React.ReactNode
  previousChapter?: Chapter
  nextChapter?: Chapter
}

export function ChapterLayout({
  children,
  previousChapter,
  nextChapter
}: ChapterLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <ProgressBar />
      
      {/* ToC Sidebar */}
      <TableOfContents className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40" />

      {/* Main Content */}
      <main className="py-16">
        <Container size="normal">
          <div className="max-w-3xl">
            
            {/* Chapter Content */}
            {children}
          </div>
        </Container>
      </main>

      {/* Chapter Navigation */}
      <ChapterNavigation
        previousChapter={previousChapter}
        nextChapter={nextChapter}
      />
    </div>
  )
}