import { useTheme } from '../../contexts/ThemeContext';
import type { UserStats } from '../../services/firebaseService';

// Re-export for backward compatibility
export type { UserStats } from '../../services/firebaseService';
export { defaultStats } from '../../services/firebaseService';

const levels = [
  { name: 'Beginner', emoji: '🌱', xp: 0 },
  { name: 'Apprentice', emoji: '📖', xp: 100 },
  { name: 'Scholar', emoji: '🎓', xp: 300 },
  { name: 'Problem Solver', emoji: '🧩', xp: 600 },
  { name: 'Mathematician', emoji: '📐', xp: 1000 },
  { name: 'Expert', emoji: '⭐', xp: 1500 },
  { name: 'Master', emoji: '🏆', xp: 2500 },
  { name: 'Professor', emoji: '👨‍🏫', xp: 4000 },
  { name: 'Genius', emoji: '🧠', xp: 6000 },
  { name: 'Grandmaster', emoji: '👑', xp: 10000 },
];

const allBadges = [
  { id: 'first', name: 'First Steps', emoji: '🌟', desc: 'Solve your first problem', check: (s: UserStats) => s.totalSolved >= 1 },
  { id: 'ten', name: 'Getting Started', emoji: '🔟', desc: 'Solve 10 problems', check: (s: UserStats) => s.totalSolved >= 10 },
  { id: 'streak5', name: 'On Fire', emoji: '🔥', desc: '5 correct in a row', check: (s: UserStats) => s.bestStreak >= 5 },
  { id: 'streak10', name: 'Unstoppable', emoji: '⚡', desc: '10 correct in a row', check: (s: UserStats) => s.bestStreak >= 10 },
  { id: 'century', name: 'Century', emoji: '💯', desc: 'Solve 100 problems', check: (s: UserStats) => s.totalSolved >= 100 },
  { id: 'accurate', name: 'Sharpshooter', emoji: '🎯', desc: '80%+ accuracy (min 20)', check: (s: UserStats) => s.totalSolved >= 20 && (s.totalCorrect / s.totalSolved) >= 0.8 },
  { id: 'algebra', name: 'Algebra Ace', emoji: '🔤', desc: 'Solve 20 algebra problems', check: (s: UserStats) => (s.topicStats['algebra']?.solved || 0) >= 20 },
  { id: 'geometry', name: 'Geometry Guru', emoji: '📐', desc: 'Solve 20 geometry problems', check: (s: UserStats) => (s.topicStats['geometry']?.solved || 0) >= 20 },
  { id: 'calculus', name: 'Calculus King', emoji: '∫', desc: 'Solve 20 calculus problems', check: (s: UserStats) => (s.topicStats['calculus']?.solved || 0) >= 20 },
  { id: 'stats', name: 'Stats Wizard', emoji: '📊', desc: 'Solve 20 statistics problems', check: (s: UserStats) => (s.topicStats['statistics']?.solved || 0) >= 20 },
  { id: 'prob', name: 'Probability Pro', emoji: '🎲', desc: 'Solve 20 probability problems', check: (s: UserStats) => (s.topicStats['probability']?.solved || 0) >= 20 },
  { id: 'xp1000', name: 'XP Hunter', emoji: '💎', desc: 'Earn 1000 XP', check: (s: UserStats) => s.totalXP >= 1000 },
];

export function getLevel(xp: number) {
  let lvl = levels[0];
  for (const l of levels) {
    if (xp >= l.xp) lvl = l;
  }
  const idx = levels.indexOf(lvl);
  const next = levels[idx + 1] || null;
  const progress = next ? ((xp - lvl.xp) / (next.xp - lvl.xp)) * 100 : 100;
  return { ...lvl, level: idx + 1, nextLevel: next, progress: Math.min(progress, 100), currentXP: xp };
}

interface DashboardProps {
  stats: UserStats;
  onResetStats: () => void;
}

