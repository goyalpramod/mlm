// components/content/MathErrorBoundary.tsx
'use client'

import React from 'react'

interface SafeMathProps {
  children: React.ReactNode
  latex?: string
}

export function SafeMath({ children, latex }: SafeMathProps) {
  try {
    return <>{children}</>
  } catch (error) {
    console.warn('Math rendering error:', error)
    return (
      <span className="text-red-500 text-sm font-mono">
        [Math Error: {latex || 'Invalid LaTeX'}]
      </span>
    )
  }
}