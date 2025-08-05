import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { H2, P } from '@/lib/utils/typography'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Optimization Theory | Interactive ML Mathematics',
  description: 'Mathematical optimization techniques including gradient descent and algorithms used to train machine learning models.',
  keywords: ['optimization', 'gradient descent', 'convex optimization', 'machine learning', 'algorithms'],
}

export default function OptimizationPage() {
  const chapter = getChapterBySlug('optimization')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('optimization')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <div className="prose prose-lg max-w-none">
        <H2>Optimization Theory</H2>
        
        <P>
          This chapter covers mathematical optimization techniques used in machine learning.
          Content will be added here.
        </P>
      </div>
    </ChapterLayout>
  )
}