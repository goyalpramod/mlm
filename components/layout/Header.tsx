'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo/Title Area */}
        <div className="flex items-center space-x-2">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">∑</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">
                ML Mathematics
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Interactive Learning
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Area - Placeholder for future navigation */}
        <nav className="hidden md:flex items-center space-x-6" role="navigation">
          <Link 
            href="/linear-algebra" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Linear Algebra
          </Link>
          <Link 
            href="/probability" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Probability
          </Link>
          <Link 
            href="/optimization" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Optimization
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button - Placeholder for future mobile nav */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open navigation menu"
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}