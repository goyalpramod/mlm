import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { H2, P } from '@/lib/utils/typography'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Probability Theory | Interactive ML Mathematics',
  description: 'Learn probability fundamentals, random variables, and distributions essential for machine learning.',
  keywords: ['probability theory', 'random variables', 'distributions', 'bayes theorem', 'machine learning'],
}

export default function ProbabilityPage() {
  const chapter = getChapterBySlug('probability')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('probability')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <div className="prose prose-lg max-w-none">
        <H2>Probability Theory</H2>
        
        <P>
          This chapter covers probability fundamentals essential for machine learning.
          Content will be added here.
        </P>
      </div>
    </ChapterLayout>
  )
}