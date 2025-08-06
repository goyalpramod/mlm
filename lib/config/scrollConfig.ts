// lib/config/scrollConfig.ts
export interface ScrollConfig {
  duration: number
  easing: string
  offset: number
  behavior: 'smooth' | 'instant'
  threshold: number
}

export interface NavigationConfig {
  scroll: {
    default: ScrollConfig
    fast: ScrollConfig
    slow: ScrollConfig
  }
  intersection: {
    rootMargin: string
    threshold: number[]
  }
  performance: {
    throttleMs: number
    debounceMs: number
    enableRAF: boolean
  }
  accessibility: {
    respectReducedMotion: boolean
    announceNavigation: boolean
  }
}

export const defaultNavigationConfig: NavigationConfig = {
  scroll: {
    default: {
      duration: 800,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      offset: 80,
      behavior: 'smooth',
      threshold: 0.5
    },
    fast: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      offset: 80,
      behavior: 'smooth',
      threshold: 0.5
    },
    slow: {
      duration: 1200,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      offset: 80,
      behavior: 'smooth',
      threshold: 0.5
    }
  },
  intersection: {
    rootMargin: '-80px 0px -40% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  },
  performance: {
    throttleMs: 16,
    debounceMs: 100,
    enableRAF: true
  },
  accessibility: {
    respectReducedMotion: true,
    announceNavigation: true
  }
}

export function getScrollConfig(type: keyof NavigationConfig['scroll'] = 'default'): ScrollConfig {
  return defaultNavigationConfig.scroll[type]
}

export function respectsReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}