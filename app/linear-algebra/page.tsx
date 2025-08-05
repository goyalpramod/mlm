import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { H2, P } from '@/lib/utils/typography'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Linear Algebra | Interactive ML Mathematics',
  description: 'Learn vectors, matrices, and linear transformations - the mathematical foundation of machine learning algorithms.',
  keywords: ['linear algebra', 'vectors', 'matrices', 'eigenvalues', 'machine learning', 'mathematics'],
}

export default function LinearAlgebraPage() {
  const chapter = getChapterBySlug('linear-algebra')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('linear-algebra')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <div className="prose prose-lg max-w-none">
        <H2>Linear Algebra</H2>
        
        <P>
          This chapter covers the foundations of linear algebra for machine learning.
          Content will be added here.
        </P>
      </div>
    </ChapterLayout>
  )
}