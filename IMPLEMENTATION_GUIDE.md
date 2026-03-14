# Implementation Guide - New Features

This document outlines all the new features added to the MathSolver project and the required setup steps.

## 📦 New Dependencies to Install

```bash
npm install jspdf plotly.js-dist-min
npm install -D vitest @testing-library/react @testing-library/user-event
```

## 🎯 Features Implemented

### Phase 1: Foundational Infrastructure ✅

1. **Error Boundary Component** (`src/components/ErrorBoundary.tsx`)
   - Catches React errors and displays fallback UI
   - Shows error details in development mode
   - Prevents white-screen crashes

2. **Input Validation & Sanitization** (`src/utils/validation.ts`)
   - Math expression validation
   - File size and type validation
   - Rate limiting (50 requests/minute by default)
   - XSS prevention
   - LaTeX expression validation

3. **Offline Support** (`src/utils/offline.ts`)
   - Service Worker registration
   - IndexedDB local storage
   - Network status detection
   - Cache-first and network-first strategies

4. **Lazy Loading Tesseract.js** (`src/hooks/useLazyTesseract.ts`)
   - Only loads OCR when needed
   - Reduces initial bundle size
   - Prevents Tesseract from loading on page load

### Phase 2: Advanced Features ✅

5. **PDF Export** (`src/utils/pdfExport.ts`)
   - Export single solutions
   - Export entire history
   - Formatted, professional PDFs

6. **Equation Editor** (`src/components/EquationEditor.tsx`)
   - Visual math expression builder
   - Number pad, variables, operators
   - Direct text input
   - Backspace and clear functions

7. **Voice Input** (`src/hooks/useVoiceInput.ts`)
   - Speech-to-text for math problems
   - Voice recognition normalization
   - "x squared" → "x^2" conversion

8. **Graph Plotting** (`src/utils/graphing.ts`)
   - Generate plot points for functions
   - Find extrema (min/max)
   - Find zeros (x-intercepts)
   - Numeric integration
   - SVG path generation
   - Derivative plotting
   - Compare multiple functions

9. **Keyboard Shortcuts** (`src/hooks/useKeyboardShortcuts.ts`)
   - Customizable shortcuts
   - Default shortcuts for common actions
   - Help modal with keyboard legend

10. **Mobile Touch Gestures** (`src/hooks/useTouchGestures.ts`)
    - Swipe navigation
    - Pinch-to-zoom
    - Long press detection
    - iOS double-tap prevention

### Phase 3: Gamification & Learning ✅

11. **Achievement System** (`src/utils/achievements.ts`)
    - 12+ predefined achievements
    - XP calculations
    - Level progression
    - Rarity system (common → legendary)
    - Leaderboard functionality

12. **Curriculum & Spaced Repetition** (`src/utils/curriculum.ts`)
    - Structured courses
    - SM-2 spaced repetition algorithm
    - Prerequisite tracking
    - Weak topic identification
    - Course progress tracking

13. **Analytics & Insights** (`src/utils/analytics.ts`)
    - Learning pattern detection
    - Category performance tracking
    - Weekly trend analysis
    - Time-optimal learning detection
    - Personalized recommendations
    - Plagiarism detection

14. **Collaboration Features** (`src/utils/collaboration.ts`)
    - Collaborative problem sessions
    - Teaching sessions with chat
    - Shared notes
    - Solution comparison
    - Session sharing/linking

## 🔌 Integration Steps

### 1. Add Error Boundary to App

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      {/* Your app content */}
    </ErrorBoundary>
  );
}
```

### 2. Register Service Worker

```tsx
import { registerServiceWorker } from './utils/offline';

useEffect(() => {
  registerServiceWorker();
}, []);
```

### 3. Update Main App with Lazy Loading

```tsx
const UploadTab = React.lazy(() => import('./components/tabs/UploadTab'));
const Suspense = (Component) => (
  <React.Suspense fallback={<LoadingSpinner />}>
    <Component />
  </React.Suspense>
);
```

### 4. Add Voice Input to Solver

```tsx
import { useVoiceInput, normalizeVoiceInput } from './hooks/useVoiceInput';

const { isListening, transcript, startListening, stopListening } = useVoiceInput();

const handleVoiceSolve = () => {
  const normalized = normalizeVoiceInput(transcript);
  solve(normalized);
};
```

### 5. Add Equation Editor to Solver Tab

```tsx
import { EquationEditor } from './components/EquationEditor';

<EquationEditor onEquationChange={setInput} />
```

### 6. Add Graph Visualization

```tsx
import { generatePlotData, generateSVGPath } from './utils/graphing';

const points = generatePlotData('x^2 + 2*x + 1');
const path = generateSVGPath(points, 400, 300);
```

### 7. Enable Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts, DEFAULT_SHORTCUTS } from './hooks/useKeyboardShortcuts';

useKeyboardShortcuts(DEFAULT_SHORTCUTS);
```

### 8. Add Mobile Touch Support

```tsx
import { useSwipe, disableIOSZoom } from './hooks/useTouchGestures';

useSwipe(
  () => nextTab(),
  () => prevTab()
);

disableIOSZoom();
```

### 9. Integrate Achievements

```tsx
import { getUnlockedAchievements, getNewAchievements } from './utils/achievements';

const newAchievements = getNewAchievements(oldStats, newStats);
newAchievements.forEach(ach => showNotification(ach.name));
```

### 10. Setup Curriculum

```tsx
import { CURRICULA, calculateCourseProgress } from './utils/curriculum';

const progress = calculateCourseProgress(CURRICULA[0], completedLessons);
```

## 📊 Testing

### Setup Vitest

```bash
npm run test:setup
```

### Run Tests

```bash
npm run test
npm run test:watch
```

## 📚 Documentation

All new utilities support JSDoc comments. You can:
- Hover over functions in VS Code for documentation
- Generate docs: `npm run docs`
- Check inline comments for usage examples

## 🚀 Next Steps

1. **Component UI Implementation**
   - Create Achievement UI components
   - Create Leaderboard component
   - Create Analytics Dashboard
   - Create Collaboration UI

2. **Firebase Integration**
   - Update firebaseService to use new utils
   - Sync achievements to database
   - Store curriculum progress
   - Real-time collaboration with Firestore

3. **Testing**
   - Add unit tests for all utilities
   - Add integration tests
   - E2E tests with Playwright

4. **Performance Optimization**
   - Code splitting for tabs
   - Image optimization
   - Bundle analysis
   - Caching strategy optimization

5. **Mobile App**
   - React Native version
   - Offline-first architecture
   - Push notifications
   - Native camera for OCR

## 📝 Notes

- Service worker needs `/public/service-worker.js` compiled from TypeScript
- PDF export requires jsPDF installation
- Voice input requires HTTPS in production
- Collaboration features require Firebase Realtime Database setup
- Spaced repetition cards should be saved to database

## 🎯 Implementation Priority

1. **High Priority** (Do these first)
   - Error Boundary
   - Validation & Sanitization
   - Offline Mode
   - Achievements UI
   - Analytics Dashboard

2. **Medium Priority**
   - Keyboard Shortcuts
   - Mobile Support
   - Graph Plotting
   - PDF Export
   - Voice Input

3. **Lower Priority** (Can implement later)
   - Collaboration
   - Curriculum
   - Equation Editor (nice-to-have)
   - Spaced Repetition (requires more data)
