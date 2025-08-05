// components/math/KaTeX.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils/cn'

interface KaTeXProps {
  children: string
  displayMode?: boolean
  className?: string
  throwOnError?: boolean
}

export function KaTeX({ 
  children, 
  displayMode = false, 
  className,
  throwOnError = false 
}: KaTeXProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    if (elementRef.current) {
      try {
        katex.render(children, elementRef.current, {
          displayMode,
          throwOnError,
          strict: false,
          macros: {
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\Q': '\\mathbb{Q}',
            '\\C': '\\mathbb{C}',
            '\\vec': '\\mathbf{#1}',
            '\\norm': '\\left\\|#1\\right\\|',
            '\\abs': '\\left|#1\\right|',
            '\\argmax': '\\operatorname{argmax}',
            '\\argmin': '\\operatorname{argmin}',
            '\\trace': '\\operatorname{tr}',
            '\\rank': '\\operatorname{rank}',
            '\\diag': '\\operatorname{diag}',
            '\\det': '\\operatorname{det}',
          }
        })
      } catch (error) {
        console.warn('KaTeX rendering error:', error)
        if (elementRef.current) {
          elementRef.current.textContent = children
        }
      }
    }
  }, [children, displayMode, throwOnError])
  
  return (
    <span 
      ref={elementRef}
      className={cn(
        displayMode ? 'katex-display' : 'katex',
        displayMode && 'block text-center my-4',
        className
      )}
    />
  )
}

// Convenience components
export function InlineMath({ children, className }: { children: string, className?: string }) {
  return <KaTeX className={className}>{children}</KaTeX>
}

export function DisplayMath({ children, className }: { children: string, className?: string }) {
  return <KaTeX displayMode className={className}>{children}</KaTeX>
}