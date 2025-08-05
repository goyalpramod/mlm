# Interactive ML Mathematics Web Book

An interactive web book focused on mathematics for machine learning, featuring dynamic visualizations and engaging educational content.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This creates an optimized static export in the `out/` directory.

## 📁 Project Structure

```
ml-math-book/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   └── not-found.tsx   # 404 page
├── components/         # Reusable React components
│   └── ui/            # UI component library
├── lib/               # Utility functions and helpers
├── public/            # Static assets
├── styles/            # Additional stylesheets
└── types/             # TypeScript type definitions
```

## 🛠 Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom theme
- **Deployment**: Static export ready

## 🎨 Theme System

The project uses CSS custom properties for theme variables:
- Light/dark mode support
- Optimized for mathematical content
- Clean black and white design aesthetic

## 📝 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🎯 Next Steps

This is the foundation setup. The next phase will add:
- Theme toggle system
- MDX integration for content
- Mathematical visualization components
- Interactive exercises
- Chapter navigation system

## 📚 Features (Planned)

- Interactive 3D mathematical visualizations
- Real-time equation rendering with MathJax
- Responsive design optimized for reading
- Progress tracking and exercises
- Smooth scrolling navigation

## 🤝 Contributing

This project serves as both an educational resource and a learning project for modern web development techniques.

## 📄 License

This project is for educational purposes.