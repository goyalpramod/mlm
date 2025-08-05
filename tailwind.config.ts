import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Typography optimized for mathematical content
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'monospace'
        ]
      },
      
      // Custom colors for strict black/white theme
      colors: {
        // Base colors using CSS custom properties
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        
        // Override default colors to black/white only
        white: '#ffffff',
        black: '#000000',
        transparent: 'transparent',
        current: 'currentColor',
      },
      
      // Improved spacing for mathematical content
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      
      // Animation utilities for smooth interactions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      
      // Typography enhancements
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            lineHeight: '1.7',
            fontSize: '1.1rem'
          }
        }
      }
    }
  },
  plugins: []
}

export default config