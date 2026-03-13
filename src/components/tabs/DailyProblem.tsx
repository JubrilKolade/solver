import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { solveProblem, type Solution } from '../../utils/mathSolver';
import * as fb from '../../services/firebaseService';

interface DailyProblemProps {
  onXPGain: (xp: number) => void;
  onSolve: (problem: string) => void;
}

const dailyProblems = [
  { q: 'x^2 - 7x + 12 = 0', topic: 'Quadratic', difficulty: 'Medium' },
  { q: 'derivative of 3x^4 - 2x^2 + x', topic: 'Calculus', difficulty: 'Medium' },
  { q: 'mean of 12, 15, 18, 21, 24, 30', topic: 'Statistics', difficulty: 'Easy' },
  { q: 'combination 8, 3', topic: 'Probability', difficulty: 'Easy' },
  { q: 'what is 35% of 240', topic: 'Percentage', difficulty: 'Easy' },
  { q: 'arithmetic progression a=5, d=3, n=12', topic: 'Sequences', difficulty: 'Medium' },
  { q: '2x + 3y = 12 and x - y = 1', topic: 'Simultaneous', difficulty: 'Medium' },
  { q: 'integrate x^2 + 3x', topic: 'Calculus', difficulty: 'Medium' },
  { q: 'sin(60 degrees)', topic: 'Trigonometry', difficulty: 'Easy' },
  { q: 'convert 47 base 8 to base 10', topic: 'Number Bases', difficulty: 'Easy' },
  { q: 'if p = 1/3 and q = 2/3, find (q^2 - p^2)/(q^2 + p^2)', topic: 'Fractions', difficulty: 'Hard' },
  { q: 'back bearing of 135', topic: 'Bearing', difficulty: 'Easy' },
  { q: 'x^2 + 4x - 21 = 0', topic: 'Quadratic', difficulty: 'Medium' },
  { q: 'gcd of 84 and 36', topic: 'Number Theory', difficulty: 'Easy' },
  { q: 'volume of sphere r=7', topic: 'Mensuration', difficulty: 'Medium' },
  { q: '6 workers complete in 20 days, how many days for 15 workers', topic: 'Work Rate', difficulty: 'Medium' },
  { q: 'product of two consecutive even numbers is 840, find sum of squares', topic: 'Competition', difficulty: 'Hard' },
  { q: 'perimeter of quadrant with radius 14', topic: 'Geometry', difficulty: 'Medium' },
  { q: 'simplify (6a + 3b - 4) - (2a - 7b + 6)', topic: 'Algebra', difficulty: 'Easy' },
  { q: 'derivative of sin(x) * x^2', topic: 'Calculus', difficulty: 'Hard' },
  { q: 'standard deviation of 2, 4, 4, 4, 5, 5, 7, 9', topic: 'Statistics', difficulty: 'Medium' },
  { q: 'percentage change from 80 to 100', topic: 'Percentage', difficulty: 'Easy' },
  { q: 'geometric progression a=2, r=3, n=6', topic: 'Sequences', difficulty: 'Medium' },
  { q: 'factorize 360', topic: 'Number Theory', difficulty: 'Easy' },
  { q: 'limit of (x^2 - 1)/(x - 1) as x approaches 1', topic: 'Calculus', difficulty: 'Hard' },
  { q: '3x - 2y = 7 and 2x + y = 11', topic: 'Simultaneous', difficulty: 'Medium' },
  { q: 'lcm of 24 and 36', topic: 'Number Theory', difficulty: 'Easy' },
  { q: 'priced at 18.50, actual cost 20.00, percentage error', topic: 'Percentage Error', difficulty: 'Easy' },
  { q: 'cos(45 degrees)', topic: 'Trigonometry', difficulty: 'Easy' },
  { q: 'integrate sin(x)', topic: 'Calculus', difficulty: 'Medium' },
  { q: 'median of 3, 7, 8, 5, 12, 14, 21, 13, 18', topic: 'Statistics', difficulty: 'Easy' },
];

function getDailyProblem(): typeof dailyProblems[0] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyProblems[dayOfYear % dailyProblems.length];
}

