export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
}

export interface ThemeToggleProps {
  className?: string
}