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
    <nav className="border-t border-border bg-muted/30" aria-label="Chapter navigation">
      <Container size="normal">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Chapter */}
            <div className="flex justify-start">
              {previousChapter ? (
                <Link
                  href={`/${previousChapter.slug}`}
                  className="group flex items-center space-x-4 p-4 rounded-lg border border-border bg-background hover:bg-accent transition-colors max-w-sm"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Previous</p>
                    <p className="font-semibold text-foreground group-hover:text-foreground truncate">
                      {previousChapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Chapter {previousChapter.order}
                    </p>
                  </div>
                </Link>
              ) : (
                <div /> // Empty div to maintain grid layout
              )}
            </div>

            {/* Next Chapter */}
            <div className="flex justify-end">
              {nextChapter ? (
                <Link
                  href={`/${nextChapter.slug}`}
                  className="group flex items-center space-x-4 p-4 rounded-lg border border-border bg-background hover:bg-accent transition-colors max-w-sm"
                >
                  <div className="min-w-0 text-right">
                    <p className="text-sm text-muted-foreground mb-1">Next</p>
                    <p className="font-semibold text-foreground group-hover:text-foreground truncate">
                      {nextChapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Chapter {nextChapter.order}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div /> // Empty div to maintain grid layout
              )}
            </div>
          </div>

          {/* Back to overview */}
          <div className="flex justify-center mt-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5v14l11-7z"
                />
              </svg>
              <span>Back to Book Overview</span>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  )
}