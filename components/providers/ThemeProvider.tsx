'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get theme from localStorage or system preference
    const getInitialTheme = (): Theme => {
      if (typeof window === 'undefined') return 'light'
      
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    setMounted(true)

    // Apply theme to document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(initialTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Update localStorage and DOM when theme changes
    localStorage.setItem('theme', theme)
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}