import type { CSSProperties } from 'react';

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

export function ArrowRightIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function CheckCircleIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function AlertIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function TrashIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function ClockIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Category Icons Map ───────────────────────────────────────────────
export const categoryIcons: Record<string, string> = {
  'Arithmetic': '➕', 'Algebra': '🔤', 'Percentage': '💯', 'Powers & Roots': '√',
  'Trigonometry': '📐', 'Calculus': '∫', 'Number Theory': '🔢', 'Statistics': '📊',
  'Logarithms': '📈', 'Geometry': '📏', 'Probability': '🎲', 'Simultaneous Eq.': '🔗',
  'Bearing': '🧭', 'Longitude & Latitude': '🌍', 'Sequences & Series': '🔢',
  'Ratio & Proportion': '⚖️', 'Interest': '💰', 'Mensuration (3D)': '📦',
  'Sets & Venn': '⊕', 'Matrices': '▦', 'Integration': '∫',
  'Differentiation (Advanced)': 'δ', 'Limits': 'lim', 'Complex Numbers': 'ℂ',
  'Differential Equations': 'dy', 'Vectors': '→', 'Taylor Series': 'Σ',
  'Laplace Transform': 'ℒ', 'Linear Algebra': '⊞', 'Partial Fractions': '⅟',
  'Fraction Expression': '🔢', 'Number Base': '🔟', 'Variation': '📉',
  'Age Problem': '👴', 'Perfect Square': '⬛',
  'Algebraic Simplification': '🧮', 'Percentage Error': '❌', 'Roman Numerals': '🏛️',
  'Work Rate': '👷', 'Profit & Loss': '💸', 'Consecutive Numbers': '🔗',
  'Angle Problem': '📐', 'Area Coverage': '🧱', 'Probability (Sets)': '🎲',
  'Geometry (Quadrant)': '◔', 'Area (Frame)': '🖼️', 'Ratio (Circle)': '⭕',
  'Sequences': '🔢', 'Geometry (Rhombus/Kite)': '🪁', 'Geometry (Cube)': '🧊',
  'AP (Sum)': '➕', 'Algebra (Expansion)': '📝', 'Fraction Expressions': '🔢',
  'Competition Math': '🏆', 'Age Problems': '👴', 'Speed/Distance/Time': '✈️',
  'Statistics (Mean)': '📊', 'Statistics (Median)': '📊', 'Statistics (Mode)': '📊',
  'Statistics (Range)': '📊', 'Statistics (Std Dev)': '📊', 'Statistics (Quartiles)': '📊',
  'Statistics (Variance)': '📊', 'Statistics (Weighted Mean)': '📊',
  'Probability (Combination)': '🎲', 'Probability (Permutation)': '🎲',
  'Probability (Binomial)': '🎲', 'Probability (Expected Value)': '🎲',
  'Mensuration (Cylinder)': '📦', 'Mensuration (Sphere)': '📦',
  'Mensuration (Cone)': '📦', 'Mensuration (Cuboid)': '📦',
  'Matrices (Determinant)': '▦', 'Matrices (Inverse)': '▦',
  'Sets (Venn Diagram)': '⊕', 'Simple Interest': '💰', 'Compound Interest': '💰',
  'Linear Equation': '🔤', 'Quadratic Equation': '📐', 'System of Equations': '🔗',
  'Factorial': '❗', 'GCD': '🔢', 'LCM': '🔢', 'Prime Factorization': '🔢',
  'Square Root': '√', 'Cube Root': '√', 'Exponentiation': '√', 'Logarithm': '📈',
  'General Math': '🧮', 'Calculus (Derivative)': '∫', 'Sequences (Pattern)': '🔢',
};
