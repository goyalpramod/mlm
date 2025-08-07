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