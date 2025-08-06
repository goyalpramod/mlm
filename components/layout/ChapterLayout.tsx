'use client'

import { Chapter } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ChapterNavigation } from './ChapterNavigation'
import { TableOfContents } from '@/components/navigation/TableOfContents'
import { H1 } from '@/lib/utils/typography'

interface ChapterLayoutProps {
  chapter: Chapter
  children: React.ReactNode
  previousChapter?: Chapter
  nextChapter?: Chapter
}

export function ChapterLayout({
  chapter,
  children,
  previousChapter,
  nextChapter
}: ChapterLayoutProps) {
  return (
    <div className="min-h-screen bg-background">

      {/* Notion-style ToC Sidebar - Left Middle */}
      <TableOfContents className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40" />

      {/* Main Content */}
      <main className="py-16">
        <Container size="normal">
          <div className="max-w-3xl">
            {/* Simple Chapter Title */}
            <H1 className="mb-8">{chapter.title}</H1>
            
            {/* Chapter Content */}
            {children}
          </div>
        </Container>
      </main>

      {/* Previous/Next Navigation at Bottom */}
      <ChapterNavigation
        previousChapter={previousChapter}
        nextChapter={nextChapter}
      />
    </div>
  )
}