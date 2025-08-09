// components/visualizations/linear-algebra/VectorBreakout.tsx
'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils/cn'

interface VectorBreakoutProps {
  className?: string
}

export function VectorBreakout({ className }: VectorBreakoutProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const gameStateRef = useRef({
    ball: { x: 250, y: 300, vx: 3, vy: -3, radius: 8, maxSpeed: 5 },
    paddle: { x: 200, y: 360, width: 100, height: 12 },
    blocks: [] as { x: number, y: number, width: number, height: number, active: boolean, id: string }[],
    gameStarted: false,
    gameOver: false,
    isResetting: false
  })

  const [gameStarted, setGameStarted] = useState(false)
  const [gameMessage, setGameMessage] = useState('Click to start!')

  const width = 500
  const height = 400

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
    const offsetX = (width - totalWidth) / 2
    const offsetY = 50

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        blocks.push({
          x: offsetX + col * (blockWidth + padding),
          y: offsetY + row * (blockHeight + padding),
          width: blockWidth,
          height: blockHeight,
          active: true,
          id: `block-${row}-${col}`
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
    setGameMessage('Click to start!')
    
    // Clear resetting flag after a brief moment
    setTimeout(() => {
      state.isResetting = false
    }, 100)
  }, [initializeBlocks])

  // Draw arrow for ball velocity
  const drawVelocityArrow = useCallback((svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, ball: any) => {
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    const maxArrowLength = ball.radius * 2.5
    const arrowLength = Math.min(maxArrowLength, (speed / ball.maxSpeed) * maxArrowLength)
    
    const angle = Math.atan2(ball.vy, ball.vx)
    const arrowStartX = ball.x + Math.cos(angle) * ball.radius
    const arrowStartY = ball.y + Math.sin(angle) * ball.radius
    const arrowEndX = ball.x + Math.cos(angle) * (ball.radius + arrowLength)
    const arrowEndY = ball.y + Math.sin(angle) * (ball.radius + arrowLength)
    
    // Remove existing arrow
    svg.select('.velocity-arrow').remove()
    
    if (arrowLength > 0) {
      const arrowGroup = svg.append('g').attr('class', 'velocity-arrow')
      
      // Arrow shaft
      arrowGroup.append('line')
        .attr('x1', arrowStartX)
        .attr('y1', arrowStartY)
        .attr('x2', arrowEndX)
        .attr('y2', arrowEndY)
        .attr('stroke', '#000000')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
      
      // Arrow head
      const headSize = 8
      const headAngle1 = angle - Math.PI + 0.3
      const headAngle2 = angle - Math.PI - 0.3
      
      arrowGroup.append('line')
        .attr('x1', arrowEndX)
        .attr('y1', arrowEndY)
        .attr('x2', arrowEndX + Math.cos(headAngle1) * headSize)
        .attr('y2', arrowEndY + Math.sin(headAngle1) * headSize)
        .attr('stroke', '#000000')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
      
      arrowGroup.append('line')
        .attr('x1', arrowEndX)
        .attr('y1', arrowEndY)
        .attr('x2', arrowEndX + Math.cos(headAngle2) * headSize)
        .attr('y2', arrowEndY + Math.sin(headAngle2) * headSize)
        .attr('stroke', '#000000')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
    }
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const state = gameStateRef.current
    
    if (state.gameStarted && !state.gameOver) {
      // Update ball position
      state.ball.x += state.ball.vx
      state.ball.y += state.ball.vy
      
      // Wall collisions
      if (state.ball.x <= state.ball.radius || state.ball.x >= width - state.ball.radius) {
        state.ball.vx = -state.ball.vx
      }
      if (state.ball.y <= state.ball.radius) {
        state.ball.vy = -state.ball.vy
      }
      
      // Auto reset if ball falls below paddle
      if (state.ball.y > height + state.ball.radius && !state.isResetting) {
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
        setGameMessage('You Won! Click to play again')
      }
    }
    
    // Update visual elements
    // Update blocks
    const blocks = svg.selectAll('.block')
      .data(state.blocks.filter(b => b.active), (d: any) => d.id)
    
    blocks.enter()
      .append('rect')
      .attr('class', 'block')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', '#000000')
      .merge(blocks as any)
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .attr('width', (d: any) => d.width)
      .attr('height', (d: any) => d.height)
    
    blocks.exit().remove()
    
    // Update paddle
    svg.select('.paddle')
      .attr('x', state.paddle.x)
      .attr('y', state.paddle.y)
      .attr('width', state.paddle.width)
      .attr('height', state.paddle.height)
    
    // Update ball
    svg.select('.ball')
      .attr('cx', state.ball.x)
      .attr('cy', state.ball.y)
      .attr('r', state.ball.radius)
    
    // Update velocity arrow
    drawVelocityArrow(svg, state.ball)
    
    // Update message
    const messageText = !state.gameStarted && !state.gameOver && !state.isResetting ? 'Click to start!' :
                       state.gameOver && state.blocks.every(block => !block.active) ? 'You Won! Click to play again' : ''
    
    svg.select('.game-message')
      .style('opacity', messageText ? 1 : 0)
      .text(messageText)
    
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [resetGame, drawVelocityArrow])

  // Mouse move handler
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return
    
    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    
    const state = gameStateRef.current
    state.paddle.x = Math.max(0, Math.min(width - state.paddle.width, mouseX - state.paddle.width / 2))
  }, [])

  // Click handler
  const handleClick = useCallback(() => {
    const state = gameStateRef.current
    
    if (!state.gameStarted || state.gameOver) {
      resetGame()
      state.gameStarted = true
      setGameStarted(true)
      setGameMessage('')
    }
  }, [resetGame])

  // Initialize SVG and start game loop
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    
    // Clear any existing content
    svg.selectAll('*').remove()
    
    // Initialize blocks
    initializeBlocks()
    
    // Create static elements
    // Paddle
    svg.append('rect')
      .attr('class', 'paddle')
      .attr('fill', '#000000')
    
    // Ball
    svg.append('circle')
      .attr('class', 'ball')
      .attr('fill', '#000000')
    
    // Game message
    svg.append('text')
      .attr('class', 'game-message')
      .attr('x', width / 2)
      .attr('y', height / 2 + 50)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'system-ui')
      .attr('font-size', '20px')
      .attr('fill', 'rgba(0, 0, 0, 0.7)')
      .text('Click to start!')
    
    // Start game loop
    gameLoop()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeBlocks, gameLoop])

  return (
    <div className={cn('my-8', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto cursor-crosshair bg-white border border-gray-200 rounded-lg"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ display: 'block' }}
      />
      
      <div className="text-center mt-4">
        <div className="text-sm text-gray-600">
          🎯 Watch the arrow inside the ball - it shows speed and direction!
        </div>
      </div>
    </div>
  )
}