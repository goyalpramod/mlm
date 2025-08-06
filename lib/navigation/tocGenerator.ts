// lib/navigation/tocGenerator.ts
import { ToCItem } from '@/types/navigation'
import { extractHeadings, buildToCHierarchy } from '@/lib/utils/headingExtractor'

/**
 * Generate ToC from current page content
 */
export function generatePageToC(): ToCItem[] {
  if (typeof window === 'undefined') return []
  
  // Try multiple selectors to find content
  const contentContainer = 
    document.querySelector('main .mdx-content') || 
    document.querySelector('main') || 
    document.querySelector('[data-content]') ||
    document.body
  
  const headings = extractHeadings(contentContainer)
  
  if (headings.length === 0) {
    // Fallback: try to find headings in the entire document
    const allHeadings = extractHeadings(document.body)
    console.log('ToC Debug: Found headings in document:', allHeadings.length)
    return buildToCHierarchy(allHeadings)
  }
  
  console.log('ToC Debug: Found headings in container:', headings.length)
  return buildToCHierarchy(headings)
}

/**
 * Generate ToC from a specific container element
 */
export function generateToCFromContainer(container: Element): ToCItem[] {
  const headings = extractHeadings(container)
  return buildToCHierarchy(headings)
}

/**
 * Update ToC active states based on current active section
 */
export function updateToCActiveStates(
  tocItems: ToCItem[], 
  activeSection: string | null
): ToCItem[] {
  return tocItems.map((item) => ({
    ...item,
    isActive: item.id === activeSection,
    children: item.children ? updateToCActiveStates(item.children, activeSection) : undefined
  }))
}

/**
 * Find ToC item by ID
 */
export function findToCItem(items: ToCItem[], id: string): ToCItem | null {
  for (const item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children) {
      const found = findToCItem(item.children, id)
      if (found) return found
    }
  }
  return null
}