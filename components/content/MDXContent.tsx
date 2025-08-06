// components/content/MDXContent.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface MDXContentProps {
  children: React.ReactNode
  className?: string
}

export function MDXContent({ children, className }: MDXContentProps) {
  return (
    <div 
      className={cn('mdx-content', className)}
      data-content="true"
    >
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </div>
  )
}

// Convert class component to functional component with error boundary hook
interface MDXErrorBoundaryState {
  hasError: boolean
  error?: Error
}

function useErrorBoundary() {
  const [state, setState] = React.useState<MDXErrorBoundaryState>({ hasError: false })

  const resetError = () => setState({ hasError: false })

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setState({ hasError: true, error: error.error })
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return { ...state, resetError }
}

export function MDXErrorBoundary({ children }: { children: React.ReactNode }) {
  const { hasError, error, resetError } = useErrorBoundary()

  if (hasError) {
    return (
      <div className="my-8 p-6 border border-red-200 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Content Loading Error
        </h3>
        <p className="text-red-700 mb-4">
          There was an error loading this content. Please try refreshing the page.
        </p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-sm text-red-600 mt-4">
            <summary className="font-medium cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return <>{children}</>
}

// Wrapper that combines content and error boundary
export function SafeMDXContent({ children, className }: MDXContentProps) {
  return (
    <MDXErrorBoundary>
      <MDXContent className={className}>
        {children}
      </MDXContent>
    </MDXErrorBoundary>
  )
}