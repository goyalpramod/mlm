'use client'

import { useTheme } from '@/lib/hooks/useTheme'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  
  // Only access theme after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-balance">
            Interactive ML Mathematics
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Welcome to an interactive web book for mathematics in machine learning. 
            This project combines mathematical theory with interactive visualizations 
            to create an engaging learning experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <h2 className="text-xl font-semibold mb-3">Linear Algebra</h2>
              <p className="text-muted-foreground">
                Vectors, matrices, and transformations with interactive visualizations.
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <h2 className="text-xl font-semibold mb-3">Probability</h2>
              <p className="text-muted-foreground">
                Statistical foundations with dynamic probability distributions.
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <h2 className="text-xl font-semibold mb-3">Optimization</h2>
              <p className="text-muted-foreground">
                Gradient descent and optimization techniques with live demos.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return <MountedHomePage />
}

function MountedHomePage() {
  const { theme } = useTheme()
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-balance">
          Interactive ML Mathematics
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          Welcome to an interactive web book for mathematics in machine learning. 
          This project combines mathematical theory with interactive visualizations 
          to create an engaging learning experience.
        </p>
        
        <div className="mb-8 p-4 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Theme System Status</h3>
          <p className="text-muted-foreground">
            Current theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Toggle the theme using the {theme === 'light' ? '🌙' : '☀️'} button in the top-right corner
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
            <h2 className="text-xl font-semibold mb-3">Linear Algebra</h2>
            <p className="text-muted-foreground">
              Vectors, matrices, and transformations with interactive visualizations.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
            <h2 className="text-xl font-semibold mb-3">Probability</h2>
            <p className="text-muted-foreground">
              Statistical foundations with dynamic probability distributions.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
            <h2 className="text-xl font-semibold mb-3">Optimization</h2>
            <p className="text-muted-foreground">
              Gradient descent and optimization techniques with live demos.
            </p>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-muted rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Theme System Ready! ✨</h3>
          <p className="text-lg text-muted-foreground mb-6">
            🎉 Your theme system is now fully functional with instant toggling, 
            localStorage persistence, and system preference detection.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>✅ Instant theme switching (no animations)</p>
              <p>✅ localStorage persistence</p>
              <p>✅ System preference detection</p>
            </div>
            <div className="space-y-2">
              <p>✅ Keyboard accessible toggle</p>
              <p>✅ No hydration mismatches</p>
              <p>✅ Pure black & white aesthetic</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Test Instructions:</h4>
            <ol className="text-left text-sm text-muted-foreground space-y-1">
              <li>1. Click the theme toggle button (top-right)</li>
              <li>2. Refresh the page - theme should persist</li>
              <li>3. Change system preference - should auto-detect</li>
              <li>4. Use Tab + Enter for keyboard navigation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}