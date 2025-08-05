import { ChapterFrontmatter, ContentMetadata } from '@/types/frontmatter'

/**
 * Parse reading time from estimated time string
 */
export function parseReadingTime(estimatedTime: string): number {
  const match = estimatedTime.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Convert frontmatter to content metadata
 */
export function frontmatterToMetadata(frontmatter: ChapterFrontmatter): ContentMetadata {
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    slug: frontmatter.slug || '',
    order: frontmatter.order,
    estimatedTime: frontmatter.estimatedTime,
    difficulty: frontmatter.difficulty,
    prerequisites: frontmatter.prerequisites,
    learningObjectives: frontmatter.learningObjectives,
    lastUpdated: frontmatter.lastUpdated
  }
}

/**
 * Validate required frontmatter fields
 */
export function validateFrontmatter(frontmatter: Partial<ChapterFrontmatter>): ChapterFrontmatter {
  const required = ['title', 'description', 'order', 'estimatedTime', 'difficulty', 'prerequisites', 'learningObjectives']
  
  for (const field of required) {
    if (!(field in frontmatter) || frontmatter[field as keyof ChapterFrontmatter] === undefined) {
      throw new Error(`Missing required frontmatter field: ${field}`)
    }
  }
  
  return frontmatter as ChapterFrontmatter
}

/**
 * Calculate word count from content string
 */
export function calculateWordCount(content: string): number {
  return content
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length
}

/**
 * Estimate reading time based on word count
 */
export function estimateReadingTime(wordCount: number, wordsPerMinute: number = 200): number {
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/[#*`]/g, '') // Remove markdown formatting
    .replace(/\n/g, ' ')   // Replace newlines with spaces
    .trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

/**
 * Error handling for content loading
 */
export class ContentLoadError extends Error {
  constructor(
    message: string,
    public readonly contentPath: string,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'ContentLoadError'
  }
}

/**
 * Safe content loader with error handling
 */
export async function safeLoadContent<T>(
  loader: () => Promise<T>,
  contentPath: string
): Promise<T> {
  try {
    return await loader()
  } catch (error) {
    throw new ContentLoadError(
      `Failed to load content from ${contentPath}`,
      contentPath,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}