// components/visualizations/GradientDescentVisualization.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { DisplayMath, InlineMath } from '@/components/math/KaTeX'

interface GradientDescentVisualizationProps {
  className?: string
  functionType?: 'quadratic' | 'rosenbrock' | 'beale'
}

interface Point {
  x: number
  y: number
  z?: number
}

export function GradientDescentVisualization({
  className,
  functionType = 'quadratic'
}: GradientDescentVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const [learningRate, setLearningRate] = useState(0.1)
  const [currentPoint, setCurrentPoint] = useState<Point>({ x: 2, y: 2 })
  const [isRunning, setIsRunning] = useState(false)
  const [path, setPath] = useState<Point[]>([])
  const [iteration, setIteration] = useState(0)
  const [loss, setLoss] = useState(0)
  
  // Objective functions
  const functions = {
    quadratic: {
      name: 'Quadratic: f(x,y) = x² + y²',
      f: (x: number, y: number) => x*x + y*y,
      gradX: (x: number, y: number) => 2*x,
      gradY: (x: number, y: number) => 2*y,
      minimum: { x: 0, y: 0 }
    },
    rosenbrock: {
      name: 'Rosenbrock: f(x,y) = (1-x)² + 100(y-x²)²',
      f: (x: number, y: number) => (1-x)*(1-x) + 100*(y-x*x)*(y-x*x),
      gradX: (x: number, y: number) => -2*(1-x) - 400*x*(y-x*x),
      gradY: (x: number, y: number) => 200*(y-x*x),
      minimum: { x: 1, y: 1 }
    },
    beale: {
      name: 'Beale: f(x,y) = (1.5-x+xy)² + (2.25-x+xy²)² + (2.625-x+xy³)²',
      f: (x: number, y: number) => {
        const t1 = 1.5 - x + x*y
        const t2 = 2.25 - x + x*y*y
        const t3 = 2.625 - x + x*y*y*y
        return t1*t1 + t2*t2 + t3*t3
      },
      gradX: (x: number, y: number) => {
        const t1 = 1.5 - x + x*y
        const t2 = 2.25 - x + x*y*y
        const t3 = 2.625 - x + x*y*y*y
        return 2*t1*(-1 + y) + 2*t2*(-1 + y*y) + 2*t3*(-1 + y*y*y)
      },
      gradY: (x: number, y: number) => {
        const t1 = 1.5 - x + x*y
        const t2 = 2.25 - x + x*y*y
        const t3 = 2.625 - x + x*y*y*y
        return 2*t1*x + 2*t2*x*2*y + 2*t3*x*3*y*y
      },
      minimum: { x: 3, y: 0.5 }
    }
  }
  
  const currentFunction = functions[functionType]
  
  // Gradient descent step
  const performStep = () => {
    const gradX = currentFunction.gradX(currentPoint.x, currentPoint.y)
    const gradY = currentFunction.gradY(currentPoint.x, currentPoint.y)
    
    const newPoint = {
      x: currentPoint.x - learningRate * gradX,
      y: currentPoint.y - learningRate * gradY
    }
    
    const newLoss = currentFunction.f(newPoint.x, newPoint.y)
    
    setCurrentPoint(newPoint)
    setPath(prev => [...prev, newPoint])
    setIteration(prev => prev + 1)
    setLoss(newLoss)
    
    // Stop if converged or diverged
    if (Math.abs(gradX) < 0.001 && Math.abs(gradY) < 0.001) {
      setIsRunning(false)
    }
    if (newLoss > 1000) {
      setIsRunning(false)
    }
  }
  
  // Animation loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = window.setTimeout(() => {
        performStep()
      }, 200)
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isRunning, currentPoint, learningRate])
  
  // Canvas drawing
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
    const scale = 80
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw contour lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    const levels = [0.1, 0.5, 1, 2, 5, 10, 20, 50]
    
    for (const level of levels) {
      ctx.beginPath()
      // Simple contour approximation
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const distance = Math.sqrt(level) * (functionType === 'quadratic' ? 1 : 0.3)
        const x = centerX + distance * Math.cos(angle) * scale
        const y = centerY + distance * Math.sin(angle) * scale
        
        if (angle === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }
    
    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    
    // Draw minimum point
    const minX = centerX + currentFunction.minimum.x * scale
    const minY = centerY - currentFunction.minimum.y * scale
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(minX, minY, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw path
    if (path.length > 1) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      path.forEach((point, index) => {
        const x = centerX + point.x * scale
        const y = centerY - point.y * scale
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      
      // Draw path points
      path.forEach((point, index) => {
        const x = centerX + point.x * scale
        const y = centerY - point.y * scale
        
        ctx.fillStyle = index === path.length - 1 ? '#dc2626' : '#fca5a5'
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    
    // Draw current point
    const currentX = centerX + currentPoint.x * scale
    const currentY = centerY - currentPoint.y * scale
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw gradient arrow
    const gradX = currentFunction.gradX(currentPoint.x, currentPoint.y)
    const gradY = currentFunction.gradY(currentPoint.x, currentPoint.y)
    const gradMag = Math.sqrt(gradX*gradX + gradY*gradY)
    
    if (gradMag > 0.01) {
      const arrowLength = Math.min(50, gradMag * 20)
      const endX = currentX - (gradX / gradMag) * arrowLength
      const endY = currentY + (gradY / gradMag) * arrowLength
      
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(currentX, currentY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
      
      // Arrow head
      const angle = Math.atan2(endY - currentY, endX - currentX)
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - 10*Math.cos(angle - Math.PI/6), endY - 10*Math.sin(angle - Math.PI/6))
      ctx.lineTo(endX - 10*Math.cos(angle + Math.PI/6), endY - 10*Math.sin(angle + Math.PI/6))
      ctx.closePath()
      ctx.fill()
    }
    
  }, [currentPoint, path, functionType])
  
  const reset = () => {
    setIsRunning(false)
    setCurrentPoint({ x: 2, y: 2 })
    setPath([{ x: 2, y: 2 }])
    setIteration(0)
    setLoss(currentFunction.f(2, 2))
  }
  
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (isRunning) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const scale = 80
    
    const newX = (x - centerX) / scale
    const newY = -(y - centerY) / scale
    
    setCurrentPoint({ x: newX, y: newY })
    setPath([{ x: newX, y: newY }])
    setIteration(0)
    setLoss(currentFunction.f(newX, newY))
  }
  
  return (
    <div className={cn('math-viz-container', className)}>
      {/* Interactive Canvas */}
      <div className="interactive-plot">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
        />
      </div>
      
      {/* Math and Controls */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Gradient Descent Optimization</h3>
          <p className="text-sm text-muted-foreground">{currentFunction.name}</p>
        </div>
        
        <DisplayMath>
          \theta_{t+1} = \theta_t - \alpha \nabla f(\theta_t)
        </DisplayMath>
        
        <div className="space-y-2">
          <DisplayMath>
            {`\\text{Current: } (${currentPoint.x.toFixed(3)}, ${currentPoint.y.toFixed(3)})`}
          </DisplayMath>
          <DisplayMath>
            {`\\text{Loss: } ${loss.toFixed(6)}`}
          </DisplayMath>
          <DisplayMath>
            {`\\text{Iteration: } ${iteration}`}
          </DisplayMath>
        </div>
        
        <div className="math-controls">
          <div className="math-slider">
            <label>Learning Rate (α):</label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            />
            <span className="text-xs text-center">{learningRate.toFixed(2)}</span>
          </div>
          
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 bg-foreground text-background rounded hover:opacity-80"
            disabled={Math.abs(currentFunction.gradX(currentPoint.x, currentPoint.y)) < 0.001 && 
                     Math.abs(currentFunction.gradY(currentPoint.x, currentPoint.y)) < 0.001}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={performStep}
            className="px-4 py-2 border border-border rounded hover:bg-accent"
            disabled={isRunning}
          >
            Step
          </button>
          
          <button
            onClick={reset}
            className="px-4 py-2 border border-border rounded hover:bg-accent"
          >
            Reset
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔴 Current position</p>
          <p>🟢 Global minimum</p>
          <p>🔵 Gradient direction (negative for descent)</p>
          <p>💡 Click on the plot to set a new starting point</p>
        </div>
      </div>
    </div>
  )
}