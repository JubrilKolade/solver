import { useState } from 'react';
import { exampleProblems } from '../../utils/mathSolver';
import { ArrowRightIcon, categoryIcons } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ExamplesTabProps {
  onExampleClick: (problem: string) => void;
}

export function ExamplesTab({ onExampleClick }: ExamplesTabProps) {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display accent-text-gradient mb-1">Example Problems</h2>
        <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>Click any problem to solve it instantly</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-2 rounded-xl text-sm font-medium font-body transition-all"
          style={{
            background: !selectedCategory ? 'var(--accent)' : 'var(--bg-subtle)',
            color: !selectedCategory ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
            border: `1px solid ${!selectedCategory ? 'var(--accent)' : 'var(--border-color)'}`,
            boxShadow: !selectedCategory ? '0 4px 15px var(--accent-glow-strong)' : 'none',
          }}
        >
          All
        </button>
        {exampleProblems.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className="px-4 py-2 rounded-xl text-sm font-medium font-body transition-all"
            style={{
              background: selectedCategory === cat.category ? 'var(--accent)' : 'var(--bg-subtle)',
              color: selectedCategory === cat.category ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
              border: `1px solid ${selectedCategory === cat.category ? 'var(--accent)' : 'var(--border-color)'}`,
              boxShadow: selectedCategory === cat.category ? '0 4px 15px var(--accent-glow-strong)' : 'none',
            }}
          >
            {categoryIcons[cat.category] || '📝'} {cat.category}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exampleProblems
          .filter((cat) => !selectedCategory || cat.category === selectedCategory)
          .map((cat) => (
            <div key={cat.category} className="glass-card overflow-hidden">
              {/* Card Header */}
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-display text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-lg">{categoryIcons[cat.category] || '📝'}</span>
                  {cat.category}
                </h3>
              </div>
              {/* Problems */}
              <div className="p-3 space-y-2">
                {cat.problems.map((problem) => (
                  <button
                    key={problem}
                    onClick={() => onExampleClick(problem)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center justify-between border font-body"
                    style={{
                      background: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.background = 'var(--accent-glow)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <span className="font-mono text-sm">{problem}</span>
                    <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
