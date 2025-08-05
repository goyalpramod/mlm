import { Chapter, ChapterNavigation, TableOfContentsItem } from '@/types/content'
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

/**
 * Get the next chapter in the sequence
 */
export function getNextChapter(currentSlug: string): Chapter | null {
  const navigation = getChapterNavigation(currentSlug)
  return navigation?.next || null
}

/**
 * Get the previous chapter in the sequence
 */
export function getPreviousChapter(currentSlug: string): Chapter | null {
  const navigation = getChapterNavigation(currentSlug)
  return navigation?.previous || null
}

/**
 * Generate breadcrumb navigation for a chapter
 */
export function generateBreadcrumbs(chapterSlug: string, sectionSlug?: string): Array<{title: string, href: string}> {
  const breadcrumbs = [
    { title: 'Home', href: '/' }
  ]
  
  const chapter = getChapterBySlug(chapterSlug)
  if (!chapter) return breadcrumbs
  
  breadcrumbs.push({
    title: chapter.title,
    href: `/${chapter.slug}`
  })
  
  if (sectionSlug) {
    const section = chapter.sections.find(s => s.slug === sectionSlug)
    if (section) {
      breadcrumbs.push({
        title: section.title,
        href: `/${chapter.slug}#${section.slug}`
      })
    }
  }
  
  return breadcrumbs
}

/**
 * Generate table of contents for a chapter
 */
export function generateTableOfContents(chapter: Chapter): TableOfContentsItem[] {
  return chapter.sections.map(section => ({
    id: section.id,
    title: section.title,
    slug: section.slug,
    level: 1,
    children: section.subsections?.map(subsection => ({
      id: subsection.id,
      title: subsection.title,
      slug: subsection.slug,
      level: 2
    }))
  }))
}

/**
 * Calculate total reading time for a chapter
 */
export function calculateChapterReadingTime(chapter: Chapter): number {
  return chapter.sections.reduce((total, section) => {
    const sectionTime = section.estimatedTime || 0
    const subsectionTime = section.subsections?.reduce((subTotal, subsection) => {
      return subTotal + (subsection.estimatedTime || 0)
    }, 0) || 0
    
    return total + sectionTime + subsectionTime
  }, 0)
}

/**
 * Get chapter progress percentage
 */
export function getChapterProgress(chapterSlug: string, completedSections: string[] = []): number {
  const chapter = getChapterBySlug(chapterSlug)
  if (!chapter) return 0
  
  const totalSections = chapter.sections.length
  const completedCount = chapter.sections.filter(section => 
    completedSections.includes(section.id)
  ).length
  
  return totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0
}

/**
 * Get all chapter URLs for sitemap generation
 */
export function getAllChapterUrls(): string[] {
  return chapters
    .filter(chapter => chapter.published)
    .map(chapter => `/${chapter.slug}`)
}

/**
 * Check if a chapter exists and is published
 */
export function isValidChapterSlug(slug: string): boolean {
  const chapter = getChapterBySlug(slug)
  return chapter ? chapter.published : false
}

/**
 * Get chapter difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'advanced':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min read`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} hr read`
  }
  
  return `${hours}h ${remainingMinutes}m read`
}