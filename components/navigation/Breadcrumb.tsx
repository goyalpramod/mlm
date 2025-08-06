// components/navigation/Breadcrumb.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useAdvancedSectionObserver } from '@/lib/hooks/useAdvancedSectionObserver'

interface BreadcrumbItem {
  title: string
  href: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showCurrentSection?: boolean
  maxItems?: number
  separator?: React.ReactNode
}

export function Breadcrumb({
  items,
  className,
  showCurrentSection = true,
  maxItems = 5,
  separator
}: BreadcrumbProps) {
  const { activeSection, sectionVisibilities } = useAdvancedSectionObserver()

  // Get current section info
  const currentSectionData = activeSection 
    ? sectionVisibilities.find(s => s.id === activeSection)
    : null

  // Build complete breadcrumb items
  let breadcrumbItems = [...items]

  // Add current section if enabled and available
  if (showCurrentSection && currentSectionData) {
    const sectionTitle = currentSectionData.element.textContent?.trim() || activeSection
    breadcrumbItems.push({
      title: sectionTitle,
      href: `#${activeSection}`,
      isActive: true
    })
  }

  // Truncate items if too many
  if (breadcrumbItems.length > maxItems) {
    const firstItem = breadcrumbItems[0]
    const lastItems = breadcrumbItems.slice(-(maxItems - 2))
    breadcrumbItems = [
      firstItem,
      { title: '...', href: '', isActive: false },
      ...lastItems
    ]
  }

  const defaultSeparator = (
    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <span className="flex items-center" aria-hidden="true">
                {separator || defaultSeparator}
              </span>
            )}
            
            {item.href === '' ? (
              // Ellipsis or non-clickable item
              <span className="text-muted-foreground">
                {item.title}
              </span>
            ) : item.isActive ? (
              // Active/current item
              <motion.span
                className="font-medium text-foreground max-w-48 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                aria-current="page"
              >
                {item.title}
              </motion.span>
            ) : (
              // Clickable breadcrumb item
              <Link
                href={item.href}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  'max-w-48 truncate inline-block',
                  index === 0 && 'font-medium' // Make home/first item slightly bolder
                )}
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface ChapterBreadcrumbProps {
  chapterTitle: string
  chapterHref: string
  className?: string
}

export function ChapterBreadcrumb({ 
  chapterTitle, 
  chapterHref, 
  className 
}: ChapterBreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: chapterTitle,
      href: chapterHref
    }
  ]

  return (
    <Breadcrumb 
      items={breadcrumbItems}
      className={className}
      showCurrentSection={true}
    />
  )
}

interface SectionBreadcrumbProps {
  chapterTitle: string
  chapterHref: string
  sectionTitle: string
  sectionHref: string
  className?: string
}

export function SectionBreadcrumb({
  chapterTitle,
  chapterHref,
  sectionTitle,
  sectionHref,
  className
}: SectionBreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: chapterTitle,
      href: chapterHref
    },
    {
      title: sectionTitle,
      href: sectionHref,
      isActive: true
    }
  ]

  return (
    <Breadcrumb 
      items={breadcrumbItems}
      className={className}
      showCurrentSection={false} // Already showing section explicitly
    />
  )
}

// Structured data for SEO
interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}