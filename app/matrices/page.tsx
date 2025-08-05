import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { H2, P } from '@/lib/utils/typography'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Advanced Matrix Theory | Interactive ML Mathematics',
  description: 'Deep dive into matrix decompositions, transformations, and their applications in machine learning algorithms.',
  keywords: ['matrix theory', 'SVD', 'matrix decomposition', 'PCA', 'machine learning', 'linear algebra'],
}

export default function MatricesPage() {
  const chapter = getChapterBySlug('matrices')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('matrices')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <div className="prose prose-lg max-w-none">
        <H2>Advanced Matrix Theory</H2>
        
        <P>
          This chapter covers advanced matrix concepts and their applications in machine learning.
          Content will be added here.
        </P>
      </div>
    </ChapterLayout>
  )
}