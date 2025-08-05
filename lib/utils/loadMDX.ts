import { ChapterFrontmatter, MDXMetadata } from '@/types/frontmatter'
import { ContentLoadError, safeLoadContent } from './contentLoader'

/**
 * Dynamically import MDX content
 */
export async function loadMDXContent(chapterSlug: string): Promise<MDXMetadata> {
  return safeLoadContent(async () => {
    let content: any
    let frontmatter: ChapterFrontmatter
    
    try {
      // Dynamic import based on chapter slug
      switch (chapterSlug) {
        case 'linear-algebra':
          content = await import('@/content/linear-algebra/index.mdx')
          break
        case 'matrices':
          content = await import('@/content/matrices/index.mdx')
          break
        case 'probability':
          content = await import('@/content/probability/index.mdx')
          break
        case 'statistics':
          content = await import('@/content/statistics/index.mdx')
          break
        case 'optimization':
          content = await import('@/content/optimization/index.mdx')
          break
        default:
          throw new Error(`Unknown chapter: ${chapterSlug}`)
      }

      // Extract frontmatter from the MDX module
      frontmatter = content.frontmatter || {}
      
      // Validate required frontmatter fields
      if (!frontmatter.title || !frontmatter.description) {
        throw new Error('Missing required frontmatter fields: title and description')
      }

      return {
        frontmatter,
        content: content.default,
      }
    } catch (error) {
      throw new Error(`Failed to load MDX content for ${chapterSlug}: ${error}`)
    }
  }, `content/${chapterSlug}/index.mdx`)
}

/**
 * Get all available chapter slugs
 */
export function getAvailableChapters(): string[] {
  return [
    'linear-algebra',
    'matrices', 
    'probability',
    'statistics',
    'optimization'
  ]
}

/**
 * Check if chapter exists
 */
export function isValidChapter(slug: string): boolean {
  return getAvailableChapters().includes(slug)
}

/**
 * Get chapter order for navigation
 */
export function getChapterOrder(slug: string): number {
  const order = {
    'linear-algebra': 1,
    'matrices': 2,
    'probability': 3,
    'statistics': 4,
    'optimization': 5
  }
  return order[slug as keyof typeof order] || 0
}

/**
 * Get next chapter slug
 */
export function getNextChapter(currentSlug: string): string | null {
  const chapters = getAvailableChapters()
  const currentIndex = chapters.indexOf(currentSlug)
  
  if (currentIndex === -1 || currentIndex === chapters.length - 1) {
    return null
  }
  
  return chapters[currentIndex + 1]
}

/**
 * Get previous chapter slug
 */
export function getPreviousChapter(currentSlug: string): string | null {
  const chapters = getAvailableChapters()
  const currentIndex = chapters.indexOf(currentSlug)
  
  if (currentIndex <= 0) {
    return null
  }
  
  return chapters[currentIndex - 1]
}