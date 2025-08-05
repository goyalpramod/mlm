import React from 'react'
import { cn } from './cn'

// Typography utility functions for consistent text styling

interface TypographyProps {
  className?: string
  children: React.ReactNode
}

// Heading components with proper hierarchy
export function H1({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h1', {
    className: cn(
      'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6',
      'leading-tight',
      className
    )
  }, children)
}

export function H2({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h2', {
    className: cn(
      'text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4',
      'leading-tight mt-12 first:mt-0',
      className
    )
  }, children)
}

export function H3({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h3', {
    className: cn(
      'text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-3',
      'leading-snug mt-8 first:mt-0',
      className
    )
  }, children)
}

export function H4({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h4', {
    className: cn(
      'text-lg sm:text-xl font-semibold text-foreground mb-2',
      'leading-snug mt-6 first:mt-0',
      className
    )
  }, children)
}

export function H5({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h5', {
    className: cn(
      'text-base sm:text-lg font-medium text-foreground mb-2',
      'leading-normal mt-4 first:mt-0',
      className
    )
  }, children)
}

export function H6({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('h6', {
    className: cn(
      'text-sm sm:text-base font-medium text-foreground mb-1',
      'leading-normal mt-4 first:mt-0',
      className
    )
  }, children)
}

// Paragraph and text components
export function P({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('p', {
    className: cn(
      'text-base sm:text-lg text-foreground leading-relaxed mb-4',
      'max-w-none',
      className
    )
  }, children)
}

export function Lead({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('p', {
    className: cn(
      'text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6',
      'font-light',
      className
    )
  }, children)
}

export function Small({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('small', {
    className: cn(
      'text-sm text-muted-foreground leading-normal',
      className
    )
  }, children)
}

export function Muted({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('p', {
    className: cn(
      'text-sm text-muted-foreground leading-normal',
      className
    )
  }, children)
}

// Mathematical content specific typography
export function MathBlock({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('div', {
    className: cn(
      'my-6 p-4 bg-muted rounded-lg overflow-x-auto',
      'text-center font-mono text-foreground',
      'border border-border',
      className
    )
  }, children)
}

export function InlineMath({ className, children }: TypographyProps): React.ReactElement {
  return React.createElement('span', {
    className: cn(
      'font-mono bg-muted px-1 py-0.5 rounded text-foreground',
      'text-sm',
      className
    )
  }, children)
}

// Utility classes as CSS-in-JS
export const typographyClasses = {
  // Headings
  h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight',
  h2: 'text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4 leading-tight mt-12 first:mt-0',
  h3: 'text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-3 leading-snug mt-8 first:mt-0',
  h4: 'text-lg sm:text-xl font-semibold text-foreground mb-2 leading-snug mt-6 first:mt-0',
  h5: 'text-base sm:text-lg font-medium text-foreground mb-2 leading-normal mt-4 first:mt-0',
  h6: 'text-sm sm:text-base font-medium text-foreground mb-1 leading-normal mt-4 first:mt-0',
  
  // Body text
  p: 'text-base sm:text-lg text-foreground leading-relaxed mb-4 max-w-none',
  lead: 'text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 font-light',
  small: 'text-sm text-muted-foreground leading-normal',
  muted: 'text-sm text-muted-foreground leading-normal',
  
  // Mathematical content
  mathBlock: 'my-6 p-4 bg-muted rounded-lg overflow-x-auto text-center font-mono text-foreground border border-border',
  inlineMath: 'font-mono bg-muted px-1 py-0.5 rounded text-foreground text-sm'
}