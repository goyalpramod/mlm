export interface ChapterFrontmatter {
  title: string
  description: string
  order: number
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  prerequisites: string[]
  learningObjectives: string[]
  keywords?: string[]
  lastUpdated?: string
  author?: string
  slug?: string
}

export interface SectionFrontmatter {
  title: string
  order: number
  estimatedTime?: string
  description?: string
}

export interface MDXMetadata {
  frontmatter: ChapterFrontmatter
  content: React.ComponentType
  readingTime?: number
  wordCount?: number
}

export interface ContentMetadata {
  title: string
  description: string
  slug: string
  order: number
  estimatedTime: string
  difficulty: string
  prerequisites: string[]
  learningObjectives: string[]
  lastUpdated?: string
}