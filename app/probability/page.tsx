import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import ProbabilityContent from '@/content/probability/index.mdx'

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
      <SafeMDXContent>
        <ProbabilityContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}