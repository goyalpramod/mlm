import type { Metadata } from 'next'
import { ClientLayout } from '@/components/layout/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive ML Mathematics',
  description: 'An interactive web book for mathematics in machine learning',
  keywords: ['mathematics', 'machine learning', 'linear algebra', 'calculus', 'statistics'],
  authors: [{ name: 'Your Name' }],
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

export const viewport = {
  width: 'device-width',
  initialScale: 1
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* KaTeX CSS - load before any math content */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}