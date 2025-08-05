import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { H1, H2, H3, P, Lead } from '@/lib/utils/typography'
import { Chapter } from '@/types/content'
import { getDifficultyColor, formatReadingTime } from '@/lib/utils/navigation'
import { cn } from '@/lib/utils/cn'

interface HomePageContentProps {
  chapters: Chapter[]
}

export function HomePageContent({ chapters }: HomePageContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <Container size="normal">
          <div className="text-center">
            <H1 className="text-balance">
              Interactive ML Mathematics
            </H1>
            <Lead className="text-balance max-w-3xl mx-auto">
              Master the mathematical foundations of machine learning through 
              interactive visualizations, hands-on exercises, and clear explanations.
            </Lead>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href={`/${chapters[0]?.slug || 'linear-algebra'}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Start Learning
              </Link>
              <Link 
                href="#chapters"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Explore Chapters
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <Container size="wide">
          <div className="text-center mb-12">
            <H2>Why Interactive Learning?</H2>
            <P className="text-center text-muted-foreground max-w-2xl mx-auto">
              Mathematics comes alive when you can see it, interact with it, and 
              experiment with the concepts in real-time.
            </P>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">∇</span>
              </div>
              <H3 className="mb-3">Visual Learning</H3>
              <P className="text-muted-foreground">
                Complex mathematical concepts become intuitive through 
                interactive 3D visualizations and dynamic graphics.
              </P>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">∫</span>
              </div>
              <H3 className="mb-3">Hands-on Practice</H3>
              <P className="text-muted-foreground">
                Reinforce your understanding with interactive exercises 
                and real-world machine learning examples.
              </P>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">Σ</span>
              </div>
              <H3 className="mb-3">Progressive Learning</H3>
              <P className="text-muted-foreground">
                Start with fundamentals and build up to advanced topics 
                with a carefully structured curriculum.
              </P>
            </div>
          </div>
        </Container>
      </section>

      {/* Chapters Section */}
      <section id="chapters" className="py-16">
        <Container size="normal">
          <div className="text-center mb-12">
            <H2>Course Contents</H2>
            <P className="text-center text-muted-foreground">
              Explore the mathematical foundations essential for machine learning
            </P>
          </div>
          
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </Container>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 bg-muted/30">
        <Container size="narrow">
          <div className="text-center">
            <H2>Ready to Begin?</H2>
            <P className="text-muted-foreground mb-8">
              Start your journey into the mathematical foundations of machine learning. 
              Each chapter builds upon the previous one, creating a comprehensive understanding.
            </P>
            
            <div className="space-y-4">
              <Link
                href={`/${chapters[0]?.slug || 'linear-algebra'}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium text-lg"
              >
                Begin with {chapters[0]?.title || 'Linear Algebra'}
              </Link>
              
              <P className="text-sm text-muted-foreground">
                No prerequisites required • Self-paced learning • Interactive content
              </P>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

interface ChapterCardProps {
  chapter: Chapter
}

function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link 
      href={`/${chapter.slug}`}
      className="block p-6 border border-border rounded-lg hover:bg-accent transition-colors group"
    >
      <div className="flex items-start space-x-4">
        <div className="text-2xl flex-shrink-0">{chapter.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <H3 className="mb-2 group-hover:text-foreground transition-colors">
                {chapter.title}
              </H3>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={cn(
                  'px-2 py-1 rounded-full border text-xs font-medium',
                  getDifficultyColor(chapter.difficulty)
                )}>
                  {chapter.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatReadingTime(chapter.readingTime)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Chapter {chapter.order}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground group-hover:text-foreground transition-colors ml-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <P className="text-muted-foreground mb-4">
            {chapter.description}
          </P>
          
          {/* Prerequisites */}
          {chapter.prerequisites.length > 0 && (
            <div className="mb-4">
              <span className="text-xs text-muted-foreground">Prerequisites: </span>
              <span className="text-xs text-muted-foreground">
                {chapter.prerequisites.join(', ')}
              </span>
            </div>
          )}
          
          {/* Section count */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {chapter.sections.length} sections
            </span>
            <div className="flex flex-wrap gap-1">
              {chapter.sections.slice(0, 3).map((section) => (
                <span 
                  key={section.id}
                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                >
                  {section.title}
                </span>
              ))}
              {chapter.sections.length > 3 && (
                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                  +{chapter.sections.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}