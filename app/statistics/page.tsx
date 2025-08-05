import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import StatisticsContent from '@/content/statistics/index.mdx'

export const metadata: Metadata = {
  title: 'Statistics for ML | Interactive ML Mathematics',
  description: 'Statistical methods, hypothesis testing, and inference techniques used in machine learning.',
  keywords: ['statistics', 'hypothesis testing', 'confidence intervals', 'regression analysis', 'machine learning'],
}

export default function StatisticsPage() {
  const chapter = getChapterBySlug('statistics')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('statistics')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <SafeMDXContent>
        <StatisticsContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}