/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export capability for hosting flexibility
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize for modern browsers
  swcMinify: true,
  
  // Remove experimental optimizeCss to avoid critters dependency issue
  // experimental: {
  //   optimizeCss: true
  // },
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Configure base path if needed for subdirectory deployment
  // basePath: '',
  
  // Disable x-powered-by header
  poweredByHeader: false
}

module.exports = nextConfig