import type { Solution } from '../utils/mathSolver';
import { CheckCircleIcon, AlertIcon, categoryIcons } from './Icons';

// ─── Solution Content (Success or Error) ─────────────────────────────
export function SolutionContent({ sol }: { sol: Solution }) {
  if (sol.success) {
    return (
      <div className="animate-fade-in-up">
        {/* Result Badge */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircleIcon className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>Solved!</span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'var(--category-badge-bg)', color: 'var(--category-badge-text)' }}
          >
            {categoryIcons[sol.category] || '📝'} {sol.category}
          </span>
        </div>

        {/* Problem */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Problem</p>
          <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{sol.problem}</p>
        </div>

        {/* Answer */}
        <div
          className="p-5 rounded-2xl mb-6 border"
          style={{
            background: 'var(--accent-glow)',
            borderColor: 'var(--border-accent)',
            boxShadow: '0 0 30px var(--glow-color)',
          }}
        >
          <p className="text-xs uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Answer</p>
          <p className="text-2xl sm:text-3xl font-display accent-text-gradient wrap-break-word">
            {sol.result}
          </p>
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-base font-display mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            📝 Step-by-Step Solution
          </h3>
          <div className="space-y-3">
            {sol.steps.map((step, i) => (
              <div key={i} className="step-item opacity-0 animate-fade-in-up flex gap-3 group">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                    style={{
                      background: i === sol.steps.length - 1 ? 'var(--step-final-bg)' : 'var(--step-number-bg)',
                      color: i === sol.steps.length - 1 ? 'var(--step-final-text)' : 'var(--step-number-text)',
                      boxShadow: i === sol.steps.length - 1 ? '0 0 15px var(--success-glow)' : 'none',
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < sol.steps.length - 1 && (
                    <div className="w-px h-full mt-1" style={{ background: 'var(--step-line)' }} />
                  )}
                </div>
                <div className="pb-3 flex-1">
                  <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                  <div
                    className="rounded-xl px-4 py-3 font-mono text-sm border whitespace-pre-wrap wrap-break-word"
                    style={{
                      background: 'var(--bg-code)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--accent)',
                    }}
                  >
                    {step.expression}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-start gap-3 p-5 rounded-2xl border" style={{ background: 'rgba(220,38,38,0.05)', borderColor: 'rgba(220,38,38,0.2)' }}>
        <AlertIcon className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-display text-red-500 mb-2">Could not solve</h3>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>{sol.error}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Placeholder State ──────────────────────────────────────────
interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
}

export function EmptyState({ emoji, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4 animate-float">{emoji}</div>
      <h3 className="text-lg font-display mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm font-body max-w-xs" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────
export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-full border-3 animate-spin mb-4"
        style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent)', borderWidth: '3px' }}
      />
      <p className="text-sm font-display" style={{ color: 'var(--text-muted)' }}>
        Calculating solution...
      </p>
    </div>
  );
}
