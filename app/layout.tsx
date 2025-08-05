import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive ML Mathematics',
  description: 'An interactive web book for mathematics in machine learning',
  keywords: ['mathematics', 'machine learning', 'linear algebra', 'calculus', 'statistics'],
  authors: [{ name: 'Pramod Goyal' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Interactive ML Mathematics',
    description: 'An interactive web book for mathematics in machine learning',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive ML Mathematics',
    description: 'An interactive web book for mathematics in machine learning'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased">
        <div id="root" className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}