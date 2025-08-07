// components/content/MDXComponents.tsx
import React from 'react'
import { cn } from '@/lib/utils/cn'
import { generateSlug } from '@/lib/utils/headingExtractor'

interface MDXComponentProps {
  className?: string
  children: React.ReactNode
}

// Custom heading components with anchor support
export function MDXHeading({ 
  level, 
  children, 
  className, 
  ...props 
}: MDXComponentProps & { level: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  
  // Generate ID from heading text for navigation
  const headingText = typeof children === 'string' ? children : 
    React.Children.toArray(children).join('')
  const id = generateSlug(headingText)
  
  const baseClasses = 'font-semibold text-foreground scroll-mt-20'
  const sizeClasses = {
    1: 'text-3xl sm:text-4xl lg:text-5xl mb-6 mt-0 font-tinos',
    2: 'text-2xl sm:text-3xl lg:text-4xl mb-4 mt-12 first:mt-0',
    3: 'text-xl sm:text-2xl lg:text-3xl mb-3 mt-8 first:mt-0',
    4: 'text-lg sm:text-xl mb-2 mt-6 first:mt-0',
    5: 'text-base sm:text-lg mb-2 mt-4 first:mt-0',
    6: 'text-sm sm:text-base mb-1 mt-4 first:mt-0'
  }
  
  return React.createElement(
    Component,
    {
      id,
      className: cn(baseClasses, sizeClasses[level], className),
      ...props
    },
    children
  )
}

// Enhanced blockquote
export function BlockQuote({ children, className, ...props }: MDXComponentProps) {
  return (
    <blockquote 
      className={cn(
        'border-l-4 border-border pl-6 py-2 my-6',
        'italic text-muted-foreground bg-muted/30 rounded-r-lg',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// Enhanced code block
export function CodeBlock({ 
  children, 
  className, 
  language,
  ...props 
}: MDXComponentProps & { language?: string }) {
  return (
    <div className="my-6">
      {language && (
        <div className="text-xs text-muted-foreground mb-2 font-mono">
          {language}
        </div>
      )}
      <pre 
        className={cn(
          'p-4 bg-muted rounded-lg border border-border overflow-x-auto',
          'font-mono text-sm text-foreground',
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    </div>
  )
}