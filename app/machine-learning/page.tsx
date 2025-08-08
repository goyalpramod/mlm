import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import MachineLearningContent from '@/content/machine-learning/index.mdx'

export const metadata: Metadata = {
  title: 'Machine Learning | Interactive ML Mathematics',
  description: 'Apply mathematical concepts to understand machine learning algorithms and their implementations.',
  keywords: ['machine learning', 'algorithms', 'neural networks', 'supervised learning', 'unsupervised learning'],
}

export default function MachineLearningPage() {
  const chapter = getChapterBySlug('machine-learning')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('machine-learning')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <SafeMDXContent>
        <MachineLearningContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}