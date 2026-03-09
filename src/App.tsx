

// ─── Icons ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, type ReactNode } from "react";
import { exampleProblems, solveProblem, type Solution, type SolutionStep } from "./utils/mathSolver";
import { cn } from "./utils/cn";
import { GeometryTools } from "./components/GeometryTools";
import { ImageUpload } from "./components/ImageUpload";

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ShapesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}

// ─── Category color mapping ────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  'Arithmetic': 'from-blue-500 to-cyan-400',
  'Algebra': 'from-violet-500 to-purple-400',
  'Percentage': 'from-emerald-500 to-teal-400',
  'Powers & Roots': 'from-orange-500 to-amber-400',
  'Trigonometry': 'from-pink-500 to-rose-400',
  'Calculus': 'from-red-500 to-orange-400',
  'Number Theory': 'from-indigo-500 to-blue-400',
  'Statistics': 'from-teal-500 to-green-400',
  'Logarithms': 'from-fuchsia-500 to-pink-400',
  'Geometry': 'from-cyan-500 to-blue-400',
  'Probability': 'from-amber-500 to-yellow-400',
  'Simultaneous Eq.': 'from-rose-500 to-red-400',
  'Bearing': 'from-sky-500 to-blue-400',
  'Longitude & Latitude': 'from-green-500 to-emerald-400',
  'Sequences & Series': 'from-purple-500 to-violet-400',
  'Ratio & Proportion': 'from-lime-500 to-green-400',
  'Interest': 'from-yellow-500 to-orange-400',
  'Mensuration (3D)': 'from-cyan-500 to-teal-400',
  'Sets & Venn': 'from-fuchsia-500 to-purple-400',
  'Matrices': 'from-slate-500 to-gray-400',
  // College-level
  'Integration': 'from-red-600 to-pink-500',
  'Differentiation (Advanced)': 'from-orange-600 to-red-500',
  'Limits': 'from-amber-600 to-orange-500',
  'Complex Numbers': 'from-violet-600 to-indigo-500',
  'Differential Equations': 'from-emerald-600 to-cyan-500',
  'Vectors': 'from-blue-600 to-indigo-500',
  'Taylor Series': 'from-purple-600 to-fuchsia-500',
  'Laplace Transform': 'from-teal-600 to-cyan-500',
  'Linear Algebra': 'from-slate-600 to-zinc-500',
  'Partial Fractions': 'from-rose-600 to-pink-500',
};

const categoryIcons: Record<string, string> = {
  'Arithmetic': '➕',
  'Algebra': '🔤',
  'Percentage': '💯',
  'Powers & Roots': '√',
  'Trigonometry': '📐',
  'Calculus': '∫',
  'Number Theory': '🔢',
  'Statistics': '📊',
  'Logarithms': '📈',
  'Geometry': '📏',
  'Probability': '🎲',
  'Simultaneous Eq.': '🔗',
  'Bearing': '🧭',
  'Longitude & Latitude': '🌍',
  'Sequences & Series': '🔢',
  'Ratio & Proportion': '⚖️',
  'Interest': '💰',
  'Mensuration (3D)': '📦',
  'Sets & Venn': '⊕',
  'Matrices': '▦',
  // College-level
  'Integration': '∫',
  'Differentiation (Advanced)': 'δ',
  'Limits': 'lim',
  'Complex Numbers': 'ℂ',
  'Differential Equations': 'dy',
  'Vectors': '→',
  'Taylor Series': 'Σ',
  'Laplace Transform': 'ℒ',
  'Linear Algebra': '⊞',
  'Partial Fractions': '⅟',
};

type Tab = 'solver' | 'upload' | 'geometry' | 'examples' | 'history';

// ─── Main App ──────────────────────────────────────────────────────────

export function App() {
  const [input, setInput] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Solution[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('solver');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'solver') inputRef.current?.focus();
  }, [activeTab]);

  const handleSolve = () => {
    if (!input.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      const result = solveProblem(input);
      setSolution(result);
      if (result.success) {
        setHistory((prev) => [result, ...prev.slice(0, 49)]);
      }
      setIsLoading(false);

      setTimeout(() => {
        solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSolve();
  };

  const handleExampleClick = (problem: string) => {
    setInput(problem);
    setActiveTab('solver');
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        const result = solveProblem(problem);
        setSolution(result);
        if (result.success) {
          setHistory((prev) => [result, ...prev.slice(0, 49)]);
        }
        setIsLoading(false);
        setTimeout(() => {
          solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 400);
    }, 100);
  };

  const handleHistoryClick = (sol: Solution) => {
    setInput(sol.problem);
    setSolution(sol);
    setActiveTab('solver');
  };

  const handleImageTextExtracted = (_text: string) => {
    // OCR text extracted, user will see it in the textarea
  };

  const handleImageSolveText = (text: string) => {
    setInput(text);
    setActiveTab('solver');
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        const result = solveProblem(text);
        setSolution(result);
        if (result.success) {
          setHistory((prev) => [result, ...prev.slice(0, 49)]);
        }
        setIsLoading(false);
        setTimeout(() => {
          solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 400);
    }, 100);
  };

  const handleGeometrySolution = (sol: Solution) => {
    setSolution(sol);
    if (sol.success) {
      setHistory((prev) => [sol, ...prev.slice(0, 49)]);
    }
  };

  // When user uploads image in the upload tab, save URL for geometry tools
  const _setImageForGeometry = (url: string) => {
    setUploadedImageUrl(url);
  };
  void _setImageForGeometry;

  // ─── Solution Display Component ──────────────────────────────────────
  const SolutionDisplay = ({ sol, showRef }: { sol: Solution; showRef?: boolean }) => {
    if (!sol) return null;

    if (sol.success) {
      return (
        <div ref={showRef ? solutionRef : undefined} className="animate-fade-in-up">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Result Header */}
            <div className="bg-linear-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/5 px-6 sm:px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Solved!</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-gray-300">
                      {sol.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">
                    Problem: <span className="text-gray-300">{sol.problem}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Answer</div>
                <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent wrap-break-word">
                  {sol.result}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="px-6 sm:px-8 py-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookIcon className="w-5 h-5 text-indigo-400" />
                Step-by-Step Solution
              </h3>
              <div className="space-y-3">
                {sol.steps.map((step: SolutionStep, i: number) => (
                  <div key={i} className="step-item opacity-0 animate-fade-in-up flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all',
                          i === sol.steps.length - 1
                            ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white/10 text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300'
                        )}
                      >
                        {i + 1}
                      </div>
                      {i < sol.steps.length - 1 && <div className="w-px h-full bg-white/10 mt-1" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="text-sm font-medium text-gray-300 mb-1.5">{step.description as ReactNode}</div>
                      <div className="bg-white/5 rounded-xl px-4 py-3 font-mono text-sm text-indigo-300 border border-white/5 whitespace-pre-wrap wrap-break-word">
                        {step.expression}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={showRef ? solutionRef : undefined} className="animate-fade-in-up">
        <div className="bg-white/3 backdrop-blur-xl rounded-3xl border border-red-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-start gap-3">
            <AlertIcon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Could not solve</h3>
              <p className="text-gray-400 whitespace-pre-wrap text-sm">{sol.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Tabs ────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: ReactNode; badge?: number }[] = [
    { id: 'solver', label: 'Solver', icon: <SparklesIcon className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload', icon: <CameraIcon className="w-4 h-4" /> },
    { id: 'geometry', label: 'Geometry', icon: <ShapesIcon className="w-4 h-4" /> },
    { id: 'examples', label: 'Examples', icon: <BookIcon className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <ClockIcon className="w-4 h-4" />, badge: history.length || undefined },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-indigo-600/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <CalculatorIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              MathSolver
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Get step-by-step solutions — from Arithmetic to Calculus, Integration, Differential Equations, Complex Numbers, Vectors, Laplace Transforms, and more.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex justify-center gap-1 mb-8 bg-white/5 rounded-2xl p-1.5 max-w-2xl mx-auto backdrop-blur-sm border border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0',
                activeTab === tab.id
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ═══════════════ SOLVER TAB ═══════════════ */}
        {activeTab === 'solver' && (
          <div className="animate-fade-in-up">
            {/* Input Section */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-6 shadow-2xl">
              <label className="block text-sm font-medium text-gray-300 mb-3">Enter your math problem</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 2x + 5 = 11 or what is 15% of 200"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                  />
                </div>
                <button
                  onClick={handleSolve}
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    'px-6 sm:px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center gap-2 shrink-0',
                    isLoading || !input.trim()
                      ? 'bg-gray-700 cursor-not-allowed opacity-50'
                      : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  )}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Solve</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick actions */}
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500">Try:</span>
                {['integrate x^3', 'limit of sin(x)/x as x approaches 0', 'modulus of 3 + 4i', 'eigenvalues of 4, 1; 2, 3', "y'' - 4y' + 3y = 0", 'dot product of (1,2,3) and (4,5,6)', 'laplace of sin(3t)', 'taylor series of e^x'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExampleClick(ex)}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                  >
                    {ex}
                  </button>
                ))}
                <span className="text-gray-700 mx-1">|</span>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all flex items-center gap-1"
                >
                  <CameraIcon className="w-3 h-3" />
                  Upload Image
                </button>
                <button
                  onClick={() => setActiveTab('geometry')}
                  className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center gap-1"
                >
                  <ShapesIcon className="w-3 h-3" />
                  Geometry Tools
                </button>
              </div>
            </div>

            {/* Solution Display */}
            {solution && <SolutionDisplay sol={solution} showRef />}
          </div>
        )}

        {/* ═══════════════ UPLOAD TAB ═══════════════ */}
        {activeTab === 'upload' && (
          <div className="animate-fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <CameraIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Upload Math Problem</h2>
                  <p className="text-sm text-gray-500">Upload an image of your math problem — we'll extract the text and solve it</p>
                </div>
              </div>

              <ImageUpload
                onTextExtracted={(text: string) => {
                  handleImageTextExtracted(text);
                }}
                onSolveText={(text: string) => {
                  handleImageSolveText(text);
                }}
              />

              {/* Tip */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex gap-3">
                  <span className="text-amber-400 text-lg">💡</span>
                  <div>
                    <p className="text-sm text-amber-300 font-medium mb-1">Tips for best results:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Ensure text is clear and well-lit</li>
                      <li>• For diagrams (circle geometry, constructions), use the <button onClick={() => setActiveTab('geometry')} className="text-indigo-400 underline">Geometry Tools</button> tab</li>
                      <li>• You can edit the extracted text before solving</li>
                      <li>• Handwritten text may need manual correction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Show solution if navigated back */}
            {solution && <SolutionDisplay sol={solution} />}
          </div>
        )}

        {/* ═══════════════ GEOMETRY TAB ═══════════════ */}
        {activeTab === 'geometry' && (
          <div className="animate-fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ShapesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Geometry Tools</h2>
                  <p className="text-sm text-gray-500">
                    Select a shape, choose a formula, and enter values for step-by-step solutions
                  </p>
                </div>
              </div>

              <GeometryTools
                onSolution={handleGeometrySolution}
                imageUrl={uploadedImageUrl}
              />
            </div>

            {/* Solution Display */}
            {solution && solution.category === 'Geometry' && <SolutionDisplay sol={solution} />}
          </div>
        )}

        {/* ═══════════════ EXAMPLES TAB ═══════════════ */}
        {activeTab === 'examples' && (
          <div className="animate-fade-in-up space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white mb-2">Example Problems</h2>
              <p className="text-gray-400">Click any problem to solve it instantly</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  !selectedCategory
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                )}
              >
                All
              </button>
              {exampleProblems.map((cat: typeof exampleProblems[number]) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    selectedCategory === cat.category
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  )}
                >
                  {categoryIcons[cat.category]} {cat.category}
                </button>
              ))}
            </div>

            {/* Problems grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {exampleProblems
                .filter((cat: typeof exampleProblems[number]) => !selectedCategory || cat.category === selectedCategory)
                .map((cat: typeof exampleProblems[number]) => (
                  <div
                    key={cat.category}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <div
                      className={cn(
                        'px-5 py-3 bg-linear-to-r',
                        categoryColors[cat.category as keyof typeof categoryColors] || 'from-gray-500 to-gray-400',
                        'bg-opacity-20'
                      )}
                    >
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <span className="text-lg">{(cat as any).icon || categoryIcons[cat.category as keyof typeof categoryIcons] || '📝'}</span>
                        {cat.category}
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {cat.problems.map((problem: string) => (
                        <button
                          key={problem}
                          onClick={() => handleExampleClick(problem)}
                          className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-gray-300 hover:text-white transition-all group flex items-center justify-between"
                        >
                          <span className="font-mono text-sm">{problem}</span>
                          <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ═══════════════ HISTORY TAB ═══════════════ */}
        {activeTab === 'history' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Solution History</h2>
              <p className="text-gray-400">Your recently solved problems</p>
            </div>

            {history.length === 0 ? (
              <div className="bg-white/3 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
                <ClockIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No history yet</h3>
                <p className="text-gray-500 mb-6">Solve some problems and they'll appear here</p>
                <button
                  onClick={() => setActiveTab('solver')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  Start Solving
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setHistory([])}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Clear History
                  </button>
                </div>
                <div className="space-y-3">
                  {history.map((sol, i) => (
                    <button
                      key={i}
                      onClick={() => handleHistoryClick(sol)}
                      className="w-full text-left bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/30 p-5 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                              {sol.category}
                            </span>
                          </div>
                          <div className="font-mono text-gray-300 truncate">{sol.problem}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm text-gray-500 mb-1">Answer</div>
                          <div className="font-semibold text-emerald-400 font-mono text-sm">{sol.result}</div>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4" />
            <span>MathSolver — Your Personal Math Tutor</span>
          </div>
          <p>Type problems, upload images, or use geometry tools for step-by-step solutions</p>
        </footer>
      </div>
    </div>
  );
}
