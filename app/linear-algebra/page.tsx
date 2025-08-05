import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import LinearAlgebraContent from '@/content/linear-algebra/index.mdx'

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
      <SafeMDXContent>
        <LinearAlgebraContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}