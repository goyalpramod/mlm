import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  poweredByHeader: false
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'frontmatter' }],
      // Add remark-math to process LaTeX syntax
      remarkMath,
    ],
    rehypePlugins: [
      // Add rehype-katex to render LaTeX with KaTeX
      [rehypeKatex, {
        // KaTeX options
        strict: false, // Allow unknown commands
        trust: false, // Don't trust HTML in math
        macros: {
          // Common mathematical macros
          '\\R': '\\mathbb{R}',
          '\\N': '\\mathbb{N}',
          '\\Z': '\\mathbb{Z}',
          '\\Q': '\\mathbb{Q}',
          '\\C': '\\mathbb{C}',
          '\\vec': '\\mathbf{#1}',
          '\\norm': '\\left\\|#1\\right\\|',
          '\\abs': '\\left|#1\\right|',
          '\\argmax': '\\operatorname{argmax}',
          '\\argmin': '\\operatorname{argmin}',
          '\\trace': '\\operatorname{tr}',
          '\\rank': '\\operatorname{rank}',
          '\\diag': '\\operatorname{diag}',
          '\\det': '\\operatorname{det}',
        }
      }],
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor-link']
        }
      }],
    ],
  },
})

export default withMDX(nextConfig)