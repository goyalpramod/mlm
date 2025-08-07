'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { chapters } from '@/lib/data/chapters'

export default function HomePage() {
  const [imageVisible, setImageVisible] = useState(false)
  const [showBeginText, setShowBeginText] = useState(false)
  const [currentStep, setCurrentStep] = useState('hero') // 'hero', 'why', 'toc'
  const router = useRouter()

  // Fade in image on mount
  useEffect(() => {
    const timer = setTimeout(() => setImageVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Show "Let's begin" after 5 seconds OR on scroll/click
  useEffect(() => {
    const handleInteraction = () => {
      if (currentStep === 'hero' && !showBeginText) {
        setShowBeginText(true)
      }
    }

    // Auto show after 5 seconds
    const timer = setTimeout(() => {
      if (currentStep === 'hero') {
        setShowBeginText(true)
      }
    }, 4000)

    // Also show on scroll or click
    window.addEventListener('scroll', handleInteraction, { passive: true })
    window.addEventListener('click', handleInteraction)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [currentStep, showBeginText])

  const handleBeginClick = () => {
    setCurrentStep('why')
    setShowBeginText(false)
  }

  const handleNextClick = () => {
    setCurrentStep('toc')
  }

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      {/* Hero Image - Always visible, moved down 20-30px */}
      <div className="fixed inset-0 flex items-center justify-center" style={{ paddingTop: '50px' }}>
        <div className={`transition-opacity duration-2000 ease-in-out ${imageVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src="/images/HomePage/hero-image.png"
            alt="Hero"
            width={600}
            height={800}
            className="max-h-screen w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Let's Begin Text - Center Bottom Right of Image, moved down 10px */}
      {showBeginText && currentStep === 'hero' && (
        <div className="fixed animate-fade-in" style={{ bottom: '118px', right: '33.333%' }}>
          <span
            onClick={handleBeginClick}
            className="text-black text-2xl underline cursor-pointer hover:no-underline"
          >
            Let's begin
          </span>
        </div>
      )}

      {/* Why I Built This Section */}
      {currentStep === 'why' && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center animate-fade-in overflow-hidden">
          <div className="max-w-2xl p-8 text-center">
            <h1 className="text-4xl font-bold mb-6 text-black font-tinos">Why I built this</h1>
            <p className="text-lg text-gray-800 leading-relaxed mb-8">
              Mathematics is the language of machine learning, yet most resources treat it as dry theory. 
              I built this interactive book to make complex mathematical concepts intuitive through 
              visualizations and hands-on exploration.
            </p>
            
            <div className="fixed" style={{ bottom: '118px', right: '33.333%' }}>
              <span
                onClick={handleNextClick}
                className="text-black text-2xl underline cursor-pointer hover:no-underline"
              >
                Next page
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {currentStep === 'toc' && (
        <div className="fixed inset-0 bg-white flex items-center justify-center animate-fade-in overflow-y-auto">
          <div className="max-w-3xl p-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-black font-tinos">Table of Contents</h1>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => router.push(`/${chapter.slug}`)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors rounded-lg group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Chapter {index + 1}</div>
                      <div className="text-xl font-medium text-black group-hover:text-gray-600">
                        {chapter.title}
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600">→</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}