// components/visualizations/linear-algebra/VectorBreakout.tsx
'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface VectorBreakoutProps {
  className?: string
}

export function VectorBreakout({ className }: VectorBreakoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const gameStateRef = useRef({
    ball: { x: 250, y: 300, vx: 3, vy: -3, radius: 8, maxSpeed: 5 },
    paddle: { x: 200, y: 360, width: 100, height: 12 },
    blocks: [] as { x: number, y: number, width: number, height: number, active: boolean }[],
    gameStarted: false,
    gameOver: false,
    isResetting: false
  })

  const [gameStarted, setGameStarted] = useState(false)

  // Initialize blocks
  const initializeBlocks = useCallback(() => {
    const blocks = []
    const rows = 4
    const cols = 8
    const blockWidth = 50
    const blockHeight = 20
    const padding = 5
    
    // Center the blocks horizontally
    const totalWidth = cols * blockWidth + (cols - 1) * padding
    const offsetX = (500 - totalWidth) / 2  // Center on 500px canvas
    const offsetY = 50

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        blocks.push({
          x: offsetX + col * (blockWidth + padding),
          y: offsetY + row * (blockHeight + padding),
          width: blockWidth,
          height: blockHeight,
          active: true
        })
      }
    }
    
    gameStateRef.current.blocks = blocks
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    const state = gameStateRef.current
    state.isResetting = true
    state.ball = { x: 250, y: 300, vx: 3, vy: -3, radius: 8, maxSpeed: 5 }
    state.paddle = { x: 200, y: 360, width: 100, height: 12 }
    state.gameStarted = false
    state.gameOver = false
    initializeBlocks()
    setGameStarted(false)
    
    // Clear resetting flag after a brief moment
    setTimeout(() => {
      state.isResetting = false
    }, 100)
  }, [initializeBlocks])

  // Draw arrow inside ball
  const drawBallWithArrow = (ctx: CanvasRenderingContext2D, ball: any) => {
    // Ball as a simple black dot
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#000000'
    ctx.fill()

    // Arrow showing velocity direction and magnitude - black arrow extending from ball
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    const maxArrowLength = ball.radius * 2.5  // Much longer arrow
    const arrowLength = Math.min(maxArrowLength, (speed / ball.maxSpeed) * maxArrowLength)
    
    const angle = Math.atan2(ball.vy, ball.vx)
    const arrowStartX = ball.x + Math.cos(angle) * ball.radius  // Start from edge of ball
    const arrowStartY = ball.y + Math.sin(angle) * ball.radius
    const arrowEndX = ball.x + Math.cos(angle) * (ball.radius + arrowLength)
    const arrowEndY = ball.y + Math.sin(angle) * (ball.radius + arrowLength)
    
    // Arrow shaft - black, extending from ball
    ctx.beginPath()
    ctx.moveTo(arrowStartX, arrowStartY)
    ctx.lineTo(arrowEndX, arrowEndY)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Arrow head - black
    const headSize = 8
    const headAngle1 = angle - Math.PI + 0.3
    const headAngle2 = angle - Math.PI - 0.3
    
    ctx.beginPath()
    ctx.moveTo(arrowEndX, arrowEndY)
    ctx.lineTo(arrowEndX + Math.cos(headAngle1) * headSize, arrowEndY + Math.sin(headAngle1) * headSize)
    ctx.moveTo(arrowEndX, arrowEndY)
    ctx.lineTo(arrowEndX + Math.cos(headAngle2) * headSize, arrowEndY + Math.sin(headAngle2) * headSize)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()
  }

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (state.gameStarted && !state.gameOver) {
      // Update ball position
      state.ball.x += state.ball.vx
      state.ball.y += state.ball.vy
      
      // Wall collisions
      if (state.ball.x <= state.ball.radius || state.ball.x >= canvas.width - state.ball.radius) {
        state.ball.vx = -state.ball.vx
      }
      if (state.ball.y <= state.ball.radius) {
        state.ball.vy = -state.ball.vy
      }
      
      // Auto reset if ball falls below paddle
      if (state.ball.y > canvas.height + state.ball.radius && !state.isResetting) {
        resetGame()
        return
      }
      
      // Paddle collision
      if (state.ball.y + state.ball.radius >= state.paddle.y &&
          state.ball.y - state.ball.radius <= state.paddle.y + state.paddle.height &&
          state.ball.x >= state.paddle.x &&
          state.ball.x <= state.paddle.x + state.paddle.width) {
        state.ball.vy = -Math.abs(state.ball.vy) // Always bounce up
        
        // Add some horizontal variation based on where it hits the paddle
        const hitPos = (state.ball.x - state.paddle.x) / state.paddle.width
        state.ball.vx = (hitPos - 0.5) * 4 + state.ball.vx * 0.5
      }
      
      // Block collisions
      state.blocks.forEach(block => {
        if (!block.active) return
        
        if (state.ball.x + state.ball.radius >= block.x &&
            state.ball.x - state.ball.radius <= block.x + block.width &&
            state.ball.y + state.ball.radius >= block.y &&
            state.ball.y - state.ball.radius <= block.y + block.height) {
          
          block.active = false
          state.ball.vy = -state.ball.vy
          
          // Slow down the ball smoothly
          state.ball.vx *= 0.98
          state.ball.vy *= 0.98
        }
      })
      
      // Check win condition
      if (state.blocks.every(block => !block.active)) {
        state.gameOver = true
      }
    }
    
    // Always draw the static elements (blocks, paddle, ball)
    // Draw blocks with rounded corners
    state.blocks.forEach(block => {
      if (block.active) {
        const radius = 4
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.roundRect(block.x, block.y, block.width, block.height, radius)
        ctx.fill()
      }
    })
    
    // Draw paddle (simple rectangle)
    ctx.fillStyle = '#000000'
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height)
    
    // Draw ball with arrow
    drawBallWithArrow(ctx, state.ball)
    
    // Draw start message
    if (!state.gameStarted && !state.gameOver && !state.isResetting) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.font = '20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Click to start!', canvas.width / 2, canvas.height / 2 + 50)
    }
    
    // Draw win message
    if (state.gameOver && state.blocks.every(block => !block.active)) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.font = '20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('You Won!', canvas.width / 2, canvas.height / 2)
      ctx.font = '14px system-ui'
      ctx.fillText('Click to play again', canvas.width / 2, canvas.height / 2 + 30)
    }
    
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [resetGame])

  // Mouse move handler
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    
    const state = gameStateRef.current
    state.paddle.x = Math.max(0, Math.min(canvas.width - state.paddle.width, mouseX - state.paddle.width / 2))
  }, [])

  // Click handler
  const handleClick = useCallback(() => {
    const state = gameStateRef.current
    
    if (!state.gameStarted || state.gameOver) {
      resetGame()
      state.gameStarted = true
      setGameStarted(true)
    }
  }, [resetGame])

  // Initialize game
  useEffect(() => {
    initializeBlocks()
    gameLoop()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeBlocks, gameLoop])

  return (
    <div className={cn('my-8', className)}>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="mx-auto cursor-crosshair bg-white"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      
      <div className="text-center mt-4">
        <div className="text-sm text-gray-600">
          🎯 Watch the arrow inside the ball - it shows speed and direction!
        </div>
      </div>
    </div>
  )
}