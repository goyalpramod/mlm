'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils/cn'

interface VectorProps {
  className?: string
  width?: number
  height?: number
}

export function VectorAddition({ 
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
    const vectorAEndY = centerY - 80  // 4 units * 20 pixels per unit
    
    const vectorBEndX = centerX + 80  // 4 units * 20 pixels per unit
    const vectorBEndY = centerY - 20  // 1 unit * 20 pixels per unit
    
    const vectorCEndX = centerX + 140  // 7 units * 20 pixels per unit (A + B)
    const vectorCEndY = centerY - 100  // 5 units * 20 pixels per unit

    // Calculate moved B position (B starting from tip of A)
    const movedBStartX = vectorAEndX
    const movedBStartY = vectorAEndY
    const movedBEndX = vectorAEndX + (vectorBEndX - centerX)
    const movedBEndY = vectorAEndY + (vectorBEndY - centerY)

    // Draw vector A
    const vectorA = svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', vectorAEndX)
      .attr('y2', vectorAEndY)
      .attr('stroke', '#000000')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow)')

    // Add vector A label
    const vectorALabel = svg.append('text')
      .attr('x', vectorAEndX + 15)
      .attr('y', vectorAEndY - 5)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text('A')
      
    // Draw vector B
    const vectorB = svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', vectorBEndX)
      .attr('y2', vectorBEndY)
      .attr('stroke', '#000000')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow)')

    // Add vector B label
    const vectorBLabel = svg.append('text')
      .attr('x', vectorBEndX + 15)
      .attr('y', vectorBEndY - 5)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text('B')
    
    // Draw vector C
    const vectorC = svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', vectorCEndX)
      .attr('y2', vectorCEndY)
      .attr('stroke', '#000000')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow)')

    // Add vector C label
    const vectorCLabel = svg.append('text')
      .attr('x', vectorCEndX + 15)
      .attr('y', vectorCEndY - 5)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text('C')

    // Create tracing ball (initially hidden)
    const tracingBall = svg.append('circle')
      .attr('r', 6)
      .attr('fill', 'black')
      .style('opacity', 0)

    // Create invisible hover area covering entire SVG
    const hoverArea = svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')

    hoverArea
      .on('mouseover', function() {
        // Step 1: C fades out (1 second)
        vectorC
          .transition()
          .duration(1000)
          .style('opacity', 0)
        
        vectorALabel
          .transition()
          .duration(1000)
          .style('opacity', 0)

        vectorBLabel
          .transition()
          .duration(1000)
          .style('opacity', 0)

        vectorCLabel
          .transition()
          .duration(1000)
          .style('opacity', 0)
          .on('end', function() {
            
            // Step 2: B moves to tip of A (1.2 seconds)
            vectorB
              .transition()
              .duration(1200)
              .attr('x1', movedBStartX)
              .attr('y1', movedBStartY)
              .attr('x2', movedBEndX)
              .attr('y2', movedBEndY)
            
            vectorBLabel
              .transition()
              .duration(1200)
              .attr('x', movedBEndX + 15)
              .attr('y', movedBEndY - 5)
              .on('end', function() {
                
                // Step 3: Ball traces A, then pauses, then traces moved B
                tracingBall
                  .attr('cx', centerX)
                  .attr('cy', centerY)
                  .style('opacity', 1)
                
                // Trace along A
                tracingBall
                  .transition()
                  .duration(1000)
                  .attr('cx', vectorAEndX)
                  .attr('cy', vectorAEndY)
                  .on('end', function() {
                    
                    // Pause for 300ms
                    setTimeout(() => {
                      // Trace along moved B
                      tracingBall
                        .transition()
                        .duration(1000)
                        .attr('cx', movedBEndX)
                        .attr('cy', movedBEndY)
                        .on('end', function() {
                          
                          // Hide first ball
                          tracingBall.style('opacity', 0)
                          
                          // Step 4: C fades in (1 second)
                          vectorC
                            .transition()
                            .duration(1000)
                            .style('opacity', 1)
                          
                          vectorCLabel
                            .transition()
                            .duration(1000)
                            .style('opacity', 0)
                            .on('end', function() {
                              
                              // Step 5: Another ball traces C (1.2 seconds)
                              tracingBall
                                .attr('cx', centerX)
                                .attr('cy', centerY)
                                .style('opacity', 1)
                                .transition()
                                .duration(1200)
                                .attr('cx', vectorCEndX)
                                .attr('cy', vectorCEndY)
                                .on('end', function() {
                                  // Hide the ball after tracing C
                                  tracingBall.style('opacity', 0)
                                })
                            })
                        })
                    }, 300)
                  })
              })
          })
      })
      .on('mouseout', function() {
        // Reset everything to initial state
        vectorC
          .transition()
          .duration(500)
          .style('opacity', 1)
        
        vectorCLabel
          .transition()
          .duration(500)
          .style('opacity', 1)
        
        vectorB
          .transition()
          .duration(500)
          .attr('x1', centerX)
          .attr('y1', centerY)
          .attr('x2', vectorBEndX)
          .attr('y2', vectorBEndY)

        vectorALabel
          .transition()
          .duration(500)
          .style('opacity', 1)
        
        vectorBLabel
          .transition()
          .duration(500)
          .style('opacity', 1)
          .attr('x', vectorBEndX + 15)
          .attr('y', vectorBEndY - 5)
        
        tracingBall
          .transition()
          .duration(200)
          .style('opacity', 0)
      })

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
        Hover over the diagram to see vector addition animation (A + B = C)
      </div>
    </div>
  )
}