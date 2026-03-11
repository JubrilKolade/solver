import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 4px 20px var(--accent-glow-strong)' }}
        >
          <span className="text-2xl">🧮</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display accent-text-gradient">Solver</h1>
          <p className="text-xs font-body hidden sm:block" style={{ color: 'var(--text-muted)' }}>
            Step-by-step solutions for every math problem
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle flex items-center border"
        style={{
          background: isDark ? 'rgba(163,230,53,0.15)' : 'rgba(0,0,0,0.06)',
          borderColor: isDark ? 'rgba(163,230,53,0.3)' : 'rgba(0,0,0,0.1)',
        }}
      >
        <div
          className="toggle-thumb"
          style={{
            background: isDark ? '#a3e635' : '#fff',
            boxShadow: isDark ? '0 0 10px rgba(163,230,53,0.5)' : '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          {isDark ? '🌙' : '☀️'}
        </div>
      </button>
    </header>
  );
}