export function DailyProblem({ onXPGain, onSolve }: DailyProblemProps) {
  const { isDark } = useTheme();
  const [dailyQ] = useState(getDailyProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load daily status from Firebase
  useEffect(() => {
    async function loadDailyStatus() {
      try {
        const status = await fb.getDailyStatus();
        setCompleted(status.completed);
        setDailyStreak(status.streak);
      } catch (e) {
        console.error('Failed to load daily status:', e);
      }
      setLoading(false);
    }
    loadDailyStatus();
  }, []);

  const handleSubmit = async () => {
    const sol = solveProblem(dailyQ.q);
    setSolution(sol);

    if (sol.success) {
      const correctAnswer = sol.result.toLowerCase().replace(/\s+/g, '');
      const userAns = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
      const numCorrect = parseFloat(correctAnswer);
      const numUser = parseFloat(userAns);
      const isCorrect = correctAnswer === userAns ||
        (!isNaN(numCorrect) && !isNaN(numUser) && Math.abs(numCorrect - numUser) < 0.01);

      if (isCorrect) {
        setShowResult('correct');
        onXPGain(75);
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        // Save to Firebase
        await fb.saveDailyCompletion(newStreak);
      } else {
        setShowResult('wrong');
        // Still mark as completed even if wrong
        await fb.saveDailyCompletion(0); // Reset streak on wrong
      }
    } else {
      setShowResult('wrong');
      await fb.saveDailyCompletion(0);
    }

    setCompleted(true);
  };

  const handleShowInSolver = () => {
    onSolve(dailyQ.q);
  };

  // Time until next problem
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const hoursLeft = Math.floor((tomorrow.getTime() - now.getTime()) / 3600000);
  const minsLeft = Math.floor(((tomorrow.getTime() - now.getTime()) % 3600000) / 60000);

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4 animate-bounce">🔔</div>
          <p className="font-display" style={{ color: 'var(--text-muted)' }}>Loading daily challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Daily Problem */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display" style={{ color: 'var(--text-primary)' }}>🔔 Daily Challenge</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>🔥 {dailyStreak} day streak</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="p-3 rounded-xl mb-5 text-center" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ⏰ Next problem in <strong style={{ color: 'var(--accent)' }}>{hoursLeft}h {minsLeft}m</strong>
            </p>
          </div>

          {/* Problem card */}
          <div className="p-5 rounded-2xl border mb-5" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)', boxShadow: '0 0 30px var(--glow-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                background: dailyQ.difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : dailyQ.difficulty === 'Medium' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                color: dailyQ.difficulty === 'Easy' ? '#22c55e' : dailyQ.difficulty === 'Medium' ? '#eab308' : '#ef4444',
              }}>
                {dailyQ.difficulty}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dailyQ.topic}</span>
            </div>
            <p className="text-lg font-display" style={{ color: 'var(--text-primary)' }}>
              {dailyQ.q}
            </p>
          </div>

          {/* Reward info */}
          <div className="p-3 rounded-xl mb-5 flex items-center gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
            <span className="text-lg">💎</span>
            <p className="text-sm" style={{ color: '#eab308' }}>
              <strong>+75 XP</strong> bonus for completing the daily challenge!
            </p>
          </div>

          {/* Answer or completed */}
          {!completed ? (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                className="w-full px-5 py-4 rounded-2xl text-base font-body mb-3 focus:outline-none"
                style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)' }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="flex-1 py-3 rounded-xl font-display transition-all hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: isDark ? '#0a0a0a' : '#fff' }}
                >
                  Submit Answer ✓
                </button>
                <button
                  onClick={handleShowInSolver}
                  className="px-4 py-3 rounded-xl text-sm transition-all hover:scale-105"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                >
                  Solve in Solver →
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in-up">
              {showResult && (
                <div className="p-4 rounded-2xl mb-4 border" style={{
                  background: showResult === 'correct' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  borderColor: showResult === 'correct' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                }}>
                  <p className="text-lg font-display" style={{ color: showResult === 'correct' ? '#22c55e' : '#ef4444' }}>
                    {showResult === 'correct' ? '🎉 Correct! +75 XP earned!' : '❌ Not quite!'}
                  </p>
                </div>
              )}
              {!showResult && (
                <div className="p-4 rounded-2xl mb-4 border" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' }}>
                  <p className="text-lg font-display" style={{ color: '#22c55e' }}>✅ Already completed today!</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Come back tomorrow for a new challenge</p>
                </div>
              )}
              <button
                onClick={handleShowInSolver}
                className="w-full py-3 rounded-xl font-display transition-all hover:scale-[1.02]"
                style={{ background: 'var(--accent)', color: isDark ? '#0a0a0a' : '#fff' }}
              >
                View Full Solution in Solver →
              </button>
            </div>
          )}
        </div>

        {/* Right: Solution */}
        <div className={solution ? 'glass-card-glow p-6 sm:p-8' : 'glass-card p-6 sm:p-8'}>
          {!solution ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4 animate-float">🏆</div>
              <h3 className="text-lg font-display mb-2" style={{ color: 'var(--text-primary)' }}>Daily Challenge</h3>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Submit your answer to see the step-by-step solution and earn 75 bonus XP!
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-display mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                📝 Solution
              </h3>

              <div className="p-4 rounded-2xl mb-5 border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
                <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Answer</p>
                <p className="text-2xl font-display accent-text-gradient">{solution.result}</p>
              </div>

              <div className="space-y-3">
                {solution.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{
                      background: i === solution.steps.length - 1 ? 'var(--step-final-bg)' : 'var(--step-number-bg)',
                      color: i === solution.steps.length - 1 ? 'var(--step-final-text)' : 'var(--step-number-text)',
                    }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                      <div className="rounded-xl px-4 py-2.5 font-mono text-sm border whitespace-pre-wrap wrap-break-word" style={{ background: 'var(--bg-code)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                        {step.expression}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
