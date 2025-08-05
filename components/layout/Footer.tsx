import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">∑</span>
              </div>
              <span className="font-semibold text-foreground">ML Mathematics</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              An interactive web book for mathematics in machine learning. 
              Learn through visualizations and hands-on exercises.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Chapters</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/linear-algebra" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Linear Algebra
                </Link>
              </li>
              <li>
                <Link 
                  href="/probability" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Probability
                </Link>
              </li>
              <li>
                <Link 
                  href="/optimization" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Optimization
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link 
                  href="/contributing" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contributing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © 2025 ML Mathematics. Built with Next.js and TypeScript.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link 
              href="/privacy" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}