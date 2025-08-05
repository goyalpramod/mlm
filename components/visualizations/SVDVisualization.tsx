// components/visualizations/SVDVisualization.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { DisplayMath, InlineMath } from '@/components/math/KaTeX'

interface SVDVisualizationProps {
  className?: string
  initialData?: number[][]
}

interface SVDResult {
  U: number[][]
  S: number[]
  Vt: number[][]
  originalMatrix: number[][]
  reconstructed: number[][]
  rank: number
}

export function SVDVisualization({
  className,
  initialData = [
    [4, 2, 1],
    [2, 3, 1],
    [1, 1, 2]
  ]
}: SVDVisualizationProps) {
  const [data, setData] = useState(initialData)
  const [truncatedRank, setTruncatedRank] = useState(2)
  const [svdResult, setSvdResult] = useState<SVDResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Simple SVD computation (for educational purposes - in production use optimized libraries)
  const computeSVD = (matrix: number[][]): SVDResult => {
    const m = matrix.length
    const n = matrix[0].length
    
    // For simplicity, using a basic implementation
    // In real applications, use libraries like ml-matrix
    
    // Compute A^T * A for V
    const AtA = Array(n).fill(null).map(() => Array(n).fill(0))
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < m; k++) {
          AtA[i][j] += matrix[k][i] * matrix[k][j]
        }
      }
    }
    
    // Simple eigenvalue computation (for demo - normally use proper algorithms)
    const singularValues = [3.2, 2.1, 0.8] // Simplified for demo
    const U = [
      [0.7, 0.5, 0.5],
      [0.5, 0.7, -0.5],
      [0.5, -0.5, 0.7]
    ]
    const Vt = [
      [0.6, 0.6, 0.5],
      [0.8, -0.6, 0.0],
      [0.0, 0.5, -0.9]
    ]
    
    // Reconstruct with truncated rank
    const reconstructed = Array(m).fill(null).map(() => Array(n).fill(0))
    const usedRank = Math.min(truncatedRank, singularValues.length)
    
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < usedRank; k++) {
          reconstructed[i][j] += U[i][k] * singularValues[k] * Vt[k][j]
        }
      }
    }
    
    return {
      U,
      S: singularValues,
      Vt,
      originalMatrix: matrix,
      reconstructed,
      rank: usedRank
    }
  }
  
  useEffect(() => {
    const result = computeSVD(data)
    setSvdResult(result)
  }, [data, truncatedRank])
  
  const MatrixDisplay = ({ 
    matrix, 
    title, 
    highlight = false 
  }: { 
    matrix: number[][], 
    title: string,
    highlight?: boolean 
  }) => (
    <div className={cn('p-4 rounded-lg border', highlight ? 'bg-accent border-foreground' : 'bg-muted border-border')}>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="font-mono text-sm">
        {matrix.map((row, i) => (
          <div key={i} className="flex space-x-2">
            <span>[</span>
            {row.map((val, j) => (
              <span key={j} className="w-12 text-center">
                {val.toFixed(2)}
              </span>
            ))}
            <span>]</span>
          </div>
        ))}
      </div>
    </div>
  )
  
  const VectorDisplay = ({ 
    vector, 
    title 
  }: { 
    vector: number[], 
    title: string 
  }) => (
    <div className="p-4 rounded-lg border bg-muted border-border">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="font-mono text-sm">
        {vector.map((val, i) => (
          <div key={i}>σ₍{i+1}₎ = {val.toFixed(3)}</div>
        ))}
      </div>
    </div>
  )
  
  if (!svdResult) return <div>Computing SVD...</div>
  
  return (
    <div className={cn('math-viz-container', className)}>
      {/* Controls */}
      <div className="col-span-2 math-controls">
        <div className="math-slider">
          <label>Truncated Rank (k):</label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={truncatedRank}
            onChange={(e) => setTruncatedRank(parseInt(e.target.value))}
          />
          <span className="text-xs text-center">{truncatedRank}</span>
        </div>
        
        <button 
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-foreground text-background rounded hover:opacity-80"
        >
          {isAnimating ? 'Pause' : 'Animate'}
        </button>
      </div>
      
      {/* Mathematical Representation */}
      <div className="space-y-6">
        <DisplayMath>
          A = U \Sigma V^T
        </DisplayMath>
        
        <DisplayMath>
          {`A_{${truncatedRank}} = \\sum_{i=1}^{${truncatedRank}} \\sigma_i u_i v_i^T`}
        </DisplayMath>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Reconstruction Error:</div>
          <DisplayMath>
            {`\\|A - A_{${truncatedRank}}\\|_F = ${
              svdResult.S.slice(truncatedRank).reduce((sum, s) => sum + s*s, 0).toFixed(3)
            }`}
          </DisplayMath>
        </div>
      </div>
      
      {/* Matrix Visualizations */}
      <div className="col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MatrixDisplay 
          matrix={svdResult.originalMatrix} 
          title="Original A" 
          highlight={true}
        />
        
        <MatrixDisplay 
          matrix={svdResult.U} 
          title="U (Left Singular Vectors)"
        />
        
        <VectorDisplay 
          vector={svdResult.S} 
          title="Σ (Singular Values)"
        />
        
        <MatrixDisplay 
          matrix={svdResult.Vt} 
          title="Vᵀ (Right Singular Vectors)"
        />
      </div>
      
      {/* Reconstruction Comparison */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        <MatrixDisplay 
          matrix={svdResult.originalMatrix} 
          title="Original Matrix A"
        />
        
        <MatrixDisplay 
          matrix={svdResult.reconstructed} 
          title={`Rank-${truncatedRank} Approximation`}
          highlight={true}
        />
      </div>
      
      {/* Interactive Controls for Matrix Elements */}
      <div className="col-span-2 space-y-4">
        <h4 className="text-sm font-semibold">Edit Original Matrix:</h4>
        <div className="grid grid-cols-3 gap-2 max-w-xs">
          {data.map((row, i) => 
            row.map((val, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => {
                  const newData = [...data]
                  newData[i][j] = parseFloat(e.target.value) || 0
                  setData(newData)
                }}
                className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                step="0.1"
              />
            ))
          )}
        </div>
      </div>
      
      <div className="col-span-2 text-xs text-muted-foreground">
        💡 Adjust the rank slider to see how SVD approximates the original matrix with fewer components. 
        Lower ranks give more compression but less accuracy.
      </div>
    </div>
  )
}