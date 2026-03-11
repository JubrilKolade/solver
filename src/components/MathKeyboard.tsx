import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface MathKeyboardProps {
  onInsert: (text: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const categories = [
  { id: 'nums', label: '123', emoji: '🔢' },
  { id: 'ops', label: 'Ops', emoji: '➕' },
  { id: 'powers', label: 'Pow', emoji: '⚡' },
  { id: 'frac', label: 'Frac', emoji: '½' },
  { id: 'trig', label: 'Trig', emoji: '📐' },
  { id: 'calc', label: 'Calc', emoji: '∫' },
  { id: 'greek', label: 'αβ', emoji: '🏛️' },
];

const keys: Record<string, { label: string; value: string }[]> = {
  nums: [
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' },
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
    { label: '0', value: '0' }, { label: '.', value: '.' }, { label: ',', value: ', ' },
  ],
  ops: [
    { label: '+', value: ' + ' }, { label: '−', value: ' - ' }, { label: '×', value: ' * ' },
    { label: '÷', value: ' / ' }, { label: '=', value: ' = ' }, { label: '(', value: '(' },
    { label: ')', value: ')' }, { label: '<', value: ' < ' }, { label: '>', value: ' > ' },
    { label: '≤', value: ' <= ' }, { label: '≥', value: ' >= ' }, { label: '≠', value: ' != ' },
  ],
  powers: [
    { label: 'x²', value: '^2' }, { label: 'x³', value: '^3' }, { label: 'xⁿ', value: '^' },
    { label: '√', value: 'sqrt(' }, { label: '³√', value: 'cbrt(' }, { label: 'ⁿ√', value: 'root(' },
    { label: '|x|', value: 'abs(' }, { label: 'n!', value: '!' }, { label: '%', value: '%' },
    { label: '10ˣ', value: '10^' }, { label: 'eˣ', value: 'e^' }, { label: '2ˣ', value: '2^' },
  ],
  frac: [
    { label: '½', value: '1/2' }, { label: '⅓', value: '1/3' }, { label: '⅔', value: '2/3' },
    { label: '¼', value: '1/4' }, { label: '¾', value: '3/4' }, { label: '⅕', value: '1/5' },
    { label: '⅙', value: '1/6' }, { label: '⅛', value: '1/8' }, { label: '/', value: '/' },
    { label: 'a/b', value: '/' }, { label: '⅜', value: '3/8' }, { label: '⅞', value: '7/8' },
  ],
  trig: [
    { label: 'sin', value: 'sin(' }, { label: 'cos', value: 'cos(' }, { label: 'tan', value: 'tan(' },
    { label: 'sin⁻¹', value: 'asin(' }, { label: 'cos⁻¹', value: 'acos(' }, { label: 'tan⁻¹', value: 'atan(' },
    { label: 'sec', value: 'sec(' }, { label: 'csc', value: 'csc(' }, { label: 'cot', value: 'cot(' },
    { label: 'log', value: 'log(' }, { label: 'ln', value: 'ln(' }, { label: 'log₂', value: 'log base 2 of ' },
  ],
  calc: [
    { label: '∫', value: 'integrate ' }, { label: 'd/dx', value: 'derivative of ' }, { label: 'lim', value: 'limit of ' },
    { label: 'Σ', value: 'sum ' }, { label: '∏', value: 'product ' }, { label: '∞', value: 'infinity' },
    { label: 'dx', value: ' dx' }, { label: 'dy', value: ' dy' }, { label: 'dt', value: ' dt' },
    { label: 'd²/dx²', value: 'second derivative of ' }, { label: '∂', value: 'partial derivative of ' }, { label: '→', value: ' approaches ' },
  ],
  greek: [
    { label: 'π', value: 'pi' }, { label: 'e', value: 'e' }, { label: 'i', value: 'i' },
    { label: 'α', value: 'alpha' }, { label: 'β', value: 'beta' }, { label: 'θ', value: 'theta' },
    { label: 'Δ', value: 'delta' }, { label: 'λ', value: 'lambda' }, { label: 'μ', value: 'mu' },
    { label: 'σ', value: 'sigma' }, { label: 'φ', value: 'phi' }, { label: 'ω', value: 'omega' },
  ],
};

export function MathKeyboard({ onInsert, onBackspace, onClear }: MathKeyboardProps) {
  const { isDark } = useTheme();
  const [activeCat, setActiveCat] = useState('nums');
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'var(--accent-glow)',
          color: 'var(--accent)',
          border: '1px solid var(--border-accent)',
        }}
      >
        <span>⌨️</span> Math Keyboard
      </button>
    );
  }

  return (
    <div
      className="rounded-2xl p-3 border animate-fade-in-up mt-3"
      style={{
        background: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)',
        borderColor: 'var(--border-accent)',
        backdropFilter: 'blur(20px)',
        boxShadow: `0 8px 32px ${isDark ? 'rgba(163,230,53,0.1)' : 'rgba(220,38,38,0.1)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-display" style={{ color: 'var(--text-primary)' }}>
          ⌨️ Math Keyboard
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm hover:scale-110 transition-transform"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
        >
          ✕
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: activeCat === cat.id ? 'var(--accent)' : 'var(--bg-subtle)',
              color: activeCat === cat.id ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Keys grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {keys[activeCat]?.map((key, i) => (
          <button
            key={i}
            onClick={() => onInsert(key.value)}
            className="py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-glow)';
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            {key.label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={() => onInsert(' ')}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
        >
          Space
        </button>
        <button
          onClick={onBackspace}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          ⌫ Back
        </button>
        <button
          onClick={onClear}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          ✕ Clear
        </button>
      </div>
    </div>
  );
}
