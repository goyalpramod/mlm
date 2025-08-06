export interface Chapter {
  id: string
  title: string
  slug: string
  order: number
  published: boolean
}

export interface ChapterNavigation {
  current: Chapter
  previous?: Chapter
  next?: Chapter
}

export interface TableOfContentsItem {
  id: string
  title: string
  slug: string
  level: number // 1 for sections, 2 for subsections
  isActive?: boolean
  children?: TableOfContentsItem[]
}

export interface ChapterMetadata {
  title: string
  description: string
  keywords: string[]
  estimatedReadingTime: number
  lastUpdated: string
  difficulty: string
  prerequisites: string[]
}

export interface BookProgress {
  chaptersCompleted: string[]
  currentChapter?: string
  totalProgress: number // percentage
  lastAccessed: string
}