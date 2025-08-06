// lib/utils/smoothScroll.ts
import { ScrollConfig, getScrollConfig, respectsReducedMotion } from '@/lib/config/scrollConfig'

interface ScrollToOptions extends Partial<ScrollConfig> {
  element?: Element | string
  onComplete?: () => void
  onCancel?: () => void
}

class SmoothScroll {
  private activeAnimation: number | null = null
  private isScrolling = false

  // Easing functions
  private easingFunctions = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    cubicBezier: (t: number) => {
      // Approximation of cubic-bezier(0.4, 0.0, 0.2, 1)
      return t * t * (3 - 2 * t)
    }
  }

  public scrollTo(options: ScrollToOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any existing scroll
      this.cancel()

      const config = { ...getScrollConfig(), ...options }
      
      // Respect reduced motion preference
      if (respectsReducedMotion() && config.behavior === 'smooth') {
        config.behavior = 'instant'
        config.duration = 0
      }

      const targetElement = this.getTargetElement(options.element)
      if (!targetElement) {
        reject(new Error('Target element not found'))
        return
      }

      const targetPosition = this.getTargetPosition(targetElement, config.offset)
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition

      // If we're already at the target or very close, resolve immediately
      if (Math.abs(distance) < 1) {
        resolve()
        return
      }

      // For instant behavior or very short distances
      if (config.behavior === 'instant' || config.duration <= 0) {
        window.scrollTo(0, targetPosition)
        resolve()
        return
      }

      this.isScrolling = true
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / config.duration, 1)

        // Apply easing
        const easedProgress = this.applyEasing(progress, config.easing)
        const currentPosition = startPosition + (distance * easedProgress)

        window.scrollTo(0, currentPosition)

        if (progress < 1) {
          this.activeAnimation = requestAnimationFrame(animate)
        } else {
          this.cleanup()
          options.onComplete?.()
          resolve()
        }
      }

      this.activeAnimation = requestAnimationFrame(animate)

      // Handle user interruption
      const handleUserScroll = () => {
        this.cancel()
        options.onCancel?.()
        reject(new Error('Scroll interrupted by user'))
      }

      // Listen for user scroll interruption
      window.addEventListener('wheel', handleUserScroll, { once: true, passive: true })
      window.addEventListener('touchstart', handleUserScroll, { once: true, passive: true })
      window.addEventListener('keydown', handleUserScroll, { once: true, passive: true })

      // Cleanup listeners after animation
      setTimeout(() => {
        window.removeEventListener('wheel', handleUserScroll)
        window.removeEventListener('touchstart', handleUserScroll)
        window.removeEventListener('keydown', handleUserScroll)
      }, config.duration + 100)
    })
  }

  public cancel(): void {
    if (this.activeAnimation) {
      cancelAnimationFrame(this.activeAnimation)
      this.activeAnimation = null
    }
    this.cleanup()
  }

  public isActive(): boolean {
    return this.isScrolling
  }

  private getTargetElement(element?: Element | string): Element | null {
    if (!element) return document.documentElement

    if (typeof element === 'string') {
      // Handle ID selector
      if (element.startsWith('#')) {
        return document.getElementById(element.slice(1))
      }
      // Handle other selectors
      return document.querySelector(element)
    }

    return element
  }

  private getTargetPosition(element: Element, offset: number): number {
    if (element === document.documentElement) {
      return 0
    }

    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    return rect.top + scrollTop - offset
  }

  private applyEasing(progress: number, easing: string): number {
    // Handle CSS cubic-bezier values
    if (easing.startsWith('cubic-bezier')) {
      return this.easingFunctions.cubicBezier(progress)
    }

    // Handle named easing functions
    const easingFn = this.easingFunctions[easing as keyof typeof this.easingFunctions]
    return easingFn ? easingFn(progress) : progress
  }

  private cleanup(): void {
    this.isScrolling = false
  }
}

// Export singleton instance
export const smoothScroll = new SmoothScroll()

// Convenience functions
export function scrollToElement(
  element: Element | string, 
  options: Omit<ScrollToOptions, 'element'> = {}
): Promise<void> {
  return smoothScroll.scrollTo({ ...options, element })
}

export function scrollToTop(options: Omit<ScrollToOptions, 'element'> = {}): Promise<void> {
  return smoothScroll.scrollTo({ ...options, element: document.documentElement })
}

export function scrollToSection(
  sectionId: string, 
  options: Omit<ScrollToOptions, 'element'> = {}
): Promise<void> {
  return smoothScroll.scrollTo({ ...options, element: `#${sectionId}` })
}