# Solver 🧮

A comprehensive web-based math problem solver with support for arithmetic, algebra, calculus, geometry, and college-level mathematics. Powered by React, TypeScript, MathJS, and Firebase, featuring OCR capabilities, handwriting recognition, offline support, a gamified practice system, and real-time collaboration.

## Features ✨

### **Core Solving Capabilities**
- **20+ Mathematical Categories**: Arithmetic, Algebra, Percentages, Powers & Roots, Trigonometry, Calculus, Number Theory, Statistics, Logarithms, Geometry, Probability, and more
- **Advanced Mathematics**: Complex numbers, differential equations, vectors, Taylor series, Laplace transforms, linear algebra, and partial fractions
- **Step-by-Step Solutions**: Every problem comes with detailed explanations of each solving step
- **Real-time Solving**: Instant results with color-coded results and formatted expressions

### **Image & Input Recognition**
- **OCR Technology**: Upload photos of handwritten or printed math problems using Tesseract.js
- **Handwriting Canvas**: Draw math problems directly on the screen for instant recognition and solving
- **Editable Extraction**: Review and correct extracted text before solving
- **Drag & Drop Support**: Easy image upload with file validation

### **Geometry Tools**
- **Shape Calculator**: Area, perimeter, volume calculations for common shapes
- **Multiple Formulas**: Various geometric formulas and theorems
- **Interactive Input**: Visual forms for entering known values to yield instant calculations

### **Gamification & Practice**
- **User Accounts & Authentication**: Secure login/signup powered by Firebase Auth, with optional anonymous profiles
- **Dashboard & Analytics**: Track your total solves, XP, current/best streaks, and topic-specific accuracy
- **Daily Problems**: Return every day for a unique math challenge and earn bonus XP
- **Practice Mode**: Test your skills against randomly generated problems to build your streak
- **Achievements System**: Unlock badges like "Math Master" and "Perfect Week"
- **Theory Cards**: Learn mathematical concepts with interactive example problems

### **Advanced Functionality**
- **Offline Mode**: Fully functional offline support powered by Service Workers—keep solving when disconnected!
- **Collaborative Mode**: Work together on complex math problems in real-time
- **Problem History**: Automatically saves and tracks your past solved problems
- **Premium Features**: Certain advanced tools (like collaboration and dashboard) are gated behind user registration
- **Keyboard Shortcuts**: Navigate between tools quickly with global hotkeys

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 & `clsx` / `tailwind-merge`
- **Math Engine**: MathJS 15
- **OCR & Interactive**: Tesseract.js 7, Draw Canvas
- **Backend & Database**: Firebase 12 (Auth, Firestore)
- **Data Visualization**: Plotly.js
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

# Setup Firebase credentials
# Make sure to copy `.env.example` to `.env` and fill in your Firebase configuration keys

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.tsx                 # Main application orchestration & offline handling
├── main.tsx                # React entry point
├── index.css               # Global Tailwind styles
├── components/
│   ├── tabs/               # Tab-specific content (Solver, Upload, Practice, etc.)
│   ├── layout/             # Header, Footer, NavBar, BackgroundOrbs
│   └── ErrorBoundary.tsx   # Global app stability
├── contexts/
│   ├── AuthContext.tsx     # Firebase Authentication state
│   └── ThemeContext.tsx    # App theming and styling state
├── hooks/
│   ├── useAuth.ts          # Custom auth hook
│   └── useKeyboardShortcuts.ts # App navigation shortcuts
├── services/
│   └── firebaseService.ts  # Database operations (history, stats, usage)
└── utils/
    ├── mathSolver.ts       # Core solving logic & routing
    ├── geometrySolver.ts   # Geometry algorithms
    ├── offline.ts          # Service worker registration
    └── cn.ts               # Class name merging utility
```

## Usage Insights

1. **Standard Solving**: Switch to the **Solver** tab, type a problem like `derivative of x^3 + 2x` or `eigenvalues of 4, 1; 2, 3`, and hit enter.
2. **Visual Input**: Use the **Upload** tab for camera/image uploads or the **Draw** tab to sketch out equations.
3. **Practice**: Go to **Practice** or **Daily** to test your knowledge. The app tracks correct answers and boosts your XP and streak metrics.
4. **Learning**: The **Theory** cards offer flashcard-style learning modules to brush up on specific mathematical concepts.

## Development Commands

```bash
npm run dev      # Start Vite dev server with Hot Module Replacement
npm run build    # Compile TypeScript and build for production
npm run lint     # Run ESLint validation
npm run preview  # Preview the built production application
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a pull request with any improvements or new features.
