'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <div id="root" className="relative flex min-h-screen flex-col">
        <ThemeToggle />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}