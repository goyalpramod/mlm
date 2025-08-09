// components/visualizations/linear-algebra/Vector.tsx
'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils/cn'

interface VectorProps {
  className?: string
  width?: number
  height?: number
}

export function Vector({ 
  className, 
  width = 600, 
  height = 400 
}: VectorProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear any existing content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG selection
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;')

    const markerBoxWidth = 30  
    const markerBoxHeight = 30
    const refX = 6           
    const refY = 15          
    const arrowPoints: [number, number][] = [[0, 4], [0, 26], [20, 15]]

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
      .attr('refX', refX)
      .attr('refY', refY)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', d3.line()(arrowPoints))
      .attr('stroke', 'black')
      .attr('fill', 'black')

    // Create coordinate system
    const margin = 50
    const centerX = width / 2
    const centerY = height / 2

    // X-axis
    svg.append('line')
      .attr('x1', margin)
      .attr('y1', centerY)
      .attr('x2', width - margin)
      .attr('y2', centerY)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)

    // Y-axis
    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', margin)
      .attr('x2', centerX)
      .attr('y2', height - margin)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)

    // Vector calculations
    const vectorAEndX = centerX + 60  // 3 units * 20 pixels per unit
    const vectorAEndY = centerY - 80  // 4 units * 20 pixels per unit (negative because SVG y increases downward)
    
    // Calculate magnitude and angle
    const vectorX = vectorAEndX - centerX  // 60
    const vectorY = centerY - vectorAEndY  // 80 (flip Y because SVG is upside down)
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY)
    const angleRadians = Math.atan2(vectorY, vectorX)
    const angleDegrees = (angleRadians * 180 / Math.PI).toFixed(1)

    // Create hover elements (initially hidden)
    
    // 1. Angle arc (theta)
    const angleArc = svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', 'rgba(255, 100, 100, 0.3)')
      .attr('stroke', '#ff6464')
      .attr('stroke-width', 2)
      .style('opacity', 0)

    // 2. Curved bracket along the line
    const midX = (centerX + vectorAEndX) / 2
    const midY = (centerY + vectorAEndY) / 2
    const offsetDistance = 15
    
    // Calculate perpendicular offset for bracket
    const lineLength = Math.sqrt((vectorAEndX - centerX) ** 2 + (vectorAEndY - centerY) ** 2)
    const perpX = -(vectorAEndY - centerY) / lineLength * offsetDistance
    const perpY = (vectorAEndX - centerX) / lineLength * offsetDistance
    
    const bracketPath = `M ${centerX + perpX * 0.3} ${centerY + perpY * 0.3} 
                         Q ${midX + perpX} ${midY + perpY} 
                         ${vectorAEndX + perpX * 0.3} ${vectorAEndY + perpY * 0.3}`

    const bracket = svg.append('path')
      .attr('d', bracketPath)
      .attr('fill', 'none')
      .attr('stroke', '#4a90e2')
      .attr('stroke-width', 2)
      .style('opacity', 0)

    // 3. Info box
    const infoBoxX = vectorAEndX + 25
    const infoBoxY = vectorAEndY - 50
    
    const infoBox = svg.append('g')
      .style('opacity', 0)

    const hoverArea = svg.append('line')
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', vectorAEndX)
    .attr('y2', vectorAEndY)
    .attr('stroke', 'transparent')  // Invisible
    .attr('stroke-width', 40)       // Much thicker for easy hovering
    .style('cursor', 'pointer')

    // Info box background
    infoBox.append('rect')
      .attr('x', infoBoxX)
      .attr('y', infoBoxY)
      .attr('width', 200)
      .attr('height', 60)
      .attr('fill', 'white')
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('rx', 8)
      .attr('ry', 8)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')

    // Info box text
    infoBox.append('text')
      .attr('x', infoBoxX + 10)
      .attr('y', infoBoxY + 20)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(`Magnitude = ${magnitude.toFixed(2)}`)

    infoBox.append('text')
      .attr('x', infoBoxX + 10)
      .attr('y', infoBoxY + 40)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(`Angle = ${angleDegrees}°`)

    // 4. Theta label
    const thetaLabel = svg.append('text')
      .attr('x', centerX + 25)
      .attr('y', centerY - 5)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ff6464')
      .text('θ')
      .style('opacity', 0)

    // Draw vector A with hover events
    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', vectorAEndX)
      .attr('y2', vectorAEndY)
      .attr('stroke', '#000000')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow)')
      .style('cursor', 'pointer')

      hoverArea
      .on('mouseover', function() {
        // Animate angle arc from 0 to full angle
        angleArc
          .transition()
          .duration(600)
          .style('opacity', 1)
          .attrTween('d', function() {
            const interpolate = d3.interpolate(0, angleRadians)
            return function(t) {
              const currentAngle = interpolate(t)
              return d3.arc()
                .innerRadius(0)
                .outerRadius(45)
                .startAngle(0)
                .endAngle(currentAngle)()
            }
          })
        
        // Show bracket with delay
        bracket
          .transition()
          .delay(300)
          .duration(400)
          .style('opacity', 1)
        
        // Show info box with delay
        infoBox
          .transition()
          .delay(500)
          .duration(400)
          .style('opacity', 1)
        
        // Show theta label
        thetaLabel
          .transition()
          .delay(200)
          .duration(300)
          .style('opacity', 1)
      })
      .on('mouseout', function() {
        // Hide all hover elements
        angleArc
          .transition()
          .duration(300)
          .style('opacity', 0)
        
        bracket
          .transition()
          .duration(300)
          .style('opacity', 0)
        
        infoBox
          .transition()
          .duration(300)
          .style('opacity', 0)
        
        thetaLabel
          .transition()
          .duration(300)
          .style('opacity', 0)
      })

    // Add vector label
    svg.append('text')
      .attr('x', vectorAEndX + 15)
      .attr('y', vectorAEndY - 5)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text('A')

  }, [width, height])

  return (
    <div className={cn('my-8', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto rounded-lg bg-white"
      />
      <div className="text-center mt-4 text-sm text-gray-600">
        Hover over the vector to see magnitude and angle information
      </div>
    </div>
  )
}