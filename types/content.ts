export interface Chapter {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  order: number
  readingTime: number // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  prerequisites: string[]
  learningObjectives: string[]
  sections: Section[]
  published: boolean
}

export interface Section {
  id: string
  title: string
  slug: string
  order: number
  subsections?: Subsection[]
  estimatedTime?: number // in minutes
}

export interface Subsection {
  id: string
  title: string
  slug: string
  order: number
  estimatedTime?: number // in minutes
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