import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export capability for hosting flexibility
  output: 'export',
  
  // Configure pageExtensions to include MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize for modern browsers
  swcMinify: true,
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Disable x-powered-by header
  poweredByHeader: false
}

const withMDX = createMDX({
  // Add markdown plugins here
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'frontmatter' }]
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor-link']
        }
      }]
    ],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)