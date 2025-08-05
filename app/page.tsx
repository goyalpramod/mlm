export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-balance">
          Interactive ML Mathematics
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          Welcome to an interactive web book for mathematics in machine learning. 
          This project combines mathematical theory with interactive visualizations 
          to create an engaging learning experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Linear Algebra</h2>
            <p className="text-muted-foreground">
              Vectors, matrices, and transformations with interactive visualizations.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Probability</h2>
            <p className="text-muted-foreground">
              Statistical foundations with dynamic probability distributions.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Optimization</h2>
            <p className="text-muted-foreground">
              Gradient descent and optimization techniques with live demos.
            </p>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-muted rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Hello World</h3>
          <p className="text-lg text-muted-foreground">
            🎉 Your ML Mathematics web book is successfully initialized! 
            The Next.js 14 project is ready for theme system integration.
          </p>
          
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>✅ Next.js 14 with App Router configured</p>
            <p>✅ TypeScript with strict mode enabled</p>
            <p>✅ Tailwind CSS with custom mathematical theme</p>
            <p>✅ Static export capability ready</p>
            <p>✅ Responsive design foundation</p>
          </div>
        </div>
      </div>
    </div>
  )
}