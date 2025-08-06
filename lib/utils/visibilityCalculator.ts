// lib/utils/visibilityCalculator.ts
export interface SectionVisibility {
  id: string
  element: Element
  visibility: number // 0-1
  isInView: boolean
  distanceFromTop: number
  height: number
  weight: number // Calculated importance score
}

export interface VisibilityConfig {
  headerOffset: number
  footerOffset: number
  minVisibilityThreshold: number
  weightFactors: {
    visibility: number
    position: number
    size: number
  }
}

const defaultConfig: VisibilityConfig = {
  headerOffset: 80,
  footerOffset: 0,
  minVisibilityThreshold: 0.1,
  weightFactors: {
    visibility: 0.6,
    position: 0.3,
    size: 0.1
  }
}

export class VisibilityCalculator {
  private config: VisibilityConfig

  constructor(config: Partial<VisibilityConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Calculate visibility for all sections
   */
  public calculateSectionVisibilities(elements: Element[]): SectionVisibility[] {
    const viewportHeight = window.innerHeight
    const effectiveViewportTop = this.config.headerOffset
    const effectiveViewportBottom = viewportHeight - this.config.footerOffset
    const effectiveViewportHeight = effectiveViewportBottom - effectiveViewportTop

    return elements.map(element => {
      const rect = element.getBoundingClientRect()
      const id = element.id || ''

      // Calculate intersection with effective viewport
      const intersectionTop = Math.max(rect.top, effectiveViewportTop)
      const intersectionBottom = Math.min(rect.bottom, effectiveViewportBottom)
      const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop)

      // Calculate visibility percentage
      const visibility = rect.height > 0 ? intersectionHeight / rect.height : 0
      const isInView = visibility >= this.config.minVisibilityThreshold

      // Calculate distance from ideal reading position (top 1/3 of viewport)
      const idealPosition = effectiveViewportTop + (effectiveViewportHeight / 3)
      const elementCenter = rect.top + (rect.height / 2)
      const distanceFromIdeal = Math.abs(elementCenter - idealPosition)
      const normalizedDistance = distanceFromIdeal / effectiveViewportHeight

      // Calculate weight based on multiple factors
      const weight = this.calculateWeight(visibility, normalizedDistance, rect.height, effectiveViewportHeight)

      return {
        id,
        element,
        visibility,
        isInView,
        distanceFromTop: rect.top,
        height: rect.height,
        weight
      }
    })
  }

  /**
   * Find the most relevant section based on weighted scoring
   */
  public findMostRelevantSection(visibilities: SectionVisibility[]): SectionVisibility | null {
    const visibleSections = visibilities.filter(section => section.isInView)
    
    if (visibleSections.length === 0) {
      return null
    }

    // Sort by weight (descending) and return the highest scored section
    return visibleSections.sort((a, b) => b.weight - a.weight)[0]
  }

  /**
   * Calculate reading progress through visible sections
   */
  public calculateReadingProgress(visibilities: SectionVisibility[]): number {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTop = window.pageYOffset
    
    if (documentHeight <= 0) return 1

    return Math.min(scrollTop / documentHeight, 1)
  }

  /**
   * Get sections that are currently in view
   */
  public getVisibleSections(visibilities: SectionVisibility[]): SectionVisibility[] {
    return visibilities.filter(section => section.isInView)
  }

  /**
   * Calculate weighted importance score for a section
   */
  private calculateWeight(
    visibility: number, 
    distanceFromIdeal: number, 
    elementHeight: number, 
    viewportHeight: number
  ): number {
    const { weightFactors } = this.config

    // Visibility factor (0-1, higher is better)
    const visibilityScore = visibility

    // Position factor (0-1, closer to ideal reading position is better)
    const positionScore = Math.max(0, 1 - distanceFromIdeal)

    // Size factor (normalize element height, prefer moderate sizes)
    const normalizedHeight = elementHeight / viewportHeight
    const sizeScore = normalizedHeight > 2 ? 0.5 : Math.min(normalizedHeight, 1)

    // Calculate weighted score
    return (
      visibilityScore * weightFactors.visibility +
      positionScore * weightFactors.position +
      sizeScore * weightFactors.size
    )
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<VisibilityConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Check if an element is significantly visible
   */
  public isSignificantlyVisible(element: Element, threshold = 0.5): boolean {
    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const effectiveTop = this.config.headerOffset
    const effectiveBottom = viewportHeight - this.config.footerOffset

    const intersectionTop = Math.max(rect.top, effectiveTop)
    const intersectionBottom = Math.min(rect.bottom, effectiveBottom)
    const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop)

    const visibility = rect.height > 0 ? intersectionHeight / rect.height : 0
    return visibility >= threshold
  }

  /**
   * Get the next section to read based on current scroll position
   */
  public getNextSection(visibilities: SectionVisibility[]): SectionVisibility | null {
    const viewportTop = window.pageYOffset + this.config.headerOffset

    // Find sections below current viewport
    const sectionsBelow = visibilities.filter(section => {
      const rect = section.element.getBoundingClientRect()
      const absoluteTop = rect.top + window.pageYOffset
      return absoluteTop > viewportTop
    })

    // Return the closest section below
    return sectionsBelow.sort((a, b) => a.distanceFromTop - b.distanceFromTop)[0] || null
  }

  /**
   * Get the previous section based on current scroll position
   */
  public getPreviousSection(visibilities: SectionVisibility[]): SectionVisibility | null {
    const viewportTop = window.pageYOffset + this.config.headerOffset

    // Find sections above current viewport
    const sectionsAbove = visibilities.filter(section => {
      const rect = section.element.getBoundingClientRect()
      const absoluteTop = rect.top + window.pageYOffset
      return absoluteTop < viewportTop
    })

    // Return the closest section above
    return sectionsAbove.sort((a, b) => b.distanceFromTop - a.distanceFromTop)[0] || null
  }
}

// Export singleton instance
export const visibilityCalculator = new VisibilityCalculator()