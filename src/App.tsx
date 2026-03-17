import { useState, useEffect, useCallback } from 'react';
import { solveProblem, type Solution } from './utils/mathSolver';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Header } from './components/layout/Header';
import { NavBar, type Tab } from './components/layout/NavBar';
import { SolverTab } from './components/tabs/SolverTab';
import { UploadTab } from './components/tabs/UploadTab';
import { GeometryTab } from './components/tabs/GeometryTab';
import { ExamplesTab } from './components/tabs/ExamplesTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { Footer } from './components/layout/Footer';
import { HandwritingCanvas } from './components/tabs/HandwritingCanvas';
import { PracticeMode } from './components/tabs/PracticeMode';
import { Dashboard } from './components/tabs/Dashboard';
import { TheoryCards } from './components/tabs/TheoryCards';
import { CollabMode } from './components/tabs/CollabMode';
import { DailyProblem } from './components/tabs/DailyProblem';
import { LoginSignupTab } from './components/tabs/LoginSignupTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { SignupPromptModal } from './components/SignupPromptModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import * as fb from './services/firebaseService';
import type { UserStats } from './services/firebaseService';

// ─── NEW FEATURES ───────────────────────────────────────────────────
import { ErrorBoundary } from './components/ErrorBoundary';
import { useKeyboardShortcuts, DEFAULT_SHORTCUTS } from './hooks/useKeyboardShortcuts';
import { registerServiceWorker, isOnline } from './utils/offline';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { isAnonymous } = useAuth();
  const [input, setInput] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [history, setHistory] = useState<fb.HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('solver');
  const [stats, setStats] = useState<UserStats>(fb.defaultStats);
  const [dailyAvailable, setDailyAvailable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // ─── NEW: Offline & Achievements ─────────────────────────────────
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [signupPromptFeature, setSignupPromptFeature] = useState('this feature');

  // Load everything from Firebase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [savedStats, savedHistory, dailyStatus] = await Promise.all([
          fb.getUserStats(),
          fb.getHistory(),
          fb.getDailyStatus(),
        ]);
        setStats(savedStats);
        setHistory(savedHistory);
        setDailyAvailable(!dailyStatus.completed);
      } catch (e) {
        console.error('Failed to load from Firebase:', e);
      }
      setLoaded(true);
    }
    loadData();
    
    // Register Service Worker for offline support
    registerServiceWorker();
    
    // Check online status
    setIsOnlineStatus(isOnline());
  }, []);

  // Check daily availability when switching tabs
  useEffect(() => {
    if (activeTab === 'daily') {
      fb.getDailyStatus().then(s => setDailyAvailable(!s.completed));
    }

    // Prompt for signup when accessing premium features as anonymous
    const premiumFeatures: Record<string, string> = {
      'collab': 'collaboration',
      'settings': 'account settings',
      'dashboard': 'that feature',
    };

    if (isAnonymous && premiumFeatures[activeTab]) {
      setSignupPromptFeature(premiumFeatures[activeTab]);
      setShowSignupPrompt(true);
    }
  }, [activeTab, isAnonymous]);
  
  // ─── NEW: Setup keyboard shortcuts ─────────────────────────────────
  useKeyboardShortcuts(DEFAULT_SHORTCUTS);

  // Save stats to Firebase whenever they change
  useEffect(() => {
    if (!loaded) return;
    fb.saveUserStats(stats);
  }, [stats, loaded]);

  // ─── Shared Handlers ────────────────────────────────────────────────
  const addToHistory = useCallback((sol: Solution) => {
    const item: fb.HistoryItem = {
      problem: sol.problem,
      result: sol.result,
      category: sol.category,
      steps: sol.steps,
      timestamp: Date.now(),
    };

    // Save to Firebase
    fb.saveToHistory(item);
    fb.updateWeeklyActivity();
    
    // ─── NEW: Track analytics & achievements ─────────────────────────
    // Check for achievement unlocks
    const newAchievements = checkAchievements(stats);
    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(ach => {
        console.log(`🏆 Achievement Unlocked: ${ach}`);
      });
    }

    // Update local state
    setHistory((prev) => [item, ...prev.slice(0, 49)]);
    setStats((prev) => {
      const day = new Date().getDay();
      const adjustedDay = day === 0 ? 6 : day - 1;
      const weekly = [...prev.weeklyActivity];
      weekly[adjustedDay] = (weekly[adjustedDay] || 0) + 1;
      return {
        ...prev,
        totalSolved: prev.totalSolved + 1,
        totalXP: prev.totalXP + 10,
        weeklyActivity: weekly,
        recentProblems: [
          { problem: sol.problem, time: Date.now(), correct: true },
          ...prev.recentProblems.slice(0, 19),
        ],
      };
    });
  }, [stats]);

  const handleExampleClick = useCallback((problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);

  const handleHistoryClick = useCallback((item: fb.HistoryItem) => {
    setInput(item.problem);
    const sol: Solution = {
      problem: item.problem,
      result: item.result,
      category: item.category,
      steps: item.steps,
      success: true,
    };
    setSolution(sol);
    setActiveTab('solver');
  }, []);

  const handleImageSolveText = useCallback((text: string) => {
    setInput(text);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(text);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);

  const handleGeometrySolution = useCallback((sol: Solution) => {
    setSolution(sol);
    if (sol.success) addToHistory(sol);
  }, [addToHistory]);

  const handleCanvasRecognized = useCallback((text: string) => {
    setInput(text);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(text);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);

  const handleXPGain = useCallback((xp: number) => {
    setStats((prev) => {
      const updated = { ...prev, totalXP: prev.totalXP + xp };
      return updated;
    });
  }, []);

  const handleProblemSolved = useCallback((topic: string, correct: boolean) => {
    setStats((prev) => {
      const topicStats = { ...prev.topicStats };
      if (!topicStats[topic]) topicStats[topic] = { solved: 0, correct: 0 };
      topicStats[topic] = {
        solved: topicStats[topic].solved + 1,
        correct: topicStats[topic].correct + (correct ? 1 : 0),
      };

      const newStreak = correct ? prev.currentStreak + 1 : 0;

      return {
        ...prev,
        totalSolved: prev.totalSolved + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        topicStats,
      };
    });
  }, []);

  const handleResetStats = useCallback(() => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      setStats(fb.defaultStats);
      setHistory([]);
      fb.resetUserStats();
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    if (confirm('Clear all solve history?')) {
      setHistory([]);
      fb.clearHistory();
    }
  }, []);

  const handleDailySolve = useCallback((problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);

  const handleCollabSolve = useCallback((problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);

  const handleTheoryExample = useCallback((problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
    }, 100);
  }, [addToHistory]);
  
  // ─── NEW: Achievement checker ────────────────────────────────────
  const checkAchievements = (currentStats: UserStats): string[] => {
    const unlocked: string[] = [];
    
    // First Step Achievement
    if (currentStats.totalSolved === 1 && !unlockedAchievements.includes('first_step')) {
      unlocked.push('first_step');
    }
    
    // Math Master (50+ solves)
    if (currentStats.totalSolved >= 50 && !unlockedAchievements.includes('math_master')) {
      unlocked.push('math_master');
    }
    
    // Perfect Week (7+ daily solves)
    const weekTotal = currentStats.weeklyActivity.reduce((a, b) => a + b, 0);
    if (weekTotal >= 7 && !unlockedAchievements.includes('perfect_week')) {
      unlocked.push('perfect_week');
    }
    
    // Category Expert (20+ in category)
    const categoryCount = currentStats.recentProblems
      .filter(p => p.correct)
      .length;
    if (categoryCount >= 20 && !unlockedAchievements.includes('category_expert')) {
      unlocked.push('category_expert');
    }
    
    return unlocked;
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
      <BackgroundOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ─── NEW: Offline Status Bar ─── */}
        {!isOnlineStatus && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-center gap-2 text-yellow-300 text-sm">
            <span className="animate-pulse">●</span>
            Offline Mode - Using cached data
          </div>
        )}
        
        {/* ─── NEW: Achievements Notification ─── */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-700/50 rounded-lg flex items-center gap-2 text-indigo-300 text-sm">
            <span>🏆</span>
            {unlockedAchievements.length} Achievement{unlockedAchievements.length !== 1 ? 's' : ''} Unlocked!
          </div>
        )}
                <Header />

        <NavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyCount={history.length}
          dailyAvailable={dailyAvailable}
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

        {activeTab === 'draw' && (
          <HandwritingCanvas onRecognized={handleCanvasRecognized} />
        )}

        {activeTab === 'practice' && (
          <PracticeMode
            onXPGain={handleXPGain}
            onProblemSolved={handleProblemSolved}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            onResetStats={handleResetStats}
          />
        )}

        {activeTab === 'theory' && (
          <TheoryCards onTryExample={handleTheoryExample} />
        )}

        {activeTab === 'collab' && (
          <CollabMode
            currentProblem={input}
            onSolveProblem={handleCollabSolve}
          />
        )}

        {activeTab === 'daily' && (
          <DailyProblem
            onXPGain={handleXPGain}
            onSolve={handleDailySolve}
          />
        )}

        {activeTab === 'examples' && (
          <ExamplesTab onExampleClick={handleExampleClick} />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            clearHistory={handleClearHistory}
            onHistoryClick={handleHistoryClick}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'auth' && (
          <LoginSignupTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}

        <Footer />
      </div>

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        feature={signupPromptFeature}
        onSignUp={() => setActiveTab('auth')}
      />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
