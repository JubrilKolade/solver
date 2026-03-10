# MathSolver 🧮

A comprehensive web-based math problem solver with support for arithmetic, algebra, calculus, geometry, and college-level mathematics. Powered by React, TypeScript, and MathJS with OCR capabilities for solving problems from images.

## Features ✨

### **Core Solving Capabilities**
- **20+ Mathematical Categories**: Arithmetic, Algebra, Percentages, Powers & Roots, Trigonometry, Calculus, Number Theory, Statistics, Logarithms, Geometry, Probability, and more
- **Advanced Mathematics**: Complex numbers, differential equations, vectors, Taylor series, Laplace transforms, linear algebra, and partial fractions
- **Step-by-Step Solutions**: Every problem comes with detailed explanations of each solving step
- **Real-time Solving**: Instant results with color-coded results and formatted expressions

### **Image Recognition**
- **OCR Technology**: Upload photos of handwritten or printed math problems
- **Tesseract.js Integration**: Extract text from images with 80+ language support
- **Editable Extraction**: Review and correct extracted text before solving
- **Drag & Drop Support**: Easy image upload with file validation

### **Geometry Tools**
- **Shape Calculator**: Area, perimeter, volume calculations for common shapes
- **Multiple Formulas**: Various geometric formulas and theorems
- **Value Input**: Interactive form for entering known values
- **Formula Selection**: Choose from multiple calculation methods per shape

### **Additional Features**
- **Problem History**: Track and revisit recently solved problems (50 problem limit)
- **Example Problems**: Browse categorized example problems for quick learning
- **Quick Actions**: Pre-loaded common problem templates
- **Mobile Responsive**: Fully responsive design for desktop and mobile devices
- **Dark Theme**: Modern dark UI with smooth animations

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Math Engine**: MathJS 15
- **OCR**: Tesseract.js 7
- **Type Safety**: TypeScript 5.9
- **Code Quality**: ESLint 9

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd solver

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                 # Main application component with UI tabs
├── main.tsx               # Entry point
├── index.css              # Global styles
├── components/
│   ├── ImageUpload.tsx    # OCR image upload component
│   └── GeometryTools.tsx  # Geometry problem solver interface
└── utils/
    ├── mathSolver.ts      # Core solving logic & example problems
    ├── advancedSolvers.ts # Advanced math solvers (statistics, sequences, etc.)
    ├── collegeSolvers.ts  # College-level math solvers (calculus, linear algebra)
    ├── geometrySolver.ts  # Geometry calculations
    └── cn.ts              # Utility function for className merging
```

## Usage

### Solving Math Problems

1. **Type Mode**: Enter expressions or problems directly in the input field
   - Examples: `2 + 3 * 4`, `x^2 - 5x + 6 = 0`, `sin(30 degrees)`

2. **Upload Mode**: Upload an image of a math problem
   - Click the "Upload Image" button
   - Select or drag & drop an image file
   - Review extracted text and click "Solve"

3. **Geometry Mode**: Use dedicated geometry calculator
   - Select a shape (circle, triangle, rectangle, etc.)
   - Choose a formula
   - Enter known values
   - Get instant calculations

### Supported Problem Types

#### Basic Level
- Arithmetic: `2 + 3 * 4`, `(15 + 7) * 3 - 10`
- Algebra: `2x + 5 = 11`, `x^2 - 5x + 6 = 0`
- Percentages: `what is 15% of 200`
- Powers & Roots: `2^10`, `sqrt(144)`

#### Intermediate Level
- Trigonometry: `sin(30 degrees)`, `cos(60 degrees)`
- Statistics: `median of 1, 2, 3, 4, 5`, `mode of 1, 1, 2, 3`
- Sequences: `sum of arithmetic sequence`
- Matrices: `eigenvalues of 4, 1; 2, 3`

#### Advanced Level
- Calculus: `derivative of x^3 + 2x`, `integrate x^2`
- Complex Numbers: `modulus of 3 + 4i`
- Differential Equations: `y'' - 4y' + 3y = 0`
- Vectors: `dot product of (1,2,3) and (4,5,6)`

## Development

### Scripts
```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Adding New Problem Types

1. Add solver function in `src/utils/mathSolver.ts` (or appropriate utils file)
2. Update `solveProblem()` function to call new solver
3. Add example problems to `exampleProblems` array
4. Add category colors and icons to `categoryColors` and `categoryIcons` objects

### Code Quality
- TypeScript strict mode enabled
- ESLint configured for React and TypeScript
- Tailwind CSS for styling consistency

## Performance

- **Single-file Build**: Optimized ~1.1MB minified output
- **Fast Refresh**: Instant UI updates during development
- **OCR Optimization**: Tesseract worker runs efficiently in browser
- **Math Computation**: MathJS provides fast parsing and evaluation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a pull request with any improvements or new features.
