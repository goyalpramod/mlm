// lib/utils/scrollUtils.ts
import { ScrollToOptions } from '@/types/navigation'

/**
 * Smooth scroll to element with offset for fixed headers
 */
export function scrollToElement(
  elementId: string, 
  options: ScrollToOptions = {}
): void {
  const { behavior = 'smooth', offset = 80 } = options
  
  const element = document.getElementById(elementId)
  if (!element) return
  
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset
  
  window.scrollTo({
    top: offsetPosition,
    behavior
  })
  
  // Update URL hash without triggering scroll
  if (window.history.replaceState) {
    window.history.replaceState(null, '', `#${elementId}`)
  }
}

/**
 * Get current scroll position
 */
export function getScrollPosition(): number {
  return window.pageYOffset || document.documentElement.scrollTop
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get the most visible heading element
 */
export function getMostVisibleHeading(headings: Element[]): Element | null {
  let mostVisible: Element | null = null
  let maxVisibleHeight = 0
  
  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Calculate visible height of the element
    const visibleTop = Math.max(0, rect.top)
    const visibleBottom = Math.min(windowHeight, rect.bottom)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)
    
    if (visibleHeight > maxVisibleHeight) {
      maxVisibleHeight = visibleHeight
      mostVisible = heading
    }
  })
  
  return mostVisible
}