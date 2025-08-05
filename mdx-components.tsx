import type { MDXComponents } from 'mdx/types'
import { H1, H2, H3, H4, H5, H6, P, MathBlock, InlineMath } from '@/lib/utils/typography'
import Link from 'next/link'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with proper hierarchy and styling
    h1: ({ children, ...props }) => <H1 {...props}>{children}</H1>,
    h2: ({ children, ...props }) => <H2 {...props}>{children}</H2>,
    h3: ({ children, ...props }) => <H3 {...props}>{children}</H3>,
    h4: ({ children, ...props }) => <H4 {...props}>{children}</H4>,
    h5: ({ children, ...props }) => <H5 {...props}>{children}</H5>,
    h6: ({ children, ...props }) => <H6 {...props}>{children}</H6>,
    
    // Paragraphs with proper typography
    p: ({ children, ...props }) => <P {...props}>{children}</P>,
    
    // Links with Next.js optimization
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      return (
        <a 
          href={href} 
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      )
    },
    
    // Images with Next.js optimization
    img: ({ src, alt, ...props }) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg border border-border my-6"
        {...props}
      />
    ),
    
    // Lists with proper styling
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-foreground leading-relaxed" {...props}>
        {children}
      </li>
    ),
    
    // Code blocks and inline code
    code: ({ children, className, ...props }) => {
      const isInline = !className
      if (isInline) {
        return <InlineMath {...props}>{children}</InlineMath>
      }
      return (
        <code 
          className="block p-4 bg-muted rounded-lg border border-border overflow-x-auto font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      )
    },
    
    pre: ({ children, ...props }) => (
      <MathBlock {...props}>
        {children}
      </MathBlock>
    ),
    
    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote 
        className="border-l-4 border-border pl-4 italic text-muted-foreground my-6"
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table 
          className="w-full border-collapse border border-border"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th 
        className="border border-border px-4 py-2 bg-muted font-semibold text-left"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td 
        className="border border-border px-4 py-2"
        {...props}
      >
        {children}
      </td>
    ),
    
    // Horizontal rule
    hr: (props) => (
      <hr className="border-0 border-t border-border my-8" {...props} />
    ),
    
    // Allow component overrides
    ...components,
  }
}