import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,        // GitHub Flavored Markdown
      remarkMath,       // LaTeX math syntax
    ],
    rehypePlugins: [
      [rehypeKatex, {   // Render LaTeX with KaTeX
        strict: false,
        trust: false,
        macros: {
          // Common math macros
          '\\R': '\\mathbb{R}',
          '\\N': '\\mathbb{N}',
          '\\Z': '\\mathbb{Z}',
          '\\Q': '\\mathbb{Q}',
          '\\C': '\\mathbb{C}',
          '\\vec': '\\mathbf{#1}',
          '\\norm': '\\left\\|#1\\right\\|',
          '\\abs': '\\left|#1\\right|',
        }
      }],
      rehypeSlug,       // Add IDs to headings for navigation
    ],
  },
})

export default withMDX(nextConfig)