import { Chapter, ChapterNavigation } from '@/types/content'
import { chapters, getChapterBySlug } from '@/lib/data/chapters'

/**
 * Get navigation information for a chapter (previous and next chapters)
 */
export function getChapterNavigation(currentSlug: string): ChapterNavigation | null {
  const publishedChapters = chapters
    .filter(chapter => chapter.published)
    .sort((a, b) => a.order - b.order)
  
  const currentIndex = publishedChapters.findIndex(chapter => chapter.slug === currentSlug)
  
  if (currentIndex === -1) {
    return null
  }
  
  const current = publishedChapters[currentIndex]
  const previous = currentIndex > 0 ? publishedChapters[currentIndex - 1] : undefined
  const next = currentIndex < publishedChapters.length - 1 ? publishedChapters[currentIndex + 1] : undefined
  
  return {
    current,
    previous,
    next
  }
}