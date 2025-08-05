import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import OptimizationContent from '@/content/optimization/index.mdx'

export const metadata = {
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
      <SafeMDXContent>
        <OptimizationContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}