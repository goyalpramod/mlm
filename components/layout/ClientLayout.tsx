'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Layout } from '@/components/layout/Layout'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  )
}