export function Dashboard({ stats, onResetStats }: DashboardProps) {
  const { isDark } = useTheme();
  const lvl = getLevel(stats.totalXP);
  const accuracy = stats.totalSolved > 0 ? Math.round((stats.totalCorrect / stats.totalSolved) * 100) : 0;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeekly = Math.max(...stats.weeklyActivity, 1);

  const topicList = [
    { id: 'arithmetic', label: 'Arithmetic', emoji: '➕' },
    { id: 'algebra', label: 'Algebra', emoji: '🔤' },
    { id: 'quadratic', label: 'Quadratics', emoji: '📈' },
    { id: 'geometry', label: 'Geometry', emoji: '📐' },
    { id: 'trigonometry', label: 'Trigonometry', emoji: '🔺' },
    { id: 'calculus', label: 'Calculus', emoji: '∫' },
    { id: 'probability', label: 'Probability', emoji: '🎲' },
    { id: 'statistics', label: 'Statistics', emoji: '📊' },
    { id: 'sequences', label: 'Sequences', emoji: '🔢' },
    { id: 'percentage', label: 'Percentages', emoji: '💯' },
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Level & XP */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display" style={{ color: 'var(--text-primary)' }}>📊 Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              ☁️ Synced
            </span>
            <button
              onClick={onResetStats}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Level card */}
        <div className="p-5 rounded-2xl border mb-6" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)', boxShadow: '0 0 30px var(--glow-color)' }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-4xl">{lvl.emoji}</div>
            <div className="flex-1">
              <p className="font-display text-xl" style={{ color: 'var(--accent)' }}>
                Level {lvl.level}: {lvl.name}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {stats.totalXP} XP {lvl.nextLevel ? `• ${lvl.nextLevel.xp - stats.totalXP} XP to ${lvl.nextLevel.name}` : '• MAX LEVEL!'}
              </p>
            </div>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${lvl.progress}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Solved', value: stats.totalSolved, emoji: '✅' },
            { label: 'Accuracy', value: `${accuracy}%`, emoji: '🎯' },
            { label: 'Streak', value: stats.currentStreak, emoji: '🔥' },
            { label: 'Best Streak', value: stats.bestStreak, emoji: '⚡' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl text-center border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xl font-display" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Mastery */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-lg font-display mb-4" style={{ color: 'var(--text-primary)' }}>🎯 Topic Mastery</h3>
        <div className="space-y-3">
          {topicList.map((topic) => {
            const ts = stats.topicStats[topic.id] || { solved: 0, correct: 0 };
            const acc = ts.solved > 0 ? Math.round((ts.correct / ts.solved) * 100) : 0;
            const mastery = ts.solved === 0 ? 'New' : acc >= 80 ? 'Master' : acc >= 60 ? 'Advanced' : acc >= 40 ? 'Learning' : 'Beginner';
            const barColor = mastery === 'Master' ? '#22c55e' : mastery === 'Advanced' ? '#3b82f6' : mastery === 'Learning' ? '#eab308' : 'var(--text-faint)';

            return (
              <div key={topic.id} className="flex items-center gap-3">
                <span className="text-lg w-8">{topic.emoji}</span>
                <span className="text-sm font-medium w-24 truncate" style={{ color: 'var(--text-primary)' }}>{topic.label}</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(acc, 100)}%`, background: barColor }} />
                </div>
                <span className="text-xs w-16 text-right" style={{ color: 'var(--text-muted)' }}>{ts.solved > 0 ? `${acc}%` : '—'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full w-20 text-center" style={{
                  background: mastery === 'Master' ? 'rgba(34,197,94,0.15)' : mastery === 'Advanced' ? 'rgba(59,130,246,0.15)' : mastery === 'Learning' ? 'rgba(234,179,8,0.15)' : 'var(--bg-subtle)',
                  color: mastery === 'Master' ? '#22c55e' : mastery === 'Advanced' ? '#3b82f6' : mastery === 'Learning' ? '#eab308' : 'var(--text-faint)',
                }}>
                  {mastery}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-lg font-display mb-4" style={{ color: 'var(--text-primary)' }}>📅 This Week</h3>
        <div className="flex items-end gap-2 h-32">
          {stats.weeklyActivity.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium" style={{ color: count > 0 ? 'var(--accent)' : 'var(--text-faint)' }}>
                {count > 0 ? count : ''}
              </span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.max((count / maxWeekly) * 100, 4)}%`,
                  background: count > 0 ? 'var(--accent)' : 'var(--bg-subtle)',
                  opacity: count > 0 ? 1 : 0.3,
                }}
              />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-lg font-display mb-4" style={{ color: 'var(--text-primary)' }}>
          🏅 Badges ({allBadges.filter(b => b.check(stats)).length}/{allBadges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allBadges.map((badge) => {
            const unlocked = badge.check(stats);
            return (
              <div
                key={badge.id}
                className="p-3 rounded-xl text-center border transition-all"
                style={{
                  background: unlocked ? 'var(--accent-glow)' : 'var(--bg-subtle)',
                  borderColor: unlocked ? 'var(--border-accent)' : 'var(--border-color)',
                  opacity: unlocked ? 1 : 0.5,
                  boxShadow: unlocked ? '0 0 15px var(--glow-color)' : 'none',
                }}
              >
                <div className="text-2xl mb-1" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{badge.emoji}</div>
                <div className="text-xs font-display" style={{ color: unlocked ? 'var(--accent)' : 'var(--text-faint)' }}>{badge.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{badge.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentProblems.length > 0 && (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="text-lg font-display mb-4" style={{ color: 'var(--text-primary)' }}>🕐 Recent Activity</h3>
          <div className="space-y-2">
            {stats.recentProblems.slice(0, 10).map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
                <span>{p.correct ? '✅' : '❌'}</span>
                <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{p.problem}</span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  {new Date(p.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
