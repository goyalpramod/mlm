import type { MDXComponents } from 'mdx/types'
import { MDXHeading, BlockQuote, CodeBlock } from '@/components/content/MDXComponents'
import Link from 'next/link'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with proper hierarchy and navigation IDs
    h1: ({ children, ...props }) => <MDXHeading level={1} {...props}>{children}</MDXHeading>,
    h2: ({ children, ...props }) => <MDXHeading level={2} {...props}>{children}</MDXHeading>,
    h3: ({ children, ...props }) => <MDXHeading level={3} {...props}>{children}</MDXHeading>,
    h4: ({ children, ...props }) => <MDXHeading level={4} {...props}>{children}</MDXHeading>,
    h5: ({ children, ...props }) => <MDXHeading level={5} {...props}>{children}</MDXHeading>,
    h6: ({ children, ...props }) => <MDXHeading level={6} {...props}>{children}</MDXHeading>,
    
    // Paragraphs
    p: ({ children, ...props }) => (
      <p className="text-foreground mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    
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
          className="text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground transition-colors"
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
        className="rounded-lg border border-border my-6 mx-auto"
        {...props}
      />
    ),
    
    // Lists
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
    
    // Code (inline and blocks handled by KaTeX and rehype)
    code: ({ children, className, ...props }) => {
      const isInline = !className
      if (isInline) {
        return (
          <code 
            className="font-mono bg-muted px-1 py-0.5 rounded text-foreground text-sm"
            {...props}
          >
            {children}
          </code>
        )
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>
    },
    
    // Blockquotes
    blockquote: ({ children, ...props }) => <BlockQuote {...props}>{children}</BlockQuote>,
    
    // Horizontal rule
    hr: (props) => (
      <hr className="border-0 border-t border-border my-8" {...props} />
    ),
    
    // Allow component overrides
    ...components,
  }
}