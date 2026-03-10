import { useState } from 'react';
import { solveProblem, type Solution } from './utils/mathSolver';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Header } from './components/Header';
import { NavBar, type Tab } from './components/NavBar';
import { SolverTab } from './components/SolverTab';
import { UploadTab } from './components/UploadTab';
import { GeometryTab } from './components/GeometryTab';
import { ExamplesTab } from './components/ExamplesTab';
import { HistoryTab } from './components/HistoryTab';
import { Footer } from './components/Footer';

function AppContent() {
  const [input, setInput] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [history, setHistory] = useState<Solution[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('solver');

  // ─── Shared Handlers ────────────────────────────────────────────────
  const addToHistory = (sol: Solution) => {
    setHistory((prev) => [sol, ...prev.slice(0, 49)]);
  };

  const handleExampleClick = (problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  };

  const handleHistoryClick = (sol: Solution) => {
    setInput(sol.problem);
    setSolution(sol);
    setActiveTab('solver');
  };

  const handleImageSolveText = (text: string) => {
    setInput(text);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(text);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  };

  const handleGeometrySolution = (sol: Solution) => {
    setSolution(sol);
    if (sol.success) addToHistory(sol);
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
      <BackgroundOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Header />

        <NavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyCount={history.length}
        />

        {/* ─── Tab Content ─── */}
        {activeTab === 'solver' && (
          <SolverTab
            solution={solution}
            setSolution={setSolution}
            input={input}
            setInput={setInput}
            addToHistory={addToHistory}
            onTabChange={setActiveTab}
            isActive={activeTab === 'solver'}
          />
        )}

        {activeTab === 'upload' && (
          <UploadTab
            solution={solution}
            onSolveText={handleImageSolveText}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'geometry' && (
          <GeometryTab
            solution={solution}
            onSolution={handleGeometrySolution}
            uploadedImageUrl={null}
          />
        )}

        {activeTab === 'examples' && (
          <ExamplesTab onExampleClick={handleExampleClick} />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            clearHistory={() => setHistory([])}
            onHistoryClick={handleHistoryClick}
            onTabChange={setActiveTab}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
