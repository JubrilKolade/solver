import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

export type Tab = 'solver' | 'upload' | 'geometry' | 'draw' | 'practice' | 'dashboard' | 'theory' | 'collab' | 'daily' | 'examples' | 'history' | 'auth' | 'settings';

interface NavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  historyCount: number;
  dailyAvailable?: boolean;
}

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'solver', label: 'Solver', emoji: '✨' },
  { id: 'upload', label: 'Upload', emoji: '📸' },
  { id: 'geometry', label: 'Geometry', emoji: '📐' },
  { id: 'draw', label: 'Draw', emoji: '✍️' },
  { id: 'practice', label: 'Practice', emoji: '📝' },
  { id: 'dashboard', label: 'Stats', emoji: '📊' },
  { id: 'theory', label: 'Theory', emoji: '📖' },
  { id: 'collab', label: 'Collab', emoji: '👥' },
  { id: 'daily', label: 'Daily', emoji: '🔔' },
  { id: 'examples', label: 'Examples', emoji: '📚' },
  { id: 'history', label: 'History', emoji: '🕐' },
  { id: 'auth', label: 'Account', emoji: '🔑' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

export function NavBar({ activeTab, onTabChange, historyCount, dailyAvailable }: NavBarProps) {
  const { isDark } = useTheme();

  return (
    <nav
      className="glass-card-static flex gap-1 p-1.5 mb-8 mx-auto overflow-x-auto custom-scrollbar"
      style={{ borderRadius: '1rem', maxWidth: '100%' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const badge = tab.id === 'history' && historyCount > 0 ? historyCount : undefined;
        const showDot = tab.id === 'daily' && dailyAvailable;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap font-body relative shrink-0',
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
            {showDot && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
