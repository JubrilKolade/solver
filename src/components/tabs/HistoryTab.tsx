import { ArrowRightIcon, TrashIcon, ClockIcon, categoryIcons } from '../Icons';
import type { Tab } from '../layout/NavBar';
import type { HistoryItem } from '../../services/firebaseService';
import { useTheme } from '../../contexts/ThemeContext';

interface HistoryTabProps {
  history: HistoryItem[];
  clearHistory: () => void;
  onHistoryClick: (item: HistoryItem) => void;
  onTabChange: (tab: Tab) => void;
}

export function HistoryTab({ history, clearHistory, onHistoryClick, onTabChange }: HistoryTabProps) {
  const { isDark } = useTheme();

  if (history.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display accent-text-gradient mb-1">🕐 Solution History</h2>
          <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>Your recently solved problems</p>
        </div>

        <div className="glass-card p-12 text-center max-w-lg mx-auto">
          <ClockIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faint)' }} />
          <h3 className="text-lg font-display mb-2" style={{ color: 'var(--text-secondary)' }}>No history yet 🎈</h3>
          <p className="text-sm font-body mb-6" style={{ color: 'var(--text-muted)' }}>
            Solve some problems and they'll appear here
          </p>
          <button
            onClick={() => onTabChange('solver')}
            className="px-6 py-3 rounded-xl font-display transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: isDark ? '#0a0a0a' : '#fff',
              boxShadow: '0 4px 15px var(--accent-glow-strong)',
            }}
          >
            Start Solving ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display accent-text-gradient mb-1">🕐 Solution History</h2>
        <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
          {history.length} problem{history.length !== 1 ? 's' : ''} solved — saved to cloud ☁️
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm font-body transition-colors hover:text-red-500"
            style={{ color: 'var(--text-muted)' }}
          >
            <TrashIcon className="w-4 h-4" />
            Clear All History
          </button>
        </div>
        <div className="space-y-3">
          {history.map((item, i) => (
            <button
              key={item.id || i}
              onClick={() => onHistoryClick(item)}
              className="w-full text-left glass-card p-5 transition-all group"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--glow-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--category-badge-bg)', color: 'var(--category-badge-text)' }}
                    >
                      {categoryIcons[item.category] || '📝'} {item.category}
                    </span>
                    {item.timestamp && (
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.problem}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Answer</div>
                  <div className="font-display text-sm accent-text-gradient">{item.result}</div>
                </div>
                <ArrowRightIcon className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
