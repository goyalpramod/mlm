import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import MatricesContent from '@/content/matrices/index.mdx'

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
      <SafeMDXContent>
        <MatricesContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}