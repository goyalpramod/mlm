import { Chapter } from '@/types/content'

export const chapters: Chapter[] = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    slug: 'linear-algebra',
    order: 1,
    published: true
  },
  {
    id: 'matrices',
    title: 'Advanced Matrix Theory',
    slug: 'matrices',
    order: 2,
    published: true
  },
  {
    id: 'probability',
    title: 'Probability Theory',
    slug: 'probability',
    order: 3,
    published: true
  },
  {
    id: 'statistics',
    title: 'Statistics for ML',
    slug: 'statistics',
    order: 4,
    published: true
  },
  {
    id: 'optimization',
    title: 'Optimization Theory',
    slug: 'optimization',
    order: 5,
    published: true
  }
]

export const getChapterBySlug = (slug: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.slug === slug)
}

export const getChapterById = (id: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.id === id)
}

export const getPublishedChapters = (): Chapter[] => {
  return chapters.filter(chapter => chapter.published).sort((a, b) => a.order - b.order)
}