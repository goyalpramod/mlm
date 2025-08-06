// components/layout/ChapterLayout.tsx
import { Chapter } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ChapterNavigation } from './ChapterNavigation'
import { TableOfContents } from '@/components/navigation/TableOfContents'
import { H1, P, Small } from '@/lib/utils/typography'
import { getDifficultyColor, formatReadingTime } from '@/lib/utils/navigation'
import { cn } from '@/lib/utils/cn'

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
      {/* Chapter Header */}
      <section className="py-12 border-b border-border bg-muted/30">
        <Container size="normal">
          <div className="max-w-3xl">
            {/* Chapter metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-2xl">{chapter.icon}</span>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={cn(
                  'px-2 py-1 rounded-full border text-xs font-medium',
                  getDifficultyColor(chapter.difficulty)
                )}>
                  {chapter.difficulty}
                </span>
                <span className="text-muted-foreground">
                  {formatReadingTime(chapter.readingTime)}
                </span>
                <span className="text-muted-foreground">
                  Chapter {chapter.order}
                </span>
              </div>
            </div>

            {/* Chapter title and description */}
            <H1 className="mb-4">{chapter.title}</H1>
            <P className="text-xl text-muted-foreground leading-relaxed">
              {chapter.description}
            </P>

            {/* Prerequisites */}
            {chapter.prerequisites.length > 0 && (
              <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {chapter.prerequisites.map((prerequisite, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                    >
                      {prerequisite}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Learning objectives */}
            {chapter.learningObjectives.length > 0 && (
              <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">What You'll Learn</h3>
                <ul className="space-y-1">
                  {chapter.learningObjectives.map((objective, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-foreground mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Chapter Content with ToC */}
      <main className="py-16 relative">
        <Container size="normal">
          <div className="max-w-3xl">
            {children}
          </div>
        </Container>
        
        {/* Table of Contents - Fixed positioned */}
        <TableOfContents className="fixed top-16 right-4 z-30" />
      </main>

      {/* Chapter Navigation */}
      <ChapterNavigation
        previousChapter={previousChapter}
        nextChapter={nextChapter}
      />
    </div>
  )
}