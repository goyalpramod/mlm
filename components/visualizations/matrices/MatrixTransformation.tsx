// components/visualizations/MatrixTransformation.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import * as THREE from 'three'
import { DisplayMath, InlineMath } from '@/components/math/KaTeX'

interface MatrixTransformationProps {
  className?: string
  initialMatrix?: [number, number, number, number] // [a, b, c, d] for 2x2 matrix
  initialVector?: [number, number]
  showEigenAnalysis?: boolean
}

interface Matrix2D {
  a: number
  b: number
  c: number
  d: number
}

interface Vector2D {
  x: number
  y: number
}

export function MatrixTransformation({
  className,
  initialMatrix = [1.0, 0.5, 0.5, 1.0],
  initialVector = [2.0, 3.0],
  showEigenAnalysis = true
}: MatrixTransformationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  // State for interactive controls
  const [matrix, setMatrix] = useState<Matrix2D>({
    a: initialMatrix[0],
    b: initialMatrix[1], 
    c: initialMatrix[2],
    d: initialMatrix[3]
  })
  
  const [vector, setVector] = useState<Vector2D>({
    x: initialVector[0],
    y: initialVector[1]
  })
  
  const [isDragging, setIsDragging] = useState<'vector' | 'result' | null>(null)
  
  // Computed values
  const transformedVector = {
    x: matrix.a * vector.x + matrix.b * vector.y,
    y: matrix.c * vector.x + matrix.d * vector.y
  }
  
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c
  
  // Eigenvalue calculation for 2x2 matrix
  const trace = matrix.a + matrix.d
  const det = determinant
  const discriminant = trace * trace - 4 * det
  
  const eigenvalues = discriminant >= 0 ? {
    lambda1: (trace + Math.sqrt(discriminant)) / 2,
    lambda2: (trace - Math.sqrt(discriminant)) / 2
  } : {
    lambda1: trace / 2,
    lambda2: Math.sqrt(-discriminant) / 2 // imaginary part
  }
  
  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40 // pixels per unit
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--muted').trim()
    ctx.fillRect(0, 0, width, height)
    
    // Draw grid
    ctx.strokeStyle = '#666666'
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 2])
    
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue
      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, 0)
      ctx.lineTo(centerX + i * scale, height)
      ctx.stroke()
      
      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, centerY - i * scale)
      ctx.lineTo(width, centerY - i * scale)
      ctx.stroke()
    }
    
    // Draw axes
    ctx.setLineDash([])
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    
    // X-axis
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
    
    // Y-axis
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    
    // Draw matrix column vectors (basis vectors after transformation)
    const a1 = { x: matrix.a, y: -matrix.c } // Flip Y for canvas coordinates
    const a2 = { x: matrix.b, y: -matrix.d }
    
    // Draw basis vector a1 (blue)
    drawVector(ctx, centerX, centerY, a1.x * scale, a1.y * scale, '#3b82f6', 'a₁')
    
    // Draw basis vector a2 (green)
    drawVector(ctx, centerX, centerY, a2.x * scale, a2.y * scale, '#10b981', 'a₂')
    
    // Draw original vector v (red)
    drawVector(ctx, centerX, centerY, vector.x * scale, -vector.y * scale, '#ef4444', 'v')
    
    // Draw transformed vector Av (orange)
    drawVector(ctx, centerX, centerY, transformedVector.x * scale, -transformedVector.y * scale, '#f97316', 'Av')
    
    // Draw connection line from v to Av
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX + vector.x * scale, centerY - vector.y * scale)
    ctx.lineTo(centerX + transformedVector.x * scale, centerY - transformedVector.y * scale)
    ctx.stroke()
    ctx.setLineDash([])
    
  }, [matrix, vector, transformedVector])
  
  // Vector drawing helper
  function drawVector(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number, 
    endX: number,
    endY: number,
    color: string,
    label: string
  ) {
    const headSize = 8
    const angle = Math.atan2(endY, endX)
    
    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + endX, startY + endY)
    ctx.stroke()
    
    // Draw arrowhead
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(startX + endX, startY + endY)
    ctx.lineTo(
      startX + endX - headSize * Math.cos(angle - Math.PI / 6),
      startY + endY - headSize * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      startX + endX - headSize * Math.cos(angle + Math.PI / 6),
      startY + endY - headSize * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()
    
    // Draw label
    ctx.fillStyle = color
    ctx.font = '14px sans-serif'
    ctx.fillText(label, startX + endX + 10, startY + endY - 5)
  }
  
  // Mouse interaction handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const scale = 40
    
    // Check if clicking near vector endpoint
    const vectorEndX = centerX + vector.x * scale
    const vectorEndY = centerY - vector.y * scale
    const resultEndX = centerX + transformedVector.x * scale
    const resultEndY = centerY - transformedVector.y * scale
    
    const distanceToVector = Math.sqrt((x - vectorEndX) ** 2 + (y - vectorEndY) ** 2)
    const distanceToResult = Math.sqrt((x - resultEndX) ** 2 + (y - resultEndY) ** 2)
    
    if (distanceToVector < 20) {
      setIsDragging('vector')
    } else if (distanceToResult < 20) {
      setIsDragging('result')
    }
  }
  
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const scale = 40
    
    const newX = (x - centerX) / scale
    const newY = -(y - centerY) / scale // Flip Y coordinate
    
    if (isDragging === 'vector') {
      setVector({ x: newX, y: newY })
    }
    // Note: dragging result vector would require inverse matrix calculation
  }
  
  const handleMouseUp = () => {
    setIsDragging(null)
  }
  
  return (
    <div className={cn('math-viz-container', className)}>
      {/* Interactive Canvas */}
      <div className="interactive-plot">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      {/* Math Equations */}
      <div className="math-equations">
        <DisplayMath>
          {`A = \\begin{pmatrix} ${matrix.a.toFixed(2)} & ${matrix.b.toFixed(2)} \\\\ ${matrix.c.toFixed(2)} & ${matrix.d.toFixed(2)} \\end{pmatrix}`}
        </DisplayMath>
        
        <DisplayMath>
          {`v = \\begin{pmatrix} ${vector.x.toFixed(2)} \\\\ ${vector.y.toFixed(2)} \\end{pmatrix}`}
        </DisplayMath>
        
        <DisplayMath>
          {`Av = \\begin{pmatrix} ${transformedVector.x.toFixed(2)} \\\\ ${transformedVector.y.toFixed(2)} \\end{pmatrix}`}
        </DisplayMath>
        
        {showEigenAnalysis && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Analysis:</div>
            <DisplayMath>
              {`\\det(A) = ${determinant.toFixed(3)}`}
            </DisplayMath>
            <DisplayMath>
              {discriminant >= 0 
                ? `\\lambda_1 = ${eigenvalues.lambda1.toFixed(3)}, \\lambda_2 = ${eigenvalues.lambda2.toFixed(3)}`
                : `\\lambda = ${eigenvalues.lambda1.toFixed(3)} \\pm ${eigenvalues.lambda2.toFixed(3)}i`
              }
            </DisplayMath>
          </div>
        )}
        
        {/* Interactive Controls */}
        <div className="math-controls">
          <div className="math-slider">
            <label>Matrix A₁₁:</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={matrix.a}
              onChange={(e) => setMatrix(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
            />
            <span className="text-xs text-center">{matrix.a.toFixed(1)}</span>
          </div>
          
          <div className="math-slider">
            <label>Matrix A₁₂:</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={matrix.b}
              onChange={(e) => setMatrix(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
            />
            <span className="text-xs text-center">{matrix.b.toFixed(1)}</span>
          </div>
          
          <div className="math-slider">
            <label>Matrix A₂₁:</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={matrix.c}
              onChange={(e) => setMatrix(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
            />
            <span className="text-xs text-center">{matrix.c.toFixed(1)}</span>
          </div>
          
          <div className="math-slider">
            <label>Matrix A₂₂:</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={matrix.d}
              onChange={(e) => setMatrix(prev => ({ ...prev, d: parseFloat(e.target.value) }))}
            />
            <span className="text-xs text-center">{matrix.d.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          💡 Drag the red vector (v) to see how the transformation changes. The orange vector (Av) shows the result.
        </div>
      </div>
    </div>
  )
}