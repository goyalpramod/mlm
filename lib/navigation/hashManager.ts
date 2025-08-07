// lib/navigation/hashManager.ts

class HashManager {
  /**
   * Navigate to a section by hash
   */
  public async navigateToHash(hash: string): Promise<void> {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
    const element = document.getElementById(cleanHash)

    if (!element) {
      console.warn(`Element with id "${cleanHash}" not found`)
      return
    }

    // Update URL
    window.history.pushState(null, '', `#${cleanHash}`)

    // Scroll to element
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /**
   * Get current hash from URL
   */
  public getCurrentHash(): string {
    if (typeof window === 'undefined') return ''
    return window.location.hash.slice(1)
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
    const currentIndex = validHashes.indexOf(this.getCurrentHash())
    
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
    const currentIndex = validHashes.indexOf(this.getCurrentHash())
    
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
}

// Export singleton instance
export const hashManager = new HashManager()

// Convenience hook for React components
export function useHashNavigation() {
  return {
    navigateToHash: hashManager.navigateToHash.bind(hashManager),
    getCurrentHash: hashManager.getCurrentHash.bind(hashManager),
    navigateToNext: hashManager.navigateToNext.bind(hashManager),
    navigateToPrevious: hashManager.navigateToPrevious.bind(hashManager),
  }
}