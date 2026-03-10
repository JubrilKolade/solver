import { cn } from '../utils/cn';
import { useTheme } from '../contexts/ThemeContext';

export type Tab = 'solver' | 'upload' | 'geometry' | 'examples' | 'history';

interface NavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  historyCount: number;
}

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'solver', label: 'Solver', emoji: '✨' },
  { id: 'upload', label: 'Upload', emoji: '📸' },
  { id: 'geometry', label: 'Geometry', emoji: '📐' },
  { id: 'examples', label: 'Examples', emoji: '📚' },
  { id: 'history', label: 'History', emoji: '🕐' },
];

export function NavBar({ activeTab, onTabChange, historyCount }: NavBarProps) {
  const { isDark } = useTheme();

  return (
    <nav
      className="glass-card-static flex gap-1 p-1.5 mb-8 max-w-2xl mx-auto overflow-x-auto"
      style={{ borderRadius: '1rem' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const badge = tab.id === 'history' && historyCount > 0 ? historyCount : undefined;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap font-body',
              isActive ? 'shadow-lg' : ''
            )}
            style={{
              background: isActive ? 'var(--tab-active-bg)' : 'transparent',
              color: isActive ? 'var(--tab-active-text)' : 'var(--tab-inactive-text)',
              boxShadow: isActive ? `0 4px 15px var(--accent-glow-strong)` : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'var(--tab-inactive-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {badge && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--accent-glow)',
                  color: isActive
                    ? 'var(--tab-active-text)'
                    : isDark
                    ? 'var(--accent)'
                    : 'var(--accent)',
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
