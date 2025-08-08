import type { Metadata } from 'next'
import { ChapterLayout } from '@/components/layout/ChapterLayout'
import { getChapterBySlug } from '@/lib/data/chapters'
import { getChapterNavigation } from '@/lib/utils/navigation'
import { notFound } from 'next/navigation'
import { SafeMDXContent } from '@/components/content/MDXContent'
import CalculusContent from '@/content/calculus/index.mdx'

export const metadata: Metadata = {
  title: 'Calculus | Interactive ML Mathematics',
  description: 'Learn differential and integral calculus concepts essential for understanding machine learning algorithms.',
  keywords: ['calculus', 'derivatives', 'integrals', 'optimization', 'machine learning', 'mathematics'],
}

export default function CalculusPage() {
  const chapter = getChapterBySlug('calculus')
  
  if (!chapter) {
    notFound()
  }
  
  const navigation = getChapterNavigation('calculus')
  
  return (
    <ChapterLayout
      chapter={chapter}
      previousChapter={navigation?.previous}
      nextChapter={navigation?.next}
    >
      <SafeMDXContent>
        <CalculusContent />
      </SafeMDXContent>
    </ChapterLayout>
  )
}