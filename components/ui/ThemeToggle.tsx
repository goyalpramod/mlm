'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Don't render until mounted on client
  if (!mounted) {
    return (
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
        disabled
        aria-label="Loading theme toggle"
        type="button"
      >
        <div className="h-5 w-5 animate-pulse bg-gray-300 rounded" />
      </button>
    )
  }
  
  return <MountedThemeToggle />
}

function MountedThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}