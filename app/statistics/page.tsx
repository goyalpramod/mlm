import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { H2, P } from '@/lib/utils/typography'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'

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
      <div className="prose prose-lg max-w-none">
        <H2>Statistics for Machine Learning</H2>
        
        <P>
          This chapter covers statistical methods essential for machine learning.
          Content will be added here.
        </P>
      </div>
    </ChapterLayout>
  )
}