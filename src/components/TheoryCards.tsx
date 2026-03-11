import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface TheoryCardsProps {
  onTryExample: (problem: string) => void;
}

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  category: string;
  formulas: string[];
  tips: string[];
  example: { question: string; answer: string };
}

const lessons: Lesson[] = [
  {
    id: 'algebra', title: 'Algebra Basics', emoji: '🔤', category: 'Algebra',
    formulas: ['ax + b = c → x = (c - b) / a', 'a(x + b) = ax + ab (Distributive)', '(a + b)² = a² + 2ab + b²', '(a - b)² = a² - 2ab + b²', '(a + b)(a - b) = a² - b²'],
    tips: ['Always collect like terms first', 'Whatever you do to one side, do to the other', 'Check your answer by substituting back'],
    example: { question: '3x + 7 = 22', answer: 'x = 5' },
  },
  {
    id: 'quadratic', title: 'Quadratic Equations', emoji: '📈', category: 'Quadratic',
    formulas: ['ax² + bx + c = 0', 'x = (-b ± √(b²-4ac)) / 2a', 'Discriminant Δ = b² - 4ac', 'Δ > 0: two real roots', 'Δ = 0: one repeated root', 'Δ < 0: complex roots', 'Sum of roots = -b/a', 'Product of roots = c/a'],
    tips: ['Try factoring first before using the formula', 'If Δ < 0, the roots are complex numbers', 'Completing the square is another method'],
    example: { question: 'x^2 - 5x + 6 = 0', answer: 'x = 2 or x = 3' },
  },
  {
    id: 'simultaneous', title: 'Simultaneous Equations', emoji: '🔗', category: 'Algebra',
    formulas: ['Elimination: Add/subtract equations to eliminate a variable', 'Substitution: Express one variable in terms of the other', "Cramer's Rule: x = Dx/D, y = Dy/D"],
    tips: ['Make coefficients of one variable equal before adding/subtracting', 'Check your answer in BOTH original equations', 'If determinant = 0, no unique solution exists'],
    example: { question: '2x + y = 7 and x - 3y = 0', answer: 'x = 3, y = 1' },
  },
  {
    id: 'trigonometry', title: 'Trigonometry', emoji: '📐', category: 'Trigonometry',
    formulas: ['sin θ = Opposite / Hypotenuse', 'cos θ = Adjacent / Hypotenuse', 'tan θ = Opposite / Adjacent', 'sin²θ + cos²θ = 1', 'sin 30° = ½, cos 30° = √3/2', 'sin 45° = √2/2, cos 45° = √2/2', 'sin 60° = √3/2, cos 60° = ½'],
    tips: ['Remember SOHCAHTOA', 'Angles in a triangle sum to 180°', 'Use sine rule for non-right triangles: a/sinA = b/sinB'],
    example: { question: 'sin(30 degrees)', answer: '0.5' },
  },
  {
    id: 'circle', title: 'Circle Theorems', emoji: '⭕', category: 'Geometry',
    formulas: ['Area = πr²', 'Circumference = 2πr', 'Sector area = (θ/360) × πr²', 'Arc length = (θ/360) × 2πr', 'Angle at center = 2 × angle at circumference', 'Angles in semicircle = 90°', 'Tangent perpendicular to radius'],
    tips: ['Always identify the center, radius, and angle', 'Inscribed angle is half the central angle', 'Tangent from external point are equal in length'],
    example: { question: 'What is the area of a circle with radius 7? Use pi = 22/7', answer: '154 cm²' },
  },
  {
    id: 'differentiation', title: 'Differentiation', emoji: '📉', category: 'Calculus',
    formulas: ['d/dx [xⁿ] = nxⁿ⁻¹ (Power Rule)', 'd/dx [sin x] = cos x', 'd/dx [cos x] = -sin x', 'd/dx [eˣ] = eˣ', 'd/dx [ln x] = 1/x', 'Product Rule: (fg)\' = f\'g + fg\'', 'Chain Rule: d/dx [f(g(x))] = f\'(g(x)) × g\'(x)'],
    tips: ['Bring the power down, reduce by 1', 'Constants differentiate to 0', 'Use chain rule for composite functions'],
    example: { question: 'derivative of 3x^4 + 2x^2 - x', answer: '12x³ + 4x - 1' },
  },
  {
    id: 'integration', title: 'Integration', emoji: '∫', category: 'Calculus',
    formulas: ['∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)', '∫sin x dx = -cos x + C', '∫cos x dx = sin x + C', '∫eˣ dx = eˣ + C', '∫1/x dx = ln|x| + C', 'Definite: ∫ₐᵇ f(x)dx = F(b) - F(a)'],
    tips: ['Integration is the reverse of differentiation', 'Always add the constant C for indefinite integrals', 'For definite integrals, evaluate at upper minus lower limit'],
    example: { question: 'integrate x^3', answer: 'x⁴/4 + C' },
  },
  {
    id: 'probability', title: 'Probability', emoji: '🎲', category: 'Probability',
    formulas: ['P(A) = favorable / total', 'P(A or B) = P(A) + P(B) - P(A and B)', 'P(A and B) = P(A) × P(B) (independent)', "P(A') = 1 - P(A)", 'nCr = n! / (r!(n-r)!)', 'nPr = n! / (n-r)!', 'P(X=k) = nCk × p^k × (1-p)^(n-k)'],
    tips: ['P(at least one) = 1 - P(none)', 'Tree diagrams help visualize compound events', 'Combinations when order doesn\'t matter, permutations when it does'],
    example: { question: 'combination 10, 3', answer: '120' },
  },
  {
    id: 'statistics', title: 'Statistics', emoji: '📊', category: 'Statistics',
    formulas: ['Mean = Σx / n', 'Median = middle value (sorted)', 'Mode = most frequent value', 'Range = max - min', 'Variance = Σ(x - x̄)² / n', 'Std Dev = √Variance', 'IQR = Q3 - Q1'],
    tips: ['Always sort data before finding median', 'For even count of data, median = average of two middle values', 'Standard deviation measures spread from the mean'],
    example: { question: 'mean of 4, 8, 15, 16, 23, 42', answer: '18' },
  },
  {
    id: 'sequences', title: 'Sequences & Series', emoji: '🔢', category: 'Sequences',
    formulas: ['AP: aₙ = a + (n-1)d', 'AP Sum: Sₙ = n/2 × (2a + (n-1)d)', 'GP: aₙ = a × rⁿ⁻¹', 'GP Sum: Sₙ = a(rⁿ - 1)/(r - 1)', 'GP Sum to ∞: S∞ = a/(1-r) when |r|<1'],
    tips: ['Common difference d = a₂ - a₁ (AP)', 'Common ratio r = a₂/a₁ (GP)', 'Sum to infinity only works when |r| < 1'],
    example: { question: 'arithmetic progression a=3, d=5, n=10', answer: '10th term = 48, Sum = 255' },
  },
  {
    id: 'bearing', title: 'Bearing & Navigation', emoji: '🧭', category: 'Bearing',
    formulas: ['Bearings measured clockwise from North (000° to 360°)', 'Back bearing = bearing ± 180°', 'If bearing < 180°, add 180°', 'If bearing ≥ 180°, subtract 180°'],
    tips: ['Always write bearings as 3 digits: 045°, not 45°', 'Draw a diagram with North arrows', 'Use trigonometry for distance calculations'],
    example: { question: 'back bearing of 045', answer: '225°' },
  },
  {
    id: 'numberbases', title: 'Number Bases', emoji: '🔟', category: 'Number Bases',
    formulas: ['Base n to Base 10: multiply each digit by nᵖᵒˢⁱᵗⁱᵒⁿ', 'Base 10 to Base n: repeatedly divide by n', 'Binary (base 2): 0, 1', 'Octal (base 8): 0-7', 'Hex (base 16): 0-9, A-F'],
    tips: ['Position starts from 0 on the right', '47₈ = 4×8¹ + 7×8⁰ = 32+7 = 39₁₀', 'Always specify the base of your answer'],
    example: { question: 'convert 47 base 8 to base 10', answer: '39' },
  },
];

export function TheoryCards({ onTryExample }: TheoryCardsProps) {
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="glass-card p-6 sm:p-8 mb-6">
        <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>📖 Theory & Lessons</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Learn the concepts before solving problems</p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search lessons..."
          className="w-full px-4 py-3 rounded-xl text-sm font-body focus:outline-none mb-4"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lesson) => {
          const isExpanded = expandedId === lesson.id;

          return (
            <div
              key={lesson.id}
              className="glass-card overflow-hidden transition-all"
              style={{
                border: isExpanded ? '1px solid var(--border-accent)' : '1px solid var(--glass-border)',
                boxShadow: isExpanded ? '0 0 30px var(--glow-color)' : 'var(--glass-shadow)',
              }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : lesson.id)}
                className="w-full p-5 text-left flex items-center gap-3 transition-all hover:opacity-80"
              >
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-base" style={{ color: 'var(--text-primary)' }}>{lesson.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{lesson.category}</p>
                </div>
                <span className="text-lg transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)' }}>
                  ▼
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 animate-fade-in-up">
                  {/* Formulas */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>📌 Key Formulas</p>
                    <div className="space-y-1.5">
                      {lesson.formulas.map((f, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg font-mono text-sm" style={{ background: 'var(--bg-code)', color: 'var(--text-secondary)' }}>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#eab308' }}>💡 Tips</p>
                    <ul className="space-y-1">
                      {lesson.tips.map((t, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                          <span>•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example */}
                  <div className="p-4 rounded-xl border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>📝 Example</p>
                    <p className="text-sm font-mono mb-1" style={{ color: 'var(--text-primary)' }}>{lesson.example.question}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Answer: <strong style={{ color: 'var(--accent)' }}>{lesson.example.answer}</strong></p>
                    <button
                      onClick={() => onTryExample(lesson.example.question)}
                      className="mt-2 px-4 py-1.5 rounded-lg text-xs font-display transition-all hover:scale-105"
                      style={{
                        background: isDark ? 'var(--accent)' : 'var(--accent)',
                        color: isDark ? '#0a0a0a' : '#fff',
                      }}
                    >
                      Try this! →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
