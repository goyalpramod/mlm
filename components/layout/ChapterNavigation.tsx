import Link from 'next/link'
import { Chapter } from '@/types/content'
import { Container } from '@/components/ui/Container'

interface ChapterNavigationProps {
  previousChapter?: Chapter
  nextChapter?: Chapter
}

export function ChapterNavigation({
  previousChapter,
  nextChapter
}: ChapterNavigationProps) {
  if (!previousChapter && !nextChapter) {
    return null
  }

  return (
    <nav className="border-t border-border bg-muted/30 py-8">
      <Container size="normal">
        <div className="flex justify-between items-center max-w-3xl">
          {/* Previous Chapter */}
          {previousChapter ? (
            <Link
              href={`/${previousChapter.slug}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{previousChapter.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {/* Next Chapter */}
          {nextChapter ? (
            <Link
              href={`/${nextChapter.slug}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{nextChapter.title}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Container>
    </nav>
  )
}