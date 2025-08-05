import React from 'react'
import { cn } from '@/lib/utils/cn'

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
  
  const baseClasses = 'font-semibold text-foreground scroll-mt-16'
  const sizeClasses = {
    1: 'text-3xl sm:text-4xl lg:text-5xl mb-6 mt-0',
    2: 'text-2xl sm:text-3xl lg:text-4xl mb-4 mt-12 first:mt-0',
    3: 'text-xl sm:text-2xl lg:text-3xl mb-3 mt-8 first:mt-0',
    4: 'text-lg sm:text-xl mb-2 mt-6 first:mt-0',
    5: 'text-base sm:text-lg mb-2 mt-4 first:mt-0',
    6: 'text-sm sm:text-base mb-1 mt-4 first:mt-0'
  }
  
  return React.createElement(
    Component,
    {
      className: cn(baseClasses, sizeClasses[level], className),
      ...props
    },
    children
  )
}

// Mathematical content wrapper
export function MathContainer({ children, className, ...props }: MDXComponentProps) {
  return (
    <div 
      className={cn(
        'my-6 p-4 bg-muted rounded-lg border border-border overflow-x-auto',
        'text-center font-mono text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Inline math wrapper
export function InlineMathWrapper({ children, className, ...props }: MDXComponentProps) {
  return (
    <span 
      className={cn(
        'font-mono bg-muted px-1 py-0.5 rounded text-foreground text-sm',
        className
      )}
      {...props}
    >
      {children}
    </span>
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

// Callout box for important information
export function Callout({ 
  type = 'info', 
  children, 
  className, 
  title,
  ...props 
}: MDXComponentProps & { 
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string 
}) {
  const typeStyles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    success: 'border-green-200 bg-green-50 text-green-900'
  }
  
  return (
    <div 
      className={cn(
        'my-6 p-4 border rounded-lg',
        typeStyles[type],
        className
      )}
      {...props}
    >
      {title && (
        <div className="font-semibold mb-2">{title}</div>
      )}
      {children}
    </div>
  )
}

// Definition list for mathematical terms
export function DefinitionList({ children, className, ...props }: MDXComponentProps) {
  return (
    <dl 
      className={cn(
        'my-6 space-y-4',
        className
      )}
      {...props}
    >
      {children}
    </dl>
  )
}

export function DefinitionTerm({ children, className, ...props }: MDXComponentProps) {
  return (
    <dt 
      className={cn(
        'font-semibold text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </dt>
  )
}

export function DefinitionDescription({ children, className, ...props }: MDXComponentProps) {
  return (
    <dd 
      className={cn(
        'ml-4 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </dd>
  )
}