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
    id: 'calculus',
    title: 'Calculus',
    slug: 'calculus',
    order: 2,
    published: true
  },
  {
    id: 'probability-statistics',
    title: 'Probability & Statistics',
    slug: 'probability-statistics',
    order: 3,
    published: true
  },
  {
    id: 'optimization',
    title: 'Optimization',
    slug: 'optimization',
    order: 4,
    published: true
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    slug: 'machine-learning',
    order: 5,
    published: true
  }
]

export const getChapterBySlug = (slug: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.slug === slug)
}

export const getPublishedChapters = (): Chapter[] => {
  return chapters.filter(chapter => chapter.published).sort((a, b) => a.order - b.order)
}