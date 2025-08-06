// lib/utils/headingExtractor.ts
import { ToCItem, HeadingElement } from '@/types/navigation'

/**
 * Generate URL-safe slug from heading text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single
    .trim()
}

/**
 * Extract headings from DOM within a container
 */
export function extractHeadings(container: Element): HeadingElement[] {
  const headingSelector = 'h1, h2, h3, h4, h5, h6'
  const headingElements = container.querySelectorAll(headingSelector)
  
  return Array.from(headingElements).map((element) => {
    const level = parseInt(element.tagName.charAt(1))
    const title = element.textContent?.trim() || ''
    const existingId = element.id
    const slug = existingId || generateSlug(title)
    
    // Ensure element has an ID for navigation
    if (!element.id) {
      element.id = slug
    }
    
    return {
      id: slug,
      title,
      level,
      element
    }
  })
}

/**
 * Convert flat heading list to hierarchical ToC structure
 */
export function buildToCHierarchy(headings: HeadingElement[]): ToCItem[] {
  const toc: ToCItem[] = []
  const stack: ToCItem[] = []
  
  headings.forEach((heading) => {
    const item: ToCItem = {
      id: heading.id,
      title: heading.title,
      level: heading.level,
      slug: heading.id,
      children: []
    }
    
    // Find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // Top level item
      toc.push(item)
    } else {
      // Child item
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }
    
    stack.push(item)
  })
  
  return toc
}

/**
 * Flatten hierarchical ToC for easier processing
 */
export function flattenToC(items: ToCItem[]): ToCItem[] {
  const flattened: ToCItem[] = []
  
  function traverse(items: ToCItem[]) {
    items.forEach((item) => {
      flattened.push(item)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }
  
  traverse(items)
  return flattened
}