import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Solution } from '../utils/mathSolver';

interface ShareSolutionProps {
  solution: Solution;
}

export function ShareSolution({ solution }: ShareSolutionProps) {
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const copyText = () => {
    const text = [
      `Problem: ${solution.problem}`,
      `Answer: ${solution.result}`,
      `Category: ${solution.category}`,
      '',
      'Steps:',
      ...solution.steps.map((s, i) => `${i + 1}. ${s.description}\n   ${s.expression}`),
      '',
      '— Solved with MathSolver 🧮',
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Copied to clipboard!');
    });
    setShowMenu(false);
  };

  const shareNative = async () => {
    const text = `Problem: ${solution.problem}\nAnswer: ${solution.result}\n\nSolved with MathSolver 🧮`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'MathSolver Solution', text });
        showToast('✅ Shared!');
      } catch {
        copyText();
      }
    } else {
      copyText();
    }
    setShowMenu(false);
  };

  const bookmarkSolution = () => {
    const bookmarks = JSON.parse(localStorage.getItem('mathsolver_bookmarks') || '[]');
    bookmarks.unshift({
      problem: solution.problem,
      result: solution.result,
      category: solution.category,
      time: Date.now(),
    });
    localStorage.setItem('mathsolver_bookmarks', JSON.stringify(bookmarks.slice(0, 50)));
    showToast('🔖 Bookmarked!');
    setShowMenu(false);
  };

  const exportPDF = () => {
    const content = [
      '╔══════════════════════════════════════╗',
      '║       MathSolver - Solution          ║',
      '╚══════════════════════════════════════╝',
      '',
      `📌 Problem: ${solution.problem}`,
      `✅ Answer: ${solution.result}`,
      `📂 Category: ${solution.category}`,
      '',
      '━━━ Step-by-Step Solution ━━━',
      '',
      ...solution.steps.map((s, i) => `Step ${i + 1}: ${s.description}\n   → ${s.expression}\n`),
      '',
      `Date: ${new Date().toLocaleString()}`,
      'Solved with MathSolver 🧮',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathsolver_${solution.problem.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Downloaded!');
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
        style={{
          background: 'var(--accent-glow)',
          color: 'var(--accent)',
          border: '1px solid var(--border-accent)',
        }}
      >
        📤 Share
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl p-2 min-w-48 border animate-fade-in-up"
            style={{
              background: isDark ? 'rgba(20,20,20,0.98)' : 'rgba(255,255,255,0.98)',
              borderColor: 'var(--border-accent)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            {[
              { label: '📋 Copy Text', action: copyText },
              { label: '📤 Share', action: shareNative },
              { label: '🔖 Bookmark', action: bookmarkSolution },
              { label: '📄 Download', action: exportPDF },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-display text-sm animate-fade-in-up"
          style={{
            background: isDark ? 'rgba(163,230,53,0.95)' : 'rgba(220,38,38,0.95)',
            color: isDark ? '#0a0a0a' : '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
