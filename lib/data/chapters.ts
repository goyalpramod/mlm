import { Chapter } from '@/types/content'

export const chapters: Chapter[] = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    slug: 'linear-algebra',
    description: 'Vectors, matrices, and linear transformations. The mathematical foundation that underlies most machine learning algorithms.',
    icon: '📐',
    order: 1,
    readingTime: 45,
    difficulty: 'Beginner',
    prerequisites: ['Basic algebra', 'High school mathematics'],
    learningObjectives: [
      'Understand vector spaces and operations',
      'Master matrix multiplication and properties',
      'Learn eigenvalues and eigenvectors',
      'Apply linear transformations to data'
    ],
    sections: [
      {
        id: 'vectors',
        title: 'Vectors and Vector Spaces',
        slug: 'vectors',
        order: 1,
        estimatedTime: 15,
        subsections: [
          { id: 'vector-basics', title: 'Vector Basics', slug: 'vector-basics', order: 1 },
          { id: 'vector-operations', title: 'Vector Operations', slug: 'vector-operations', order: 2 },
          { id: 'vector-spaces', title: 'Vector Spaces', slug: 'vector-spaces', order: 3 }
        ]
      },
      {
        id: 'matrices',
        title: 'Matrix Operations',
        slug: 'matrices',
        order: 2,
        estimatedTime: 20,
        subsections: [
          { id: 'matrix-basics', title: 'Matrix Fundamentals', slug: 'matrix-basics', order: 1 },
          { id: 'matrix-multiplication', title: 'Matrix Multiplication', slug: 'matrix-multiplication', order: 2 },
          { id: 'matrix-inverse', title: 'Matrix Inverse', slug: 'matrix-inverse', order: 3 }
        ]
      },
      {
        id: 'eigenvalues',
        title: 'Eigenvalues and Eigenvectors',
        slug: 'eigenvalues',
        order: 3,
        estimatedTime: 10
      }
    ],
    published: true
  },
  {
    id: 'matrices',
    title: 'Advanced Matrix Theory',
    slug: 'matrices',
    description: 'Deep dive into matrix operations, decompositions, and their applications in machine learning algorithms.',
    icon: '🔢',
    order: 2,
    readingTime: 40,
    difficulty: 'Intermediate',
    prerequisites: ['Linear Algebra basics', 'Vector operations'],
    learningObjectives: [
      'Master advanced matrix operations',
      'Understand matrix decompositions (SVD, LU, QR)',
      'Apply matrix techniques to dimensionality reduction',
      'Solve systems of linear equations'
    ],
    sections: [
      {
        id: 'matrix-decomposition',
        title: 'Matrix Decomposition',
        slug: 'matrix-decomposition',
        order: 1,
        estimatedTime: 20,
        subsections: [
          { id: 'svd', title: 'Singular Value Decomposition', slug: 'svd', order: 1 },
          { id: 'lu-decomposition', title: 'LU Decomposition', slug: 'lu-decomposition', order: 2 },
          { id: 'qr-decomposition', title: 'QR Decomposition', slug: 'qr-decomposition', order: 3 }
        ]
      },
      {
        id: 'matrix-applications',
        title: 'Applications in ML',
        slug: 'matrix-applications',
        order: 2,
        estimatedTime: 20,
        subsections: [
          { id: 'pca', title: 'Principal Component Analysis', slug: 'pca', order: 1 },
          { id: 'linear-regression', title: 'Linear Regression', slug: 'linear-regression', order: 2 }
        ]
      }
    ],
    published: true
  },
  {
    id: 'probability',
    title: 'Probability Theory',
    slug: 'probability',
    description: 'Fundamental concepts of probability, random variables, and distributions essential for machine learning.',
    icon: '🎲',
    order: 3,
    readingTime: 50,
    difficulty: 'Beginner',
    prerequisites: ['Basic calculus', 'Set theory'],
    learningObjectives: [
      'Understand probability fundamentals',
      'Work with random variables and distributions',
      'Apply Bayes\' theorem',
      'Model uncertainty in machine learning'
    ],
    sections: [
      {
        id: 'probability-basics',
        title: 'Probability Fundamentals',
        slug: 'probability-basics',
        order: 1,
        estimatedTime: 15,
        subsections: [
          { id: 'sample-spaces', title: 'Sample Spaces and Events', slug: 'sample-spaces', order: 1 },
          { id: 'probability-rules', title: 'Probability Rules', slug: 'probability-rules', order: 2 }
        ]
      },
      {
        id: 'distributions',
        title: 'Probability Distributions',
        slug: 'distributions',
        order: 2,
        estimatedTime: 25,
        subsections: [
          { id: 'discrete-distributions', title: 'Discrete Distributions', slug: 'discrete-distributions', order: 1 },
          { id: 'continuous-distributions', title: 'Continuous Distributions', slug: 'continuous-distributions', order: 2 },
          { id: 'normal-distribution', title: 'Normal Distribution', slug: 'normal-distribution', order: 3 }
        ]
      },
      {
        id: 'bayes-theorem',
        title: 'Bayes\' Theorem',
        slug: 'bayes-theorem',
        order: 3,
        estimatedTime: 10
      }
    ],
    published: true
  },
  {
    id: 'statistics',
    title: 'Statistics for ML',
    slug: 'statistics',
    description: 'Statistical methods, hypothesis testing, and inference techniques used in machine learning.',
    icon: '📊',
    order: 4,
    readingTime: 35,
    difficulty: 'Intermediate',
    prerequisites: ['Probability theory', 'Basic calculus'],
    learningObjectives: [
      'Perform statistical inference',
      'Understand hypothesis testing',
      'Apply statistical methods to data',
      'Evaluate model performance statistically'
    ],
    sections: [
      {
        id: 'descriptive-stats',
        title: 'Descriptive Statistics',
        slug: 'descriptive-stats',
        order: 1,
        estimatedTime: 10
      },
      {
        id: 'inferential-stats',
        title: 'Statistical Inference',
        slug: 'inferential-stats',
        order: 2,
        estimatedTime: 15,
        subsections: [
          { id: 'confidence-intervals', title: 'Confidence Intervals', slug: 'confidence-intervals', order: 1 },
          { id: 'hypothesis-testing', title: 'Hypothesis Testing', slug: 'hypothesis-testing', order: 2 }
        ]
      },
      {
        id: 'regression-analysis',
        title: 'Regression Analysis',
        slug: 'regression-analysis',
        order: 3,
        estimatedTime: 10
      }
    ],
    published: true
  },
  {
    id: 'optimization',
    title: 'Optimization Theory',
    slug: 'optimization',
    description: 'Mathematical optimization techniques including gradient descent and algorithms used to train machine learning models.',
    icon: '📈',
    order: 5,
    readingTime: 55,
    difficulty: 'Advanced',
    prerequisites: ['Calculus', 'Linear algebra', 'Vector operations'],
    learningObjectives: [
      'Understand optimization fundamentals',
      'Master gradient descent algorithms',
      'Apply constrained optimization',
      'Optimize machine learning models'
    ],
    sections: [
      {
        id: 'optimization-basics',
        title: 'Optimization Fundamentals',
        slug: 'optimization-basics',
        order: 1,
        estimatedTime: 15,
        subsections: [
          { id: 'objective-functions', title: 'Objective Functions', slug: 'objective-functions', order: 1 },
          { id: 'convex-optimization', title: 'Convex Optimization', slug: 'convex-optimization', order: 2 }
        ]
      },
      {
        id: 'gradient-descent',
        title: 'Gradient Descent',
        slug: 'gradient-descent',
        order: 2,
        estimatedTime: 25,
        subsections: [
          { id: 'basic-gradient-descent', title: 'Basic Gradient Descent', slug: 'basic-gradient-descent', order: 1 },
          { id: 'stochastic-gd', title: 'Stochastic Gradient Descent', slug: 'stochastic-gd', order: 2 },
          { id: 'advanced-optimizers', title: 'Advanced Optimizers', slug: 'advanced-optimizers', order: 3 }
        ]
      },
      {
        id: 'constrained-optimization',
        title: 'Constrained Optimization',
        slug: 'constrained-optimization',
        order: 3,
        estimatedTime: 15,
        subsections: [
          { id: 'lagrange-multipliers', title: 'Lagrange Multipliers', slug: 'lagrange-multipliers', order: 1 },
          { id: 'kkt-conditions', title: 'KKT Conditions', slug: 'kkt-conditions', order: 2 }
        ]
      }
    ],
    published: true
  }
]

export const getChapterBySlug = (slug: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.slug === slug)
}

export const getChapterById = (id: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.id === id)
}

export const getPublishedChapters = (): Chapter[] => {
  return chapters.filter(chapter => chapter.published).sort((a, b) => a.order - b.order)
}