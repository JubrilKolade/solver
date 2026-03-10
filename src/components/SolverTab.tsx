import { useState, useRef, useEffect } from 'react';
import { solveProblem, type Solution } from '../utils/mathSolver';
import { cn } from '../utils/cn';
import { ArrowRightIcon } from './Icons';
import { SolutionContent, EmptyState, LoadingState } from './SolutionCard';
import type { Tab } from './NavBar';

interface SolverTabProps {
  solution: Solution | null;
  setSolution: (sol: Solution | null) => void;
  input: string;
  setInput: (val: string) => void;
  addToHistory: (sol: Solution) => void;
  onTabChange: (tab: Tab) => void;
  isActive: boolean;
}

const quickExamples = [
  'if p = 1/3 and q = 2/3, find (q²-p²)/(q²+p²)',
  'x^2 - 5x + 6 = 0',
  'simplify (6a + 3b - 4) - (2a - 7b + 6)',
  '6 workers complete in 20 days, how many days for 15 workers',
  'perimeter of quadrant with radius 14',
  'product of two consecutive even numbers is 840, find sum of squares',
  'integrate x^3',
  'mean of 4, 8, 15, 16, 23, 42',
];

export function SolverTab({ solution, setSolution, input, setInput, addToHistory, onTabChange, isActive }: SolverTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const handleSolve = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const result = solveProblem(input);
      setSolution(result);
      if (result.success) addToHistory(result);
      setIsLoading(false);
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSolve();
    }
  };

  const handleExampleClick = (problem: string) => {
    setInput(problem);
    setIsLoading(true);
    setTimeout(() => {
      const result = solveProblem(problem);
      setSolution(result);
      if (result.success) addToHistory(result);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ─── LEFT CARD: Input ─── */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-xl font-display mb-1" style={{ color: 'var(--text-primary)' }}>
            ✍️ Enter Problem
          </h2>
          <p className="text-xs mb-5 font-body" style={{ color: 'var(--text-muted)' }}>
            Type any math question — algebra, calculus, statistics, and more
          </p>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'e.g. solve 2x + 5 = 11\ne.g. integrate x^3\ne.g. mean of 4, 8, 15, 16'}
            rows={4}
            className="w-full px-5 py-4 rounded-2xl text-base font-body resize-none transition-all duration-300 focus:outline-none"
            style={{
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--glow-color)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* Solve Button */}
          <button
            onClick={handleSolve}
            disabled={!input.trim() || isLoading}
            className={cn(
              'w-full mt-4 py-4 rounded-2xl font-display text-lg transition-all flex items-center justify-center gap-3',
              !input.trim() && 'opacity-40 cursor-not-allowed',
              input.trim() && !isLoading && 'hover:scale-[1.01] active:scale-[0.98]'
            )}
            style={{
              background: input.trim() ? 'var(--accent)' : 'var(--text-faint)',
              color: input.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
              boxShadow: input.trim() ? '0 4px 25px var(--accent-glow-strong)' : 'none',
            }}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--text-faint)', borderTopColor: 'var(--bg-primary)' }} />
            ) : (
              <>
                Solve Now
                <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Quick Try */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Quick Try
            </p>
            <div className="flex flex-wrap gap-2">
              {quickExamples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExampleClick(ex)}
                  className="text-xs px-3 py-1.5 rounded-full font-body transition-all duration-200 border"
                  style={{
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border-color)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--accent-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links to other tabs */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onTabChange('upload')}
              className="text-xs px-3 py-1.5 rounded-full font-body transition-all flex items-center gap-1 border"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}
            >
              📸 Upload Image
            </button>
            <button
              onClick={() => onTabChange('geometry')}
              className="text-xs px-3 py-1.5 rounded-full font-body transition-all flex items-center gap-1 border"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}
            >
              📐 Geometry Tools
            </button>
          </div>
        </div>

        {/* ─── RIGHT CARD: Solution ─── */}
        <div ref={solutionRef} className={cn(solution ? 'glass-card-glow' : 'glass-card')} style={{ minHeight: '300px' }}>
          <div className="p-6 sm:p-8">
            {!solution && !isLoading && (
              <EmptyState
                emoji="💡"
                title="Solution appears here"
                description="Enter a problem on the left and click Solve Now to see a detailed step-by-step solution"
              />
            )}
            {isLoading && <LoadingState />}
            {solution && !isLoading && <SolutionContent sol={solution} />}
          </div>
        </div>
      </div>
    </div>
  );
}
