import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { solveProblem, type Solution } from '../../utils/mathSolver';
import * as fb from '../../services/firebaseService';

interface PracticeModeProps {
  onXPGain: (xp: number) => void;
  onProblemSolved: (topic: string, correct: boolean) => void;
}

interface QuizQuestion {
  question: string;
  topic: string;
  difficulty: string;
  hint: string;
}

const topics = [
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

function generateProblem(topic: string, difficulty: string): QuizQuestion {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (topic) {
    case 'arithmetic': {
      if (difficulty === 'easy') {
        const a = rand(1, 20), b = rand(1, 20);
        const ops = ['+', '-', '*'];
        const op = ops[rand(0, 2)];
        return { question: `${a} ${op} ${b}`, topic, difficulty, hint: `Use basic ${op === '+' ? 'addition' : op === '-' ? 'subtraction' : 'multiplication'}` };
      } else if (difficulty === 'medium') {
        const a = rand(10, 100), b = rand(10, 100), c = rand(1, 20);
        return { question: `${a} + ${b} * ${c}`, topic, difficulty, hint: 'Remember BODMAS — multiplication before addition' };
      } else {
        const a = rand(100, 999), b = rand(10, 99), c = rand(2, 9);
        return { question: `(${a} - ${b}) * ${c}`, topic, difficulty, hint: 'Solve the brackets first, then multiply' };
      }
    }
    case 'algebra': {
      if (difficulty === 'easy') {
        const x = rand(1, 10), a = rand(1, 5), b = a * x + rand(-10, 10);
        return { question: `${a}x + ${b - a * x} = ${b}`, topic, difficulty, hint: 'Isolate x by moving constants to the right' };
      } else if (difficulty === 'medium') {
        const x = rand(-5, 10), a = rand(2, 6), b = rand(1, 5);
        const c = a * x + b;
        return { question: `${a}x + ${b} = ${c}`, topic, difficulty, hint: `Subtract ${b} from both sides, then divide` };
      } else {
        const x = rand(1, 8), a = rand(2, 5), b = rand(1, 10), c = rand(1, 3), d = a * x + b - c * x;
        return { question: `${a}x + ${b} = ${c}x + ${d}`, topic, difficulty, hint: 'Collect x terms on one side, constants on the other' };
      }
    }
    case 'quadratic': {
      const r1 = rand(-5, 5), r2 = rand(-5, 5);
      const b = -(r1 + r2), c = r1 * r2;
      return {
        question: `x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`,
        topic, difficulty: difficulty,
        hint: `Try factoring or use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a`,
      };
    }
    case 'geometry': {
      if (difficulty === 'easy') {
        const r = rand(3, 15);
        return { question: `What is the area of a circle with radius ${r}?`, topic, difficulty, hint: 'Area = πr²' };
      } else if (difficulty === 'medium') {
        const a = rand(3, 12), b = rand(3, 12), c = rand(3, 12);
        const s = (a + b + c) / 2;
        if (a + b > c && a + c > b && b + c > a) {
          return { question: `Find the area of a triangle with sides ${a}, ${b}, and ${c} using Heron's formula`, topic, difficulty, hint: `s = (a+b+c)/2 = ${s}, Area = √(s(s-a)(s-b)(s-c))` };
        }
        return { question: `perimeter of quadrant with radius ${rand(7, 21)}`, topic, difficulty, hint: 'Perimeter = 2r + (πr/2)' };
      } else {
        const r = rand(5, 15), angle = rand(30, 180);
        return { question: `Find the area of a sector with radius ${r} and angle ${angle} degrees`, topic, difficulty, hint: 'Sector area = (θ/360) × πr²' };
      }
    }
    case 'trigonometry': {
      const angles = [30, 45, 60, 90, 120, 135, 150];
      const funcs = ['sin', 'cos', 'tan'];
      const angle = angles[rand(0, difficulty === 'easy' ? 2 : angles.length - 1)];
      const func = funcs[rand(0, difficulty === 'easy' ? 1 : 2)];
      return { question: `${func}(${angle} degrees)`, topic, difficulty, hint: `Use the exact values table for ${func}(${angle}°)` };
    }
    case 'calculus': {
      if (difficulty === 'easy') {
        const n = rand(2, 5), a = rand(1, 5);
        return { question: `derivative of ${a}x^${n}`, topic, difficulty, hint: `Power rule: d/dx[ax^n] = anx^(n-1)` };
      } else if (difficulty === 'medium') {
        const a = rand(1, 5), b = rand(1, 5), m = rand(2, 4), n = rand(1, 3);
        return { question: `derivative of ${a}x^${m} + ${b}x^${n}`, topic, difficulty, hint: 'Differentiate each term separately using the power rule' };
      } else {
        const n = rand(2, 4);
        return { question: `integrate x^${n}`, topic, difficulty, hint: `Power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C` };
      }
    }
    case 'probability': {
      if (difficulty === 'easy') {
        const total = rand(6, 20), fav = rand(1, total - 1);
        return { question: `A bag has ${total} balls, ${fav} are red. What is the probability of picking a red ball?`, topic, difficulty, hint: `P = favorable/total = ${fav}/${total}` };
      } else {
        const n = rand(5, 10), r = rand(2, Math.min(4, n));
        return { question: `combination ${n}, ${r}`, topic, difficulty, hint: 'C(n,r) = n! / (r!(n-r)!)' };
      }
    }
    case 'statistics': {
      const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9;
      const nums = Array.from({ length: count }, () => rand(1, 50));
      const types = ['mean', 'median', 'mode', 'range'];
      const type = types[rand(0, difficulty === 'easy' ? 1 : 3)];
      return { question: `${type} of ${nums.join(', ')}`, topic, difficulty, hint: type === 'mean' ? 'Add all numbers and divide by count' : type === 'median' ? 'Sort numbers and find the middle' : type === 'mode' ? 'Find the most frequent number' : 'Subtract smallest from largest' };
    }
    case 'sequences': {
      if (difficulty === 'easy') {
        const a = rand(1, 10), d = rand(1, 5), n = rand(5, 10);
        return { question: `arithmetic progression a=${a}, d=${d}, n=${n}`, topic, difficulty, hint: `nth term = a + (n-1)d` };
      } else {
        const a = rand(1, 5), r = rand(2, 3), n = rand(4, 7);
        return { question: `geometric progression a=${a}, r=${r}, n=${n}`, topic, difficulty, hint: `nth term = a × r^(n-1), Sum = a(r^n - 1)/(r - 1)` };
      }
    }
    case 'percentage': {
      const base = rand(50, 500), pct = rand(5, 50);
      return { question: `what is ${pct}% of ${base}`, topic, difficulty, hint: `Multiply ${base} by ${pct}/100` };
    }
    default: {
      return { question: `${rand(10, 99)} + ${rand(10, 99)}`, topic: 'arithmetic', difficulty, hint: 'Simple addition' };
    }
  }
}

export function PracticeMode({ onXPGain, onProblemSolved }: PracticeModeProps) {
  const { isDark } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [currentQ, setCurrentQ] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [showSolution, setShowSolution] = useState<Solution | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerMode, setTimerMode] = useState<number>(0); // 0=off, 30, 60, 120

  const nextQuestion = useCallback(() => {
    if (!selectedTopic) return;
    const q = generateProblem(selectedTopic, difficulty);
    setCurrentQ(q);
    setUserAnswer('');
    setShowResult(null);
    setShowSolution(null);
    setShowHint(false);
    if (timerMode > 0) setTimeLeft(timerMode);
  }, [selectedTopic, difficulty, timerMode]);

  useEffect(() => {
    if (selectedTopic && !currentQ) nextQuestion();
  }, [selectedTopic, currentQ, nextQuestion]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && showResult === null) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmit = (timedOut = false) => {
    if (!currentQ) return;
    const sol = solveProblem(currentQ.question);
    setShowSolution(sol);
    setTimeLeft(null);

    if (!timedOut && sol.success) {
      const correctAnswer = sol.result.toLowerCase().replace(/\s+/g, '');
      const userAns = userAnswer.trim().toLowerCase().replace(/\s+/g, '');

      // Check if user answer matches (flexible matching)
      const numCorrect = parseFloat(correctAnswer);
      const numUser = parseFloat(userAns);
      const isCorrect = correctAnswer === userAns ||
        (!isNaN(numCorrect) && !isNaN(numUser) && Math.abs(numCorrect - numUser) < 0.01) ||
        correctAnswer.includes(userAns) ||
        (userAns.length > 2 && correctAnswer.includes(userAns));

      if (isCorrect) {
        setShowResult('correct');
        const xp = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
        onXPGain(xp);
        onProblemSolved(currentQ.topic, true);
        setScore(s => ({ correct: s.correct + 1, total: s.total + 1, streak: s.streak + 1 }));
        // Save to Firebase
        fb.updateWeeklyActivity();
      } else {
        setShowResult('wrong');
        onProblemSolved(currentQ.topic, false);
        setScore(s => ({ ...s, total: s.total + 1, streak: 0 }));
      }
    } else {
      setShowResult('wrong');
      if (currentQ) onProblemSolved(currentQ.topic, false);
      setScore(s => ({ ...s, total: s.total + 1, streak: 0 }));
    }
  };

  // Topic selection screen
  if (!selectedTopic) {
    return (
      <div className="animate-fade-in-up">
        <div className="glass-card p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>📝 Practice Mode</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Choose a topic and difficulty to start practicing!</p>

          {/* Difficulty */}
          <div className="mb-6">
            <p className="text-sm font-display mb-3" style={{ color: 'var(--text-primary)' }}>Difficulty</p>
            <div className="flex gap-2">
              {[
                { id: 'easy', label: '🟢 Easy', xp: '+10 XP' },
                { id: 'medium', label: '🟡 Medium', xp: '+25 XP' },
                { id: 'hard', label: '🔴 Hard', xp: '+50 XP' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: difficulty === d.id ? 'var(--accent)' : 'var(--bg-subtle)',
                    color: difficulty === d.id ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
                    border: `1px solid ${difficulty === d.id ? 'var(--accent)' : 'var(--border-color)'}`,
                  }}
                >
                  <div>{d.label}</div>
                  <div className="text-xs opacity-70">{d.xp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6">
            <p className="text-sm font-display mb-3" style={{ color: 'var(--text-primary)' }}>⏱️ Timer</p>
            <div className="flex gap-2">
              {[
                { val: 0, label: 'Off' },
                { val: 30, label: '30s' },
                { val: 60, label: '60s' },
                { val: 120, label: '2min' },
              ].map((t) => (
                <button
                  key={t.val}
                  onClick={() => setTimerMode(t.val)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: timerMode === t.val ? 'var(--accent-glow)' : 'var(--bg-subtle)',
                    color: timerMode === t.val ? 'var(--accent)' : 'var(--text-muted)',
                    border: `1px solid ${timerMode === t.val ? 'var(--border-accent)' : 'var(--border-color)'}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics grid */}
          <p className="text-sm font-display mb-3" style={{ color: 'var(--text-primary)' }}>Choose a Topic</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className="glass-card p-4 rounded-2xl text-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ border: '1px solid var(--border-color)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 20px var(--glow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="text-3xl mb-2">{t.emoji}</div>
                <div className="text-sm font-display" style={{ color: 'var(--text-primary)' }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  const topicInfo = topics.find(t => t.id === selectedTopic);
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Question */}
        <div className="glass-card p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{topicInfo?.emoji}</span>
              <span className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>{topicInfo?.label}</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{
                background: difficulty === 'easy' ? 'rgba(34,197,94,0.15)' : difficulty === 'medium' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                color: difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#eab308' : '#ef4444',
              }}>
                {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'} {difficulty}
              </span>
            </div>
            <button
              onClick={() => { setSelectedTopic(null); setCurrentQ(null); setScore({ correct: 0, total: 0, streak: 0 }); }}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
            >
              ← Back
            </button>
          </div>

          {/* Timer bar */}
          {timeLeft !== null && timerMode > 0 && (
            <div className="mb-4">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(timeLeft / timerMode) * 100}%`,
                    background: timeLeft > timerMode * 0.5 ? '#22c55e' : timeLeft > timerMode * 0.25 ? '#eab308' : '#ef4444',
                  }}
                />
              </div>
              <p className="text-xs text-right mt-1" style={{ color: timeLeft < 10 ? '#ef4444' : 'var(--text-muted)' }}>
                {timeLeft}s remaining
              </p>
            </div>
          )}

          {/* Score bar */}
          <div className="flex gap-4 mb-5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>✅ {score.correct}/{score.total}</span>
            <span>📊 {pct}%</span>
            <span>🔥 Streak: {score.streak}</span>
          </div>

          {/* Question */}
          {currentQ && (
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Question</p>
              <div
                className="p-5 rounded-2xl border text-lg font-display"
                style={{
                  background: 'var(--bg-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {currentQ.question}
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && currentQ && (
            <div className="mb-4 p-3 rounded-xl animate-fade-in-up" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
              <p className="text-sm" style={{ color: '#eab308' }}>💡 <strong>Hint:</strong> {currentQ.hint}</p>
            </div>
          )}

          {/* Answer input */}
          {showResult === null && (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                className="w-full px-5 py-4 rounded-2xl text-base font-body mb-3 focus:outline-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit()}
                  disabled={!userAnswer.trim()}
                  className="flex-1 py-3 rounded-xl font-display text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
                  style={{
                    background: userAnswer.trim() ? 'var(--accent)' : 'var(--text-faint)',
                    color: userAnswer.trim() ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
                  }}
                >
                  Submit ✓
                </button>
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-3 rounded-xl text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}
                >
                  💡 Hint
                </button>
                <button
                  onClick={nextQuestion}
                  className="px-4 py-3 rounded-xl text-sm transition-all hover:scale-105"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                >
                  Skip →
                </button>
              </div>
            </>
          )}

          {/* Result feedback */}
          {showResult && (
            <div className="animate-fade-in-up">
              <div
                className="p-4 rounded-2xl mb-4 border"
                style={{
                  background: showResult === 'correct' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  borderColor: showResult === 'correct' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                }}
              >
                <p className="text-lg font-display" style={{ color: showResult === 'correct' ? '#22c55e' : '#ef4444' }}>
                  {showResult === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
                </p>
                {showResult === 'correct' && (
                  <p className="text-sm mt-1" style={{ color: '#22c55e' }}>
                    +{difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50} XP earned!
                  </p>
                )}
                {showResult === 'wrong' && showSolution && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Correct answer: <strong style={{ color: 'var(--accent)' }}>{showSolution.result}</strong>
                  </p>
                )}
              </div>
              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl font-display text-base transition-all hover:scale-[1.02]"
                style={{ background: 'var(--accent)', color: isDark ? '#0a0a0a' : '#fff' }}
              >
                Next Question →
              </button>
            </div>
          )}
        </div>

        {/* Right: Solution */}
        <div className={showSolution ? 'glass-card-glow p-6 sm:p-8' : 'glass-card p-6 sm:p-8'}>
          {!showSolution ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4 animate-float">🧠</div>
              <h3 className="text-lg font-display mb-2" style={{ color: 'var(--text-primary)' }}>Try solving it!</h3>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Submit your answer to see the detailed step-by-step solution
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-display mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                📝 Step-by-Step Solution
              </h3>

              {/* Answer */}
              <div className="p-4 rounded-2xl mb-5 border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
                <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Answer</p>
                <p className="text-2xl font-display accent-text-gradient">{showSolution.result}</p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {showSolution.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: i === showSolution.steps.length - 1 ? 'var(--step-final-bg)' : 'var(--step-number-bg)',
                        color: i === showSolution.steps.length - 1 ? 'var(--step-final-text)' : 'var(--step-number-text)',
                      }}
                    >
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
