// lib/navigation/hashManager.ts
import { scrollToSection } from '@/lib/utils/smoothScroll'

interface HashChangeEvent {
  oldHash: string
  newHash: string
  element?: Element | null
}

type HashChangeListener = (event: HashChangeEvent) => void

class HashManager {
  private listeners: HashChangeListener[] = []
  private currentHash: string = ''
  private isUpdating: boolean = false

  constructor() {
    this.currentHash = this.getCurrentHash()
    this.initialize()
  }

  private initialize(): void {
    if (typeof window === 'undefined') return

    // Listen for hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this), { passive: true })
    
    // Handle initial hash on page load
    if (this.currentHash) {
      this.navigateToHash(this.currentHash, { silent: true })
    }
  }

  /**
   * Navigate to a section by hash
   */
  public async navigateToHash(hash: string, options: { 
    silent?: boolean
    updateUrl?: boolean
    smooth?: boolean
  } = {}): Promise<void> {
    const { silent = false, updateUrl = true, smooth = true } = options

    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    const element = document.getElementById(cleanHash)

    if (!element) {
      console.warn(`Element with id "${cleanHash}" not found`)
      return
    }

    // Update URL if requested
    if (updateUrl && !silent) {
      this.updateHash(cleanHash)
    }

    // Scroll to element
    if (smooth) {
      try {
        await scrollToSection(cleanHash)
      } catch (error) {
        // Fallback to instant scroll if smooth scroll fails
        element.scrollIntoView({ block: 'start' })
      }
    } else {
      element.scrollIntoView({ block: 'start' })
    }

    // Notify listeners
    if (!silent) {
      this.notifyListeners({
        oldHash: this.currentHash,
        newHash: cleanHash,
        element
      })
    }

    this.currentHash = cleanHash
  }

  /**
   * Update the URL hash without triggering navigation
   */
  public updateHash(hash: string): void {
    if (this.isUpdating) return

    this.isUpdating = true
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    
    if (cleanHash !== this.currentHash) {
      const newUrl = cleanHash ? `#${cleanHash}` : window.location.pathname + window.location.search
      
      try {
        history.replaceState(null, '', newUrl)
        this.currentHash = cleanHash
      } catch (error) {
        console.warn('Failed to update URL hash:', error)
      }
    }
    
    this.isUpdating = false
  }

  /**
   * Get current hash from URL
   */
  public getCurrentHash(): string {
    if (typeof window === 'undefined') return ''
    return window.location.hash.slice(1)
  }

  /**
   * Generate a shareable URL for a section
   */
  public generateSectionUrl(sectionId: string): string {
    if (typeof window === 'undefined') return `#${sectionId}`
    
    const { protocol, host, pathname, search } = window.location
    return `${protocol}//${host}${pathname}${search}#${sectionId}`
  }

  /**
   * Check if a hash corresponds to an existing element
   */
  public isValidHash(hash: string): boolean {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    return !!document.getElementById(cleanHash)
  }

  /**
   * Get all valid section hashes on the page
   */
  public getValidHashes(): string[] {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    return Array.from(headings).map(heading => heading.id).filter(Boolean)
  }

  /**
   * Find the next valid hash after the current one
   */
  public getNextHash(): string | null {
    const validHashes = this.getValidHashes()
    const currentIndex = validHashes.indexOf(this.currentHash)
    
    if (currentIndex === -1 || currentIndex === validHashes.length - 1) {
      return null
    }
    
    return validHashes[currentIndex + 1]
  }

  /**
   * Find the previous valid hash before the current one
   */
  public getPreviousHash(): string | null {
    const validHashes = this.getValidHashes()
    const currentIndex = validHashes.indexOf(this.currentHash)
    
    if (currentIndex <= 0) {
      return null
    }
    
    return validHashes[currentIndex - 1]
  }

  /**
   * Navigate to the next section
   */
  public async navigateToNext(): Promise<boolean> {
    const nextHash = this.getNextHash()
    if (!nextHash) return false
    
    await this.navigateToHash(nextHash)
    return true
  }

  /**
   * Navigate to the previous section
   */
  public async navigateToPrevious(): Promise<boolean> {
    const previousHash = this.getPreviousHash()
    if (!previousHash) return false
    
    await this.navigateToHash(previousHash)
    return true
  }

  /**
   * Add a listener for hash changes
   */
  public addListener(listener: HashChangeListener): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Clear the current hash
   */
  public clearHash(): void {
    this.updateHash('')
  }

  /**
   * Handle hash change events
   */
  private handleHashChange(): void {
    if (this.isUpdating) return

    const newHash = this.getCurrentHash()
    const oldHash = this.currentHash

    if (newHash !== oldHash) {
      this.navigateToHash(newHash, { silent: false, updateUrl: false })
    }
  }

  /**
   * Notify all listeners of hash changes
   */
  private notifyListeners(event: HashChangeEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in hash change listener:', error)
      }
    })
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('hashchange', this.handleHashChange.bind(this))
    }
    this.listeners = []
  }
}

// Export singleton instance
export const hashManager = new HashManager()

// Convenience hooks for React components
export function useHashNavigation() {
  return {
    navigateToHash: hashManager.navigateToHash.bind(hashManager),
    updateHash: hashManager.updateHash.bind(hashManager),
    getCurrentHash: hashManager.getCurrentHash.bind(hashManager),
    generateSectionUrl: hashManager.generateSectionUrl.bind(hashManager),
    navigateToNext: hashManager.navigateToNext.bind(hashManager),
    navigateToPrevious: hashManager.navigateToPrevious.bind(hashManager),
    clearHash: hashManager.clearHash.bind(hashManager)
  }
}