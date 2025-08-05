// Re-export the useTheme hook from ThemeProvider for convenience
export { useTheme } from '@/components/providers/ThemeProvider'

// Type definitions for theme system
export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
}