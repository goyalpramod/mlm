// types/navigation.ts
export interface ToCItem {
  id: string
  title: string
  level: number // 1-6 for h1-h6
  slug: string
  chapter?: string
  isActive?: boolean
  children?: ToCItem[]
}

export interface ToCState {
  isExpanded: boolean
  activeItem: string | null
  items: ToCItem[]
}

export interface HeadingElement {
  id: string
  title: string
  level: number
  element?: Element
}

export interface ScrollToOptions {
  behavior?: 'smooth' | 'instant'
  offset?: number
}