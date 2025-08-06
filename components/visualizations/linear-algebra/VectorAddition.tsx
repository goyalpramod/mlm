// components/visualizations/linear-algebra/VectorAddition.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils/cn'

interface VectorAdditionProps {
  className?: string
  initialA?: [number, number]
  initialB?: [number, number]
}

export function VectorAddition({
  className,
  initialA = [3, 2],
  initialB = [1, 3]
}: VectorAdditionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.OrthographicCamera>()
  const [vectorA, setVectorA] = useState(initialA)
  const [vectorB, setVectorB] = useState(initialB)
  const [isDragging, setIsDragging] = useState<'a' | 'b' | null>(null)
  const [hovering, setHovering] = useState<'a' | 'b' | null>(null)

  // Calculate result vector
  const vectorSum = [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff) // White background to blend seamlessly
    sceneRef.current = scene

    // Setup camera (orthographic for 2D-like view)
    const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, 1, 1000)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false // Disable transparency for solid white
    })
    renderer.setSize(500, 300)
    renderer.setPixelRatio(window.devicePixelRatio) // HD rendering
    renderer.setClearColor(0xffffff, 1) // Solid white background
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Initial render
    updateVectors()

    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    updateVectors()
  }, [vectorA, vectorB, hovering])

  const createGrid = (scene: THREE.Scene) => {
    // No grid - pure minimalism
  }

  const createArrow = (start: THREE.Vector3, end: THREE.Vector3, color: number, isHovering: boolean = false) => {
    const group = new THREE.Group()

    // Arrow shaft - thick black line
    const shaftGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
    const shaftMaterial = new THREE.LineBasicMaterial({ 
      color: 0x000000, // Pure black
      linewidth: 8 // Much thicker
    })
    const shaft = new THREE.Line(shaftGeometry, shaftMaterial)
    group.add(shaft)

    // Arrow head - black
    const direction = new THREE.Vector3().subVectors(end, start).normalize()
    const headLength = 0.3 // Slightly larger
    const headWidth = 0.15

    const headGeometry = new THREE.ConeGeometry(headWidth, headLength, 8)
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }) // Pure black
    const head = new THREE.Mesh(headGeometry, headMaterial)
    
    // Position and orient the arrow head
    head.position.copy(end)
    head.lookAt(end.clone().add(direction))
    head.rotateX(Math.PI / 2)
    group.add(head)

    // Hover effect - subtle black circle
    if (isHovering) {
      const circleGeometry = new THREE.RingGeometry(0.15, 0.25, 16)
      const circleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        transparent: true, 
        opacity: 0.2, // Very subtle
        side: THREE.DoubleSide
      })
      const circle = new THREE.Mesh(circleGeometry, circleMaterial)
      circle.position.copy(end)
      group.add(circle)
    }

    return group
  }

  const updateVectors = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return

    // Clear previous vectors
    const vectorsToRemove = sceneRef.current.children.filter(child => child.userData.isVector)
    vectorsToRemove.forEach(vector => sceneRef.current!.remove(vector))

    // Create vector A (black)
    const vectorAArrow = createArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(vectorA[0], vectorA[1], 0),
      0x000000, // Black
      hovering === 'a'
    )
    vectorAArrow.userData.isVector = true
    vectorAArrow.userData.type = 'a'
    sceneRef.current.add(vectorAArrow)

    // Create vector B (black) - starts from tip of A
    const vectorBArrow = createArrow(
      new THREE.Vector3(vectorA[0], vectorA[1], 0),
      new THREE.Vector3(vectorA[0] + vectorB[0], vectorA[1] + vectorB[1], 0),
      0x000000, // Black
      hovering === 'b'
    )
    vectorBArrow.userData.isVector = true
    vectorBArrow.userData.type = 'b'
    sceneRef.current.add(vectorBArrow)

    // Create result vector (black, dashed)
    const resultStart = new THREE.Vector3(0, 0, 0)
    const resultEnd = new THREE.Vector3(vectorSum[0], vectorSum[1], 0)
    
    // Dashed line for result
    const resultGeometry = new THREE.BufferGeometry().setFromPoints([resultStart, resultEnd])
    const resultMaterial = new THREE.LineDashedMaterial({ 
      color: 0x000000, // Black
      linewidth: 6, // Thicker
      dashSize: 0.2,
      gapSize: 0.1
    })
    const resultLine = new THREE.Line(resultGeometry, resultMaterial)
    resultLine.computeLineDistances() // Required for dashed lines
    resultLine.userData.isVector = true
    sceneRef.current.add(resultLine)

    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !cameraRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Convert to world coordinates
    const worldX = (x * 6)  // Camera range is -6 to 6
    const worldY = (y * 4)  // Camera range is -4 to 4

    if (isDragging === 'a') {
      setVectorA([Math.round(worldX * 2) / 2, Math.round(worldY * 2) / 2]) // Snap to 0.5 grid
    } else if (isDragging === 'b') {
      setVectorB([Math.round(worldX * 2) / 2, Math.round(worldY * 2) / 2])
    }
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const worldX = x * 6
    const worldY = y * 4

    // Check if clicking near vector A tip
    const distanceToA = Math.sqrt((worldX - vectorA[0]) ** 2 + (worldY - vectorA[1]) ** 2)
    const distanceToB = Math.sqrt((worldX - (vectorA[0] + vectorB[0])) ** 2 + (worldY - (vectorA[1] + vectorB[1])) ** 2)

    if (distanceToA < 0.3) {
      setIsDragging('a')
    } else if (distanceToB < 0.3) {
      setIsDragging('b')
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isDragging) return
    
    const rect = containerRef.current!.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const worldX = x * 6
    const worldY = y * 4

    const distanceToA = Math.sqrt((worldX - vectorA[0]) ** 2 + (worldY - vectorA[1]) ** 2)
    const distanceToB = Math.sqrt((worldX - (vectorA[0] + vectorB[0])) ** 2 + (worldY - (vectorA[1] + vectorB[1])) ** 2)

    if (distanceToA < 0.3) {
      setHovering('a')
    } else if (distanceToB < 0.3) {
      setHovering('b')
    } else {
      setHovering(null)
    }
  }

  return (
    <div className={cn('my-8', className)}>
      {/* Interactive Canvas */}
      <div 
        ref={containerRef}
        className="mx-auto cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setHovering(null) }}
        onMouseEnter={handleMouseEnter}
        style={{ width: '500px', height: '300px' }}
      />
      
      {/* Live Math Updates */}
      <div className="text-center mt-6 space-y-2">
        <div className="text-lg font-mono">
          <span className="text-black font-semibold">a</span> = [{vectorA[0].toFixed(1)}, {vectorA[1].toFixed(1)}]
        </div>
        <div className="text-lg font-mono">
          <span className="text-black font-semibold">b</span> = [{vectorB[0].toFixed(1)}, {vectorB[1].toFixed(1)}]
        </div>
        <div className="text-lg font-mono">
          <span className="text-black font-semibold">a + b</span> = [{vectorSum[0].toFixed(1)}, {vectorSum[1].toFixed(1)}]
        </div>
        <div className="text-sm text-gray-500 mt-4">
          💡 Drag the arrow tips to see how vector addition works!
        </div>
      </div>
    </div>
  )
}