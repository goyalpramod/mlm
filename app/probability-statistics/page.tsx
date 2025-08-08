import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import ProbabilityStatisticsContent from '@/content/probability-statistics/index.mdx'

export const metadata: Metadata = {
  title: 'Probability & Statistics | Interactive ML Mathematics',
  description: 'Learn probability theory, statistics, and distributions essential for machine learning.',
  keywords: ['probability', 'statistics', 'distributions', 'bayes theorem', 'hypothesis testing', 'machine learning'],
}

export default function ProbabilityStatisticsPage() {
  const chapter = getChapterBySlug('probability-statistics')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('probability-statistics')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <SafeMDXContent>
        <ProbabilityStatisticsContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}