import React from 'react'
import { cn } from '@/lib/utils/cn'

interface MDXContentProps {
  children: React.ReactNode
  className?: string
}

export function MDXContent({ children, className }: MDXContentProps) {
  return (
    <div className={cn('mdx-content', className)}>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </div>
  )
}

// Error boundary for MDX content
interface MDXErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode },
  MDXErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): MDXErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MDX Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-8 p-6 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Content Loading Error
          </h3>
          <p className="text-red-700 mb-4">
            There was an error loading this content. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-sm text-red-600">
              <summary className="font-medium cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
                {this.state.error.message}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
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