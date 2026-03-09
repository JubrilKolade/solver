import * as math from 'mathjs';
import { type Solution, type SolutionStep } from './mathSolver';

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(8)).toString();
}

function fmtDec(n: number, dp: number = 4): string {
  return parseFloat(n.toFixed(dp)).toString();
}

// ═══════════════════════════════════════════════════════════════
// ENHANCED DIFFERENTIATION (College-Level)
// ═══════════════════════════════════════════════════════════════

export function solveCollegeDerivative(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── HIGHER ORDER DERIVATIVES ──
  let m = lower.match(/(?:second|2nd)\s*derivative\s*(?:of\s*)?(.+)/);
  if (m) {
    const expr = m[1].trim();
    try {
      const node = math.parse(expr);
      const first = math.derivative(node, 'x');
      const second = math.derivative(first, 'x');
      const firstSimp = math.simplify(first);
      const secondSimp = math.simplify(second);
      return {
        problem: input, category: 'Calculus (2nd Derivative)', result: secondSimp.toString(),
        steps: [
          { description: 'Original function', expression: `f(x) = ${expr}` },
          { description: 'Find the first derivative', expression: `f'(x) = d/dx[${expr}]` },
          { description: 'First derivative result', expression: `f'(x) = ${firstSimp.toString()}` },
          { description: 'Differentiate again for second derivative', expression: `f''(x) = d/dx[${firstSimp.toString()}]` },
          { description: 'Second derivative result', expression: `f''(x) = ${secondSimp.toString()}` },
        ],
        success: true,
      };
    } catch { return null; }
  }

  m = lower.match(/(?:third|3rd)\s*derivative\s*(?:of\s*)?(.+)/);
  if (m) {
    const expr = m[1].trim();
    try {
      const node = math.parse(expr);
      const d1 = math.simplify(math.derivative(node, 'x'));
      const d2 = math.simplify(math.derivative(d1, 'x'));
      const d3 = math.simplify(math.derivative(d2, 'x'));
      return {
        problem: input, category: 'Calculus (3rd Derivative)', result: d3.toString(),
        steps: [
          { description: 'Original function', expression: `f(x) = ${expr}` },
          { description: "f'(x)", expression: d1.toString() },
          { description: "f''(x)", expression: d2.toString() },
          { description: "f'''(x)", expression: d3.toString() },
        ],
        success: true,
      };
    } catch { return null; }
  }

  // ── PARTIAL DERIVATIVES ──
  m = lower.match(/partial\s*derivative\s*(?:of\s*)?(.+?)\s*(?:with\s*respect\s*to|wrt|w\.r\.t\.?)\s*([a-z])/);
  if (m) {
    const expr = m[1].trim();
    const variable = m[2];
    try {
      const node = math.parse(expr);
      const pd = math.derivative(node, variable);
      const simplified = math.simplify(pd);
      return {
        problem: input, category: 'Calculus (Partial Derivative)', result: simplified.toString(),
        steps: [
          { description: 'Function', expression: `f = ${expr}` },
          { description: `Differentiate with respect to ${variable}`, expression: `∂f/∂${variable} = ∂/∂${variable}[${expr}]` },
          { description: `Treat all other variables as constants`, expression: `Differentiating only ${variable} terms` },
          { description: 'Result', expression: `∂f/∂${variable} = ${simplified.toString()}` },
        ],
        success: true,
      };
    } catch { return null; }
  }

  // ── EVALUATE DERIVATIVE AT A POINT ──
  m = lower.match(/(?:derivative|differentiate|d\/dx)\s*(?:of\s*)?(.+?)\s*(?:at|when|for)\s*x\s*=\s*([-\d.]+)/);
  if (m) {
    const expr = m[1].trim();
    const xVal = parseFloat(m[2]);
    try {
      const node = math.parse(expr);
      const deriv = math.derivative(node, 'x');
      const simplified = math.simplify(deriv);
      const value = simplified.evaluate({ x: xVal }) as number;
      return {
        problem: input, category: 'Calculus (Derivative at Point)', result: fmt(value),
        steps: [
          { description: 'Function', expression: `f(x) = ${expr}` },
          { description: 'Find the derivative', expression: `f'(x) = ${simplified.toString()}` },
          { description: `Evaluate at x = ${xVal}`, expression: `f'(${xVal}) = ${fmt(value)}` },
          { description: 'Interpretation', expression: `The slope of the tangent line at x = ${xVal} is ${fmt(value)}` },
        ],
        success: true,
      };
    } catch { return null; }
  }

  // ── IMPLICIT DIFFERENTIATION (simple: x^2 + y^2 = r^2 style) ──
  m = lower.match(/implicit\s*(?:differentiation|derivative)\s*(?:of\s*)?(.+)/);
  if (m) {
    const eqStr = m[1].trim();
    const parts = eqStr.split('=');
    if (parts.length === 2) {
      const steps: SolutionStep[] = [
        { description: 'Given equation', expression: eqStr },
        { description: 'Differentiate both sides with respect to x', expression: `d/dx[${parts[0].trim()}] = d/dx[${parts[1].trim()}]` },
        { description: 'Apply the chain rule to y terms', expression: `For y terms: d/dx[f(y)] = f'(y) · dy/dx` },
      ];

      // Try symbolic approach for common forms
      const lhs = parts[0].trim().toLowerCase();
      const rhs = parts[1].trim();

      // x^2 + y^2 = c (circle)
      if (lhs.match(/x\s*\^\s*2.*y\s*\^\s*2/) || lhs.match(/x\s*².*y\s*²/)) {
        steps.push({ description: 'Differentiate x² + y² = c', expression: `2x + 2y(dy/dx) = 0` });
        steps.push({ description: 'Solve for dy/dx', expression: `2y(dy/dx) = -2x` });
        steps.push({ description: 'Result', expression: `dy/dx = -x/y` });
        return { problem: input, category: 'Calculus (Implicit Differentiation)', result: 'dy/dx = -x/y', steps, success: true };
      }

      // x^n + y^n type
      if (lhs.includes('x') && lhs.includes('y')) {
        steps.push({ description: 'General approach', expression: `Differentiate each term, applying chain rule to y terms` });
        steps.push({ description: 'Collect dy/dx terms on one side', expression: `Move all dy/dx terms to the left` });
        steps.push({ description: 'Factor out dy/dx and solve', expression: `dy/dx = -(∂F/∂x) / (∂F/∂y)` });

        try {
          const F = math.parse(`(${parts[0]}) - (${rhs})`);
          const dFdx = math.simplify(math.derivative(F, 'x'));
          const dFdy = math.simplify(math.derivative(F, 'y'));
          steps.push({ description: '∂F/∂x', expression: dFdx.toString() });
          steps.push({ description: '∂F/∂y', expression: dFdy.toString() });
          steps.push({ description: 'dy/dx = -(∂F/∂x) / (∂F/∂y)', expression: `dy/dx = -(${dFdx.toString()}) / (${dFdy.toString()})` });
          const result = math.simplify(math.parse(`-(${dFdx.toString()}) / (${dFdy.toString()})`));
          steps.push({ description: 'Simplified', expression: `dy/dx = ${result.toString()}` });
          return { problem: input, category: 'Calculus (Implicit Differentiation)', result: `dy/dx = ${result.toString()}`, steps, success: true };
        } catch {
          steps.push({ description: 'Apply the formula', expression: `dy/dx = -(∂F/∂x) / (∂F/∂y) where F(x,y) = ${parts[0].trim()} - ${rhs}` });
          return { problem: input, category: 'Calculus (Implicit Differentiation)', result: 'See steps above', steps, success: true };
        }
      }
    }
  }

  // ── CRITICAL POINTS / MAXIMA & MINIMA ──
  m = lower.match(/(?:critical\s*points?|maxim(?:a|um)|minim(?:a|um)|extrema|turning\s*points?)\s*(?:of\s*)?(.+)/);
  if (m) {
    const expr = m[1].trim();
    try {
      const node = math.parse(expr);
      const deriv = math.simplify(math.derivative(node, 'x'));
      const deriv2 = math.simplify(math.derivative(deriv, 'x'));
      const steps: SolutionStep[] = [
        { description: 'Function', expression: `f(x) = ${expr}` },
        { description: 'Find f\'(x)', expression: `f'(x) = ${deriv.toString()}` },
        { description: 'Set f\'(x) = 0 and solve', expression: `${deriv.toString()} = 0` },
        { description: 'Second derivative for classification', expression: `f''(x) = ${deriv2.toString()}` },
      ];

      // Try to find critical points numerically
      const criticalPoints: number[] = [];
      for (let x = -20; x <= 20; x += 0.1) {
        try {
          const v1 = deriv.evaluate({ x }) as number;
          const v2 = deriv.evaluate({ x: x + 0.1 }) as number;
          if (v1 * v2 <= 0 && Math.abs(v1) < 100) {
            // Bisection to refine
            let a = x, b = x + 0.1;
            for (let k = 0; k < 50; k++) {
              const mid = (a + b) / 2;
              const fm = deriv.evaluate({ x: mid }) as number;
              if (Math.abs(fm) < 1e-10) { a = mid; break; }
              if (fm * (deriv.evaluate({ x: a }) as number) < 0) b = mid;
              else a = mid;
            }
            const cp = parseFloat(((a + b) / 2).toFixed(6));
            if (!criticalPoints.some(p => Math.abs(p - cp) < 0.01)) {
              criticalPoints.push(cp);
            }
          }
        } catch { /* skip */ }
      }

      if (criticalPoints.length > 0) {
        criticalPoints.forEach(cp => {
          try {
            const fVal = node.evaluate({ x: cp }) as number;
            const f2Val = deriv2.evaluate({ x: cp }) as number;
            const nature = f2Val > 0 ? 'Minimum' : f2Val < 0 ? 'Maximum' : 'Inflection point';
            steps.push({
              description: `Critical point at x = ${fmtDec(cp)}`,
              expression: `f(${fmtDec(cp)}) = ${fmtDec(fVal)}, f''(${fmtDec(cp)}) = ${fmtDec(f2Val)} → ${nature}`
            });
          } catch { /* skip */ }
        });
      } else {
        steps.push({ description: 'No real critical points found in [-20, 20]', expression: 'The function may be monotonic in this range' });
      }

      return { problem: input, category: 'Calculus (Critical Points)', result: criticalPoints.length > 0 ? `Critical points: x = ${criticalPoints.map(fmtDec).join(', ')}` : 'No critical points found', steps, success: true };
    } catch { return null; }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// INTEGRATION (College-Level)
// ═══════════════════════════════════════════════════════════════

interface IntegralRule {
  pattern: RegExp;
  solve: (match: RegExpMatchArray) => { result: string; steps: SolutionStep[] } | null;
}

const integralRules: IntegralRule[] = [
  // ∫ x^n dx
  {
    pattern: /^x\s*\^\s*([-\d.]+)$/,
    solve: (m) => {
      const n = parseFloat(m[1]);
      if (n === -1) {
        return {
          result: 'ln|x| + C',
          steps: [
            { description: 'Recognize the form ∫x⁻¹ dx', expression: '∫(1/x) dx' },
            { description: 'Apply the natural log rule', expression: '∫(1/x) dx = ln|x| + C' },
          ],
        };
      }
      const newPow = n + 1;
      return {
        result: `(1/${fmt(newPow)})x^${fmt(newPow)} + C`,
        steps: [
          { description: 'Apply the power rule: ∫xⁿ dx = x^(n+1)/(n+1) + C', expression: `n = ${n}` },
          { description: 'New exponent', expression: `n + 1 = ${fmt(newPow)}` },
          { description: 'Result', expression: `x^${fmt(newPow)} / ${fmt(newPow)} + C = (1/${fmt(newPow)})x^${fmt(newPow)} + C` },
        ],
      };
    },
  },
  // ∫ x dx
  {
    pattern: /^x$/,
    solve: () => ({
      result: 'x²/2 + C',
      steps: [
        { description: 'Apply the power rule with n = 1', expression: '∫x dx = x^(1+1)/(1+1) + C' },
        { description: 'Result', expression: 'x²/2 + C' },
      ],
    }),
  },
  // ∫ constant dx
  {
    pattern: /^([-\d.]+)$/,
    solve: (m) => {
      const c = parseFloat(m[1]);
      return {
        result: `${fmt(c)}x + C`,
        steps: [
          { description: 'Constant rule: ∫a dx = ax + C', expression: `a = ${fmt(c)}` },
          { description: 'Result', expression: `${fmt(c)}x + C` },
        ],
      };
    },
  },
  // ∫ a*x^n dx
  {
    pattern: /^([-\d.]+)\s*\*?\s*x\s*\^\s*([-\d.]+)$/,
    solve: (m) => {
      const a = parseFloat(m[1]);
      const n = parseFloat(m[2]);
      const newPow = n + 1;
      const coeff = a / newPow;
      return {
        result: `${fmtDec(coeff)}x^${fmt(newPow)} + C`,
        steps: [
          { description: 'Factor out the constant', expression: `${fmt(a)} × ∫x^${fmt(n)} dx` },
          { description: 'Apply power rule', expression: `${fmt(a)} × x^${fmt(newPow)}/${fmt(newPow)}` },
          { description: 'Simplify coefficient', expression: `${fmt(a)}/${fmt(newPow)} = ${fmtDec(coeff)}` },
          { description: 'Result', expression: `${fmtDec(coeff)}x^${fmt(newPow)} + C` },
        ],
      };
    },
  },
  // ∫ sin(x) dx
  {
    pattern: /^sin\s*\(\s*x\s*\)$/,
    solve: () => ({
      result: '-cos(x) + C',
      steps: [
        { description: 'Standard integral', expression: '∫sin(x) dx = -cos(x) + C' },
        { description: 'Verify by differentiating', expression: 'd/dx[-cos(x)] = sin(x) ✓' },
      ],
    }),
  },
  // ∫ cos(x) dx
  {
    pattern: /^cos\s*\(\s*x\s*\)$/,
    solve: () => ({
      result: 'sin(x) + C',
      steps: [
        { description: 'Standard integral', expression: '∫cos(x) dx = sin(x) + C' },
        { description: 'Verify by differentiating', expression: 'd/dx[sin(x)] = cos(x) ✓' },
      ],
    }),
  },
  // ∫ sec^2(x) dx
  {
    pattern: /^sec\s*\^\s*2\s*\(\s*x\s*\)$/,
    solve: () => ({
      result: 'tan(x) + C',
      steps: [
        { description: 'Standard integral', expression: '∫sec²(x) dx = tan(x) + C' },
        { description: 'Verify', expression: 'd/dx[tan(x)] = sec²(x) ✓' },
      ],
    }),
  },
  // ∫ e^x dx
  {
    pattern: /^e\s*\^\s*x$/,
    solve: () => ({
      result: 'e^x + C',
      steps: [
        { description: 'Exponential rule', expression: '∫eˣ dx = eˣ + C' },
        { description: 'The exponential function is its own integral', expression: 'd/dx[eˣ] = eˣ ✓' },
      ],
    }),
  },
  // ∫ e^(ax) dx
  {
    pattern: /^e\s*\^\s*\(\s*([-\d.]+)\s*\*?\s*x\s*\)$/,
    solve: (m) => {
      const a = parseFloat(m[1]);
      return {
        result: `(1/${fmt(a)})e^(${fmt(a)}x) + C`,
        steps: [
          { description: 'Exponential rule with chain rule', expression: `∫e^(ax) dx = (1/a)e^(ax) + C` },
          { description: 'Substitute a', expression: `a = ${fmt(a)}` },
          { description: 'Result', expression: `(1/${fmt(a)})e^(${fmt(a)}x) + C` },
        ],
      };
    },
  },
  // ∫ 1/x dx
  {
    pattern: /^1\s*\/\s*x$/,
    solve: () => ({
      result: 'ln|x| + C',
      steps: [
        { description: 'Standard integral', expression: '∫(1/x) dx = ln|x| + C' },
        { description: 'This is the special case of the power rule when n = -1', expression: 'd/dx[ln|x|] = 1/x ✓' },
      ],
    }),
  },
  // ∫ sin(ax) dx
  {
    pattern: /^sin\s*\(\s*([-\d.]+)\s*\*?\s*x\s*\)$/,
    solve: (m) => {
      const a = parseFloat(m[1]);
      return {
        result: `(-1/${fmt(a)})cos(${fmt(a)}x) + C`,
        steps: [
          { description: 'Apply chain rule in reverse', expression: `∫sin(ax) dx = -(1/a)cos(ax) + C` },
          { description: 'Substitute a', expression: `a = ${fmt(a)}` },
          { description: 'Result', expression: `(-1/${fmt(a)})cos(${fmt(a)}x) + C` },
        ],
      };
    },
  },
  // ∫ cos(ax) dx
  {
    pattern: /^cos\s*\(\s*([-\d.]+)\s*\*?\s*x\s*\)$/,
    solve: (m) => {
      const a = parseFloat(m[1]);
      return {
        result: `(1/${fmt(a)})sin(${fmt(a)}x) + C`,
        steps: [
          { description: 'Apply chain rule in reverse', expression: `∫cos(ax) dx = (1/a)sin(ax) + C` },
          { description: 'Substitute a', expression: `a = ${fmt(a)}` },
          { description: 'Result', expression: `(1/${fmt(a)})sin(${fmt(a)}x) + C` },
        ],
      };
    },
  },
  // ∫ tan(x) dx
  {
    pattern: /^tan\s*\(\s*x\s*\)$/,
    solve: () => ({
      result: '-ln|cos(x)| + C  or  ln|sec(x)| + C',
      steps: [
        { description: 'Rewrite tan(x)', expression: '∫tan(x) dx = ∫sin(x)/cos(x) dx' },
        { description: 'Let u = cos(x), du = -sin(x) dx', expression: '= -∫(1/u) du' },
        { description: 'Integrate', expression: '= -ln|u| + C = -ln|cos(x)| + C' },
        { description: 'Equivalent form', expression: '= ln|sec(x)| + C' },
      ],
    }),
  },
  // ∫ 1/(1+x^2) dx
  {
    pattern: /^1\s*\/\s*\(\s*1\s*\+\s*x\s*\^\s*2\s*\)$/,
    solve: () => ({
      result: 'arctan(x) + C',
      steps: [
        { description: 'Standard inverse trig integral', expression: '∫1/(1+x²) dx = arctan(x) + C' },
        { description: 'Verify', expression: 'd/dx[arctan(x)] = 1/(1+x²) ✓' },
      ],
    }),
  },
  // ∫ 1/sqrt(1-x^2) dx
  {
    pattern: /^1\s*\/\s*sqrt\s*\(\s*1\s*-\s*x\s*\^\s*2\s*\)$/,
    solve: () => ({
      result: 'arcsin(x) + C',
      steps: [
        { description: 'Standard inverse trig integral', expression: '∫1/√(1-x²) dx = arcsin(x) + C' },
        { description: 'Verify', expression: 'd/dx[arcsin(x)] = 1/√(1-x²) ✓' },
      ],
    }),
  },
  // ∫ ln(x) dx
  {
    pattern: /^ln\s*\(\s*x\s*\)$/,
    solve: () => ({
      result: 'x·ln(x) - x + C',
      steps: [
        { description: 'Use integration by parts: ∫u dv = uv - ∫v du', expression: 'Let u = ln(x), dv = dx' },
        { description: 'Then du = (1/x)dx, v = x', expression: '' },
        { description: 'Apply formula', expression: '= x·ln(x) - ∫x·(1/x) dx' },
        { description: 'Simplify', expression: '= x·ln(x) - ∫1 dx' },
        { description: 'Result', expression: '= x·ln(x) - x + C' },
      ],
    }),
  },
];

export function solveIntegration(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── DEFINITE INTEGRAL ──
  let m = lower.match(/(?:definite\s*)?integra(?:te|l)\s*(?:of\s*)?(.+?)\s*(?:from|between)\s*([-\d.]+)\s*(?:to|and)\s*([-\d.]+)/);
  if (!m) {
    m = lower.match(/(?:definite\s*)?integra(?:te|l)\s*(?:of\s*)?(.+?)\s*(?:dx\s*)?(?:from|between)\s*([-\d.]+)\s*(?:to|and)\s*([-\d.]+)/);
  }
  if (m) {
    const expr = m[1].replace(/\s*dx\s*$/, '').trim();
    const a = parseFloat(m[2]);
    const b = parseFloat(m[3]);
    const steps: SolutionStep[] = [
      { description: 'Definite integral', expression: `∫[${a} to ${b}] ${expr} dx` },
    ];

    // Try to find the antiderivative symbolically
    let antideriv: string | null = null;
    for (const rule of integralRules) {
      const ruleMatch = expr.match(rule.pattern);
      if (ruleMatch) {
        const result = rule.solve(ruleMatch);
        if (result) {
          antideriv = result.result.replace(/\s*\+\s*C\s*$/, '');
          steps.push(...result.steps.map(s => ({ ...s, expression: s.expression.replace(/\s*\+\s*C/g, '') })));
          break;
        }
      }
    }

    // Numerical integration using Simpson's rule
    try {
      const node = math.parse(expr);
      const n = 1000;
      const h = (b - a) / n;
      let sum = (node.evaluate({ x: a }) as number) + (node.evaluate({ x: b }) as number);
      for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        const coeff = i % 2 === 0 ? 2 : 4;
        sum += coeff * (node.evaluate({ x: xi }) as number);
      }
      const numResult = (h / 3) * sum;

      if (antideriv) {
        try {
          const antiNode = math.parse(antideriv);
          const Fb = antiNode.evaluate({ x: b }) as number;
          const Fa = antiNode.evaluate({ x: a }) as number;
          steps.push({ description: `Evaluate F(${b}) - F(${a})`, expression: `F(${b}) = ${fmtDec(Fb)}, F(${a}) = ${fmtDec(Fa)}` });
          steps.push({ description: 'Result', expression: `${fmtDec(Fb)} - ${fmtDec(Fa)} = ${fmtDec(Fb - Fa)}` });
          return { problem: input, category: 'Calculus (Definite Integral)', result: fmtDec(Fb - Fa), steps, success: true };
        } catch { /* fall through to numerical */ }
      }

      steps.push({ description: 'Numerical integration (Simpson\'s Rule)', expression: `With n = ${n} subintervals` });
      steps.push({ description: 'Result', expression: `≈ ${fmtDec(numResult, 6)}` });
      return { problem: input, category: 'Calculus (Definite Integral)', result: fmtDec(numResult, 6), steps, success: true };
    } catch { return null; }
  }

  // ── INDEFINITE INTEGRAL ──
  m = lower.match(/(?:indefinite\s*)?integra(?:te|l)\s*(?:of\s*)?(.+?)(?:\s*dx)?$/);
  if (!m) return null;

  const expr = m[1].replace(/\s*dx\s*$/, '').trim();
  if (!expr) return null;

  // Don't match if it's a definite integral keyword
  if (lower.includes('from') || lower.includes('between')) return null;

  const steps: SolutionStep[] = [
    { description: 'Find the indefinite integral', expression: `∫ ${expr} dx` },
  ];

  // Try pattern-based rules
  for (const rule of integralRules) {
    const ruleMatch = expr.match(rule.pattern);
    if (ruleMatch) {
      const result = rule.solve(ruleMatch);
      if (result) {
        steps.push(...result.steps);
        return { problem: input, category: 'Calculus (Integration)', result: result.result, steps, success: true };
      }
    }
  }

  // Try polynomial integration term by term
  try {
    const node = math.parse(expr);
    // Try to differentiate the guessed antiderivative for verification
    // For polynomials, integrate each term
    const simplified = math.simplify(node);
    steps.push({ description: 'Simplify the integrand', expression: simplified.toString() });

    // Numerical approach: check if it's a polynomial by sampling
    const vals: number[] = [];
    for (let x = -2; x <= 2; x++) {
      try {
        vals.push(node.evaluate({ x }) as number);
      } catch { break; }
    }

    if (vals.length === 5) {
      // It evaluates - try mathjs derivative to verify
      try {
        // Attempt symbolic integration by anti-differentiating
        // Build polynomial antiderivative
        const terms = expr.split(/(?=[+-])/);
        const antiTerms: string[] = [];
        let canIntegrate = true;

        for (const term of terms) {
          const t = term.trim();
          if (!t) continue;

          // ax^n
          const polyMatch = t.match(/^([+-]?\s*\d*\.?\d*)\s*\*?\s*x\s*\^\s*([-\d.]+)$/);
          if (polyMatch) {
            const coeff = polyMatch[1].replace(/\s/g, '') || '1';
            const a = coeff === '+' || coeff === '' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            const n = parseFloat(polyMatch[2]);
            const newN = n + 1;
            const newCoeff = a / newN;
            antiTerms.push(`${fmtDec(newCoeff)}*x^${fmt(newN)}`);
            continue;
          }
          // ax
          const linMatch = t.match(/^([+-]?\s*\d*\.?\d*)\s*\*?\s*x$/);
          if (linMatch) {
            const coeff = linMatch[1].replace(/\s/g, '') || '1';
            const a = coeff === '+' || coeff === '' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            antiTerms.push(`${fmtDec(a / 2)}*x^2`);
            continue;
          }
          // constant
          const constMatch = t.match(/^([+-]?\s*\d+\.?\d*)$/);
          if (constMatch) {
            const a = parseFloat(constMatch[1].replace(/\s/g, ''));
            antiTerms.push(`${fmt(a)}*x`);
            continue;
          }

          canIntegrate = false;
          break;
        }

        if (canIntegrate && antiTerms.length > 0) {
          const result = antiTerms.join(' + ') + ' + C';
          steps.push({ description: 'Integrate term by term using power rule', expression: 'Each term: ∫axⁿ dx = a·x^(n+1)/(n+1)' });
          steps.push({ description: 'Result', expression: result });
          return { problem: input, category: 'Calculus (Integration)', result, steps, success: true };
        }
      } catch { /* continue */ }
    }

    steps.push({ description: 'This integral may require advanced techniques', expression: 'Try: integration by parts, substitution, partial fractions, or trigonometric substitution' });
    steps.push({ description: 'Common techniques', expression: '• By Parts: ∫u dv = uv - ∫v du\n• Substitution: Let u = g(x)\n• Partial Fractions: Split rational functions\n• Trig Sub: For √(a²-x²), √(a²+x²), √(x²-a²)' });
    return { problem: input, category: 'Calculus (Integration)', result: 'See techniques in steps', steps, success: true };
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// LIMITS
// ═══════════════════════════════════════════════════════════════

export function solveLimit(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── LIMIT as x → a ──
  let m = lower.match(/lim(?:it)?\s*(?:of\s*)?(.+?)\s*(?:as|when|for)\s*x\s*(?:→|->|approaches?|tends?\s*to)\s*([-\d.]+|infinity|inf|∞)/);
  if (!m) {
    m = lower.match(/lim(?:it)?\s*(?:x\s*(?:→|->|approaches?|tends?\s*to)\s*([-\d.]+|infinity|inf|∞))?\s*(?:of\s*)?(.+)/);
    if (m) {
      // swap groups
      const temp = m[1];
      m[1] = m[2];
      m[2] = temp;
    }
  }
  if (!m) return null;

  const expr = m[1].trim();
  const targetStr = m[2]?.trim() || '0';
  const isInfinity = targetStr.match(/inf|∞/i);

  const steps: SolutionStep[] = [
    { description: 'Evaluate the limit', expression: `lim(x→${isInfinity ? '∞' : targetStr}) ${expr}` },
  ];

  try {
    const node = math.parse(expr);

    if (isInfinity) {
      // Limit at infinity - evaluate at increasingly large values
      const vals = [10, 100, 1000, 10000, 100000];
      const results = vals.map(v => {
        try { return node.evaluate({ x: v }) as number; } catch { return NaN; }
      });

      steps.push({ description: 'Evaluate at increasing x values', expression: vals.map((v, i) => `f(${v}) = ${fmtDec(results[i], 6)}`).join('\n') });

      if (results.every(r => !isNaN(r))) {
        const last = results[results.length - 1];
        const secondLast = results[results.length - 2];

        if (Math.abs(last) > 1e10) {
          const sign = last > 0 ? '+' : '-';
          steps.push({ description: 'The function grows without bound', expression: `lim = ${sign}∞` });
          return { problem: input, category: 'Calculus (Limit)', result: `${sign}∞`, steps, success: true };
        } else if (Math.abs(last - secondLast) < 0.001) {
          steps.push({ description: 'The values converge', expression: `lim ≈ ${fmtDec(last, 6)}` });
          return { problem: input, category: 'Calculus (Limit)', result: fmtDec(last, 6), steps, success: true };
        } else {
          steps.push({ description: 'The limit appears to approach', expression: fmtDec(last, 6) });
          return { problem: input, category: 'Calculus (Limit)', result: `≈ ${fmtDec(last, 6)}`, steps, success: true };
        }
      }
    } else {
      const target = parseFloat(targetStr);

      // Direct substitution
      try {
        const direct = node.evaluate({ x: target }) as number;
        if (isFinite(direct) && !isNaN(direct)) {
          steps.push({ description: 'Direct substitution', expression: `f(${target}) = ${fmtDec(direct, 8)}` });
          steps.push({ description: 'Since f is defined at this point, the limit equals f(a)', expression: `lim = ${fmtDec(direct, 8)}` });
          return { problem: input, category: 'Calculus (Limit)', result: fmtDec(direct, 8), steps, success: true };
        }
      } catch { /* indeterminate form */ }

      // Indeterminate form - approach from both sides
      const deltas = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const leftVals = deltas.map(d => {
        try { return node.evaluate({ x: target - d }) as number; } catch { return NaN; }
      });
      const rightVals = deltas.map(d => {
        try { return node.evaluate({ x: target + d }) as number; } catch { return NaN; }
      });

      steps.push({ description: 'Direct substitution gives 0/0 or undefined — check limits from both sides', expression: '' });
      steps.push({
        description: 'Approach from the left (x → a⁻)',
        expression: deltas.map((d, i) => `f(${fmtDec(target - d, 5)}) = ${isNaN(leftVals[i]) ? 'undefined' : fmtDec(leftVals[i], 8)}`).join('\n')
      });
      steps.push({
        description: 'Approach from the right (x → a⁺)',
        expression: deltas.map((d, i) => `f(${fmtDec(target + d, 5)}) = ${isNaN(rightVals[i]) ? 'undefined' : fmtDec(rightVals[i], 8)}`).join('\n')
      });

      const leftLimit = leftVals[leftVals.length - 1];
      const rightLimit = rightVals[rightVals.length - 1];

      if (!isNaN(leftLimit) && !isNaN(rightLimit)) {
        if (Math.abs(leftLimit - rightLimit) < 0.001) {
          const limit = (leftLimit + rightLimit) / 2;
          steps.push({ description: 'Left and right limits agree', expression: `lim = ${fmtDec(limit, 6)}` });

          // Try L'Hôpital's rule
          try {
            const numerator = expr.match(/\((.+?)\)\s*\/\s*\((.+?)\)/);
            if (numerator) {
              const numDeriv = math.simplify(math.derivative(math.parse(numerator[1]), 'x'));
              const denDeriv = math.simplify(math.derivative(math.parse(numerator[2]), 'x'));
              steps.push({ description: "L'Hôpital's Rule: lim f/g = lim f'/g'", expression: `f'(x) = ${numDeriv.toString()}\ng'(x) = ${denDeriv.toString()}` });
              const lhResult = math.parse(`(${numDeriv.toString()})/(${denDeriv.toString()})`).evaluate({ x: target }) as number;
              if (isFinite(lhResult)) {
                steps.push({ description: "By L'Hôpital's Rule", expression: `lim = ${fmtDec(lhResult, 6)}` });
              }
            }
          } catch { /* skip L'Hôpital */ }

          return { problem: input, category: 'Calculus (Limit)', result: fmtDec(limit, 6), steps, success: true };
        } else {
          steps.push({ description: 'Left and right limits differ — limit does not exist', expression: `Left: ${fmtDec(leftLimit, 6)}, Right: ${fmtDec(rightLimit, 6)}` });
          return { problem: input, category: 'Calculus (Limit)', result: 'DNE (Does Not Exist)', steps, success: true };
        }
      }

      if (!isNaN(leftLimit) || !isNaN(rightLimit)) {
        const known = !isNaN(leftLimit) ? leftLimit : rightLimit;
        steps.push({ description: 'One-sided limit', expression: fmtDec(known, 6) });
        return { problem: input, category: 'Calculus (Limit)', result: `≈ ${fmtDec(known, 6)}`, steps, success: true };
      }
    }
  } catch { /* fall through */ }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// COMPLEX NUMBERS
// ═══════════════════════════════════════════════════════════════

export function solveComplexNumbers(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── MODULUS ──
  let m = lower.match(/(?:modulus|magnitude|abs|absolute\s*value)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?/);
  if (m) {
    const a = parseFloat(m[1]);
    const sign = m[2] === '-' ? -1 : 1;
    const b = sign * parseFloat(m[3]);
    const mod = Math.sqrt(a * a + b * b);
    return {
      problem: input, category: 'Complex Numbers (Modulus)', result: fmtDec(mod),
      steps: [
        { description: 'Complex number z = a + bi', expression: `z = ${a} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}i` },
        { description: '|z| = √(a² + b²)', expression: `|z| = √(${a}² + ${b}²)` },
        { description: 'Calculate', expression: `|z| = √(${fmtDec(a * a)} + ${fmtDec(b * b)}) = √${fmtDec(a * a + b * b)} = ${fmtDec(mod)}` },
      ],
      success: true,
    };
  }

  // ── ARGUMENT ──
  m = lower.match(/(?:argument|arg|angle|phase)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?/);
  if (m) {
    const a = parseFloat(m[1]);
    const sign = m[2] === '-' ? -1 : 1;
    const b = sign * parseFloat(m[3]);
    const argRad = Math.atan2(b, a);
    const argDeg = argRad * 180 / Math.PI;
    return {
      problem: input, category: 'Complex Numbers (Argument)', result: `${fmtDec(argDeg)}° (${fmtDec(argRad)} rad)`,
      steps: [
        { description: 'Complex number z = a + bi', expression: `z = ${a} + ${b}i` },
        { description: 'arg(z) = atan2(b, a)', expression: `arg(z) = atan2(${b}, ${a})` },
        { description: 'In radians', expression: `arg(z) = ${fmtDec(argRad)} rad` },
        { description: 'In degrees', expression: `arg(z) = ${fmtDec(argDeg)}°` },
        { description: 'Quadrant', expression: a >= 0 && b >= 0 ? 'Q1' : a < 0 && b >= 0 ? 'Q2' : a < 0 && b < 0 ? 'Q3' : 'Q4' },
      ],
      success: true,
    };
  }

  // ── POLAR FORM ──
  m = lower.match(/(?:polar\s*form|convert\s*to\s*polar|rectangular\s*to\s*polar)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?/);
  if (m) {
    const a = parseFloat(m[1]);
    const sign = m[2] === '-' ? -1 : 1;
    const b = sign * parseFloat(m[3]);
    const r = Math.sqrt(a * a + b * b);
    const theta = Math.atan2(b, a);
    const thetaDeg = theta * 180 / Math.PI;
    return {
      problem: input, category: 'Complex Numbers (Polar Form)', result: `${fmtDec(r)}∠${fmtDec(thetaDeg)}°`,
      steps: [
        { description: 'Complex number z = a + bi', expression: `z = ${a} + ${b}i` },
        { description: 'Modulus r = √(a² + b²)', expression: `r = √(${fmtDec(a * a)} + ${fmtDec(b * b)}) = ${fmtDec(r)}` },
        { description: 'Argument θ = atan2(b, a)', expression: `θ = ${fmtDec(thetaDeg)}° = ${fmtDec(theta)} rad` },
        { description: 'Polar form', expression: `z = ${fmtDec(r)}(cos ${fmtDec(thetaDeg)}° + i sin ${fmtDec(thetaDeg)}°)` },
        { description: 'Euler form', expression: `z = ${fmtDec(r)}e^(i·${fmtDec(theta)})` },
      ],
      success: true,
    };
  }

  // ── COMPLEX MULTIPLICATION ──
  m = lower.match(/(?:multiply|product)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?\s*(?:and|×|x|\*|by)\s*\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?/);
  if (m) {
    const a = parseFloat(m[1]), b = (m[2] === '-' ? -1 : 1) * parseFloat(m[3]);
    const c = parseFloat(m[4]), d = (m[5] === '-' ? -1 : 1) * parseFloat(m[6]);
    const realPart = a * c - b * d;
    const imagPart = a * d + b * c;
    return {
      problem: input, category: 'Complex Numbers (Multiplication)', result: `${fmtDec(realPart)} ${imagPart >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagPart))}i`,
      steps: [
        { description: 'Multiply (a+bi)(c+di)', expression: `(${a}${b >= 0 ? '+' : ''}${b}i)(${c}${d >= 0 ? '+' : ''}${d}i)` },
        { description: 'Use FOIL method', expression: `= ac + adi + bci + bdi²` },
        { description: 'Since i² = -1', expression: `= (ac - bd) + (ad + bc)i` },
        { description: 'Real part: ac - bd', expression: `= (${a})(${c}) - (${b})(${d}) = ${fmtDec(a * c)} - ${fmtDec(b * d)} = ${fmtDec(realPart)}` },
        { description: 'Imaginary part: ad + bc', expression: `= (${a})(${d}) + (${b})(${c}) = ${fmtDec(a * d)} + ${fmtDec(b * c)} = ${fmtDec(imagPart)}` },
        { description: 'Result', expression: `${fmtDec(realPart)} ${imagPart >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagPart))}i` },
      ],
      success: true,
    };
  }

  // ── COMPLEX DIVISION ──
  m = lower.match(/(?:divide)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?\s*(?:by|÷|\/)\s*\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?/);
  if (m) {
    const a = parseFloat(m[1]), b = (m[2] === '-' ? -1 : 1) * parseFloat(m[3]);
    const c = parseFloat(m[4]), d = (m[5] === '-' ? -1 : 1) * parseFloat(m[6]);
    const denom = c * c + d * d;
    const realPart = (a * c + b * d) / denom;
    const imagPart = (b * c - a * d) / denom;
    return {
      problem: input, category: 'Complex Numbers (Division)', result: `${fmtDec(realPart)} ${imagPart >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagPart))}i`,
      steps: [
        { description: 'Divide (a+bi)/(c+di)', expression: `(${a}${b >= 0 ? '+' : ''}${b}i) / (${c}${d >= 0 ? '+' : ''}${d}i)` },
        { description: 'Multiply numerator and denominator by conjugate of denominator', expression: `Conjugate of ${c}${d >= 0 ? '+' : ''}${d}i is ${c}${-d >= 0 ? '+' : ''}${-d}i` },
        { description: 'Denominator: |c+di|² = c²+d²', expression: `= ${c}² + ${d}² = ${fmtDec(denom)}` },
        { description: 'Real part: (ac+bd)/(c²+d²)', expression: `= (${fmtDec(a * c)} + ${fmtDec(b * d)})/${fmtDec(denom)} = ${fmtDec(realPart)}` },
        { description: 'Imaginary part: (bc-ad)/(c²+d²)', expression: `= (${fmtDec(b * c)} - ${fmtDec(a * d)})/${fmtDec(denom)} = ${fmtDec(imagPart)}` },
        { description: 'Result', expression: `${fmtDec(realPart)} ${imagPart >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagPart))}i` },
      ],
      success: true,
    };
  }

  // ── DE MOIVRE'S THEOREM ──
  m = lower.match(/(?:de\s*moivre|moivre)\s*\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?\s*\^\s*(\d+)/);
  if (!m) {
    m = lower.match(/\(?\s*([-\d.]+)\s*([+-])\s*([\d.]+)\s*i\s*\)?\s*\^\s*(\d+)/);
    if (m && lower.includes('moivre')) { /* matched */ } else { m = null; }
  }
  if (m) {
    const a = parseFloat(m[1]), b = (m[2] === '-' ? -1 : 1) * parseFloat(m[3]);
    const n = parseInt(m[4]);
    const r = Math.sqrt(a * a + b * b);
    const theta = Math.atan2(b, a);
    const rN = Math.pow(r, n);
    const nTheta = n * theta;
    const realResult = rN * Math.cos(nTheta);
    const imagResult = rN * Math.sin(nTheta);
    return {
      problem: input, category: 'Complex Numbers (De Moivre)', result: `${fmtDec(realResult)} ${imagResult >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagResult))}i`,
      steps: [
        { description: 'Convert to polar form', expression: `r = ${fmtDec(r)}, θ = ${fmtDec(theta * 180 / Math.PI)}°` },
        { description: "De Moivre's Theorem: (r·e^(iθ))ⁿ = rⁿ·e^(inθ)", expression: `z^${n} = ${fmtDec(r)}^${n} · (cos(${n}·${fmtDec(theta * 180 / Math.PI)}°) + i·sin(${n}·${fmtDec(theta * 180 / Math.PI)}°))` },
        { description: 'Calculate rⁿ', expression: `${fmtDec(r)}^${n} = ${fmtDec(rN)}` },
        { description: 'Calculate nθ', expression: `${n} × ${fmtDec(theta * 180 / Math.PI)}° = ${fmtDec(n * theta * 180 / Math.PI)}°` },
        { description: 'Result', expression: `= ${fmtDec(rN)} × (${fmtDec(Math.cos(nTheta))} + ${fmtDec(Math.sin(nTheta))}i)` },
        { description: 'Final answer', expression: `= ${fmtDec(realResult)} ${imagResult >= 0 ? '+' : '-'} ${fmtDec(Math.abs(imagResult))}i` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// DIFFERENTIAL EQUATIONS
// ═══════════════════════════════════════════════════════════════

export function solveDiffEquation(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── SECOND ORDER HOMOGENEOUS: ay'' + by' + cy = 0 ──
  let m = lower.match(/(?:solve\s*)?(\d*)\s*y\s*''\s*([+-]\s*\d*)\s*y\s*'\s*([+-]\s*\d*)\s*y\s*=\s*0/);
  if (!m) {
    m = lower.match(/(?:characteristic|auxiliary)\s*(?:equation)?\s*(\d*)\s*(?:r|m|λ)\s*\^\s*2\s*([+-]\s*\d*)\s*(?:r|m|λ)\s*([+-]\s*\d*)\s*=\s*0/);
  }
  if (m) {
    const a = m[1] ? parseFloat(m[1]) : 1;
    const b = parseFloat(m[2].replace(/\s/g, '') || '0');
    const c = parseFloat(m[3].replace(/\s/g, '') || '0');
    const disc = b * b - 4 * a * c;
    const steps: SolutionStep[] = [
      { description: "Second-order homogeneous ODE: ay'' + by' + cy = 0", expression: `a = ${a}, b = ${b}, c = ${c}` },
      { description: 'Characteristic equation: ar² + br + c = 0', expression: `${a}r² ${b >= 0 ? '+' : ''}${b}r ${c >= 0 ? '+' : ''}${c} = 0` },
      { description: 'Discriminant', expression: `Δ = b² - 4ac = ${fmtDec(b * b)} - ${fmtDec(4 * a * c)} = ${fmtDec(disc)}` },
    ];

    let result: string;
    if (disc > 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      steps.push({ description: 'Two distinct real roots', expression: `r₁ = ${fmtDec(r1)}, r₂ = ${fmtDec(r2)}` });
      result = `y = C₁e^(${fmtDec(r1)}x) + C₂e^(${fmtDec(r2)}x)`;
      steps.push({ description: 'General solution', expression: result });
    } else if (Math.abs(disc) < 1e-10) {
      const r = -b / (2 * a);
      steps.push({ description: 'Repeated root', expression: `r = ${fmtDec(r)}` });
      result = `y = (C₁ + C₂x)e^(${fmtDec(r)}x)`;
      steps.push({ description: 'General solution', expression: result });
    } else {
      const alpha = -b / (2 * a);
      const beta = Math.sqrt(-disc) / (2 * a);
      steps.push({ description: 'Complex roots', expression: `r = ${fmtDec(alpha)} ± ${fmtDec(beta)}i` });
      result = `y = e^(${fmtDec(alpha)}x)[C₁cos(${fmtDec(beta)}x) + C₂sin(${fmtDec(beta)}x)]`;
      steps.push({ description: 'General solution', expression: result });
    }

    return { problem: input, category: 'Differential Equations', result, steps, success: true };
  }

  // ── FIRST ORDER LINEAR: dy/dx + P(x)y = Q(x) with constant coefficients ──
  m = lower.match(/(?:solve\s*)?(?:dy\s*\/\s*dx|y\s*')\s*([+-]\s*[\d.]+)\s*y\s*=\s*([-\d.]+)/);
  if (m) {
    const P = parseFloat(m[1].replace(/\s/g, ''));
    const Q = parseFloat(m[2]);
    const steps: SolutionStep[] = [
      { description: "First-order linear ODE: y' + Py = Q", expression: `P = ${P}, Q = ${Q}` },
      { description: 'Integrating factor μ = e^(∫P dx)', expression: `μ = e^(${P}x)` },
      { description: 'Multiply both sides by μ', expression: `d/dx[μ·y] = μ·Q` },
      { description: 'Integrate both sides', expression: `e^(${P}x)·y = ∫${Q}·e^(${P}x) dx` },
      { description: 'Evaluate the integral', expression: `e^(${P}x)·y = (${Q}/${P})·e^(${P}x) + C` },
    ];
    const result = `y = ${fmtDec(Q / P)} + Ce^(${fmtDec(-P)}x)`;
    steps.push({ description: 'General solution', expression: result });
    return { problem: input, category: 'Differential Equations', result, steps, success: true };
  }

  // ── SEPARABLE: dy/dx = f(x)*g(y) ──
  m = lower.match(/(?:solve\s*)?(?:dy\s*\/\s*dx|y\s*')\s*=\s*([-\d.]+)\s*\*?\s*x\s*\*?\s*y/);
  if (m) {
    const k = parseFloat(m[1]);
    return {
      problem: input, category: 'Differential Equations (Separable)', result: `y = Ae^(${fmtDec(k / 2)}x²)`,
      steps: [
        { description: 'Separable ODE: dy/dx = kxy', expression: `k = ${k}` },
        { description: 'Separate variables', expression: `dy/y = ${k}x dx` },
        { description: 'Integrate both sides', expression: `∫(1/y) dy = ∫${k}x dx` },
        { description: 'Evaluate integrals', expression: `ln|y| = ${fmtDec(k / 2)}x² + C` },
        { description: 'Solve for y', expression: `y = Ae^(${fmtDec(k / 2)}x²) where A = e^C` },
      ],
      success: true,
    };
  }

  // ── GENERAL ODE IDENTIFICATION ──
  if (lower.match(/(?:dy\s*\/\s*dx|y\s*'|y\s*''|differential\s*equation)/)) {
    const steps: SolutionStep[] = [
      { description: 'Identify the type of differential equation', expression: input },
    ];

    if (lower.includes("y''") || lower.includes("y ''")) {
      steps.push({ description: 'This is a second-order ODE', expression: 'Form: ay\'\' + by\' + cy = f(x)' });
      steps.push({ description: 'Method', expression: '1. Find the characteristic equation: ar² + br + c = 0\n2. Solve for r to find complementary solution\n3. Find particular solution if f(x) ≠ 0\n4. General solution = Complementary + Particular' });
    } else {
      steps.push({ description: 'This is a first-order ODE', expression: 'Common methods:\n1. Separable: dy/dx = f(x)·g(y)\n2. Linear: dy/dx + P(x)y = Q(x)\n3. Exact: M(x,y)dx + N(x,y)dy = 0\n4. Bernoulli: dy/dx + P(x)y = Q(x)yⁿ' });
    }

    steps.push({ description: 'Try entering in a specific form', expression: "Examples:\n• y' + 3y = 5\n• y'' - 4y' + 3y = 0\n• dy/dx = 2xy" });

    return { problem: input, category: 'Differential Equations', result: 'See classification in steps', steps, success: true };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// VECTORS (College-Level)
// ═══════════════════════════════════════════════════════════════

export function solveVectors(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── DOT PRODUCT ──
  let m = lower.match(/dot\s*product\s*(?:of\s*)?\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*(?:[,\s]+\s*([-\d.]+))?\s*\)?\s*(?:and|·|\.)\s*\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*(?:[,\s]+\s*([-\d.]+))?\s*\)?/);
  if (m) {
    const v1 = [parseFloat(m[1]), parseFloat(m[2])];
    const v2 = [parseFloat(m[4]), parseFloat(m[5])];
    if (m[3]) v1.push(parseFloat(m[3]));
    if (m[6]) v2.push(parseFloat(m[6]));

    const dot = v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
    const mag1 = Math.sqrt(v1.reduce((s, v) => s + v * v, 0));
    const mag2 = Math.sqrt(v2.reduce((s, v) => s + v * v, 0));
    const angle = Math.acos(dot / (mag1 * mag2)) * 180 / Math.PI;

    return {
      problem: input, category: 'Vectors (Dot Product)', result: fmt(dot),
      steps: [
        { description: 'Vectors', expression: `a = (${v1.join(', ')})\nb = (${v2.join(', ')})` },
        { description: 'a · b = Σ(aᵢ × bᵢ)', expression: v1.map((val, i) => `${val} × ${v2[i]}`).join(' + ') + ` = ${fmt(dot)}` },
        { description: 'Magnitudes', expression: `|a| = ${fmtDec(mag1)}, |b| = ${fmtDec(mag2)}` },
        { description: 'Angle between vectors', expression: `θ = cos⁻¹(a·b / |a||b|) = cos⁻¹(${fmt(dot)} / ${fmtDec(mag1 * mag2)}) = ${fmtDec(angle)}°` },
        { description: dot === 0 ? 'The vectors are perpendicular (orthogonal)' : 'Dot product interpretation', expression: dot > 0 ? 'Acute angle between vectors' : dot < 0 ? 'Obtuse angle between vectors' : 'Vectors are at 90°' },
      ],
      success: true,
    };
  }

  // ── CROSS PRODUCT (3D only) ──
  m = lower.match(/cross\s*product\s*(?:of\s*)?\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\)?\s*(?:and|×|x)\s*\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\)?/);
  if (m) {
    const a = [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
    const b = [parseFloat(m[4]), parseFloat(m[5]), parseFloat(m[6])];
    const cross = [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    const mag = Math.sqrt(cross.reduce((s, v) => s + v * v, 0));

    return {
      problem: input, category: 'Vectors (Cross Product)', result: `(${cross.map(fmt).join(', ')})`,
      steps: [
        { description: 'Vectors', expression: `a = (${a.join(', ')}), b = (${b.join(', ')})` },
        { description: 'Cross product formula: a × b = |i  j  k|', expression: `|${a.join('  ')}|\n|${b.join('  ')}|` },
        { description: 'i component: a₂b₃ - a₃b₂', expression: `${a[1]}×${b[2]} - ${a[2]}×${b[1]} = ${fmt(cross[0])}` },
        { description: 'j component: a₃b₁ - a₁b₃', expression: `${a[2]}×${b[0]} - ${a[0]}×${b[2]} = ${fmt(cross[1])}` },
        { description: 'k component: a₁b₂ - a₂b₁', expression: `${a[0]}×${b[1]} - ${a[1]}×${b[0]} = ${fmt(cross[2])}` },
        { description: 'Result', expression: `a × b = (${cross.map(fmt).join(', ')})` },
        { description: 'Magnitude |a × b|', expression: `= ${fmtDec(mag)} (area of parallelogram)` },
      ],
      success: true,
    };
  }

  // ── MAGNITUDE / UNIT VECTOR ──
  m = lower.match(/(?:magnitude|unit\s*vector|norm|length)\s*(?:of\s*)?\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*(?:[,\s]+\s*([-\d.]+))?\s*\)?/);
  if (m) {
    const v = [parseFloat(m[1]), parseFloat(m[2])];
    if (m[3]) v.push(parseFloat(m[3]));
    const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    const unit = v.map(x => fmtDec(x / mag));
    const isUnitVector = lower.includes('unit');

    return {
      problem: input, category: isUnitVector ? 'Vectors (Unit Vector)' : 'Vectors (Magnitude)', result: isUnitVector ? `(${unit.join(', ')})` : fmtDec(mag),
      steps: [
        { description: 'Vector', expression: `v = (${v.join(', ')})` },
        { description: '|v| = √(Σvᵢ²)', expression: `|v| = √(${v.map(x => `${x}²`).join(' + ')})` },
        { description: 'Calculate', expression: `|v| = √(${v.map(x => fmtDec(x * x)).join(' + ')}) = √${fmtDec(v.reduce((s, x) => s + x * x, 0))} = ${fmtDec(mag)}` },
        ...(isUnitVector ? [
          { description: 'Unit vector û = v/|v|', expression: `û = (${v.join(', ')}) / ${fmtDec(mag)}` },
          { description: 'Result', expression: `û = (${unit.join(', ')})` },
          { description: 'Verify |û| = 1', expression: `|û| = ${fmtDec(Math.sqrt(unit.reduce((s, x) => s + parseFloat(x) ** 2, 0)))} ≈ 1 ✓` },
        ] : []),
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// TAYLOR / MACLAURIN SERIES
// ═══════════════════════════════════════════════════════════════

export function solveTaylorSeries(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  let m = lower.match(/(?:taylor|maclaurin)\s*(?:series|expansion)?\s*(?:of|for)\s*(.+?)(?:\s*(?:at|about|around)\s*([-\d.]+))?(?:\s*(?:up\s*to|terms?\s*=?)\s*(\d+))?$/);
  if (!m) return null;

  const expr = m[1].trim();
  const a = m[2] ? parseFloat(m[2]) : 0;
  const nTerms = m[3] ? parseInt(m[3]) : 5;
  const isMaclaurin = a === 0;

  try {
    const node = math.parse(expr);
    const steps: SolutionStep[] = [
      { description: `${isMaclaurin ? 'Maclaurin' : 'Taylor'} series expansion`, expression: `f(x) = ${expr}${!isMaclaurin ? `, about a = ${a}` : ''}` },
      { description: 'Formula', expression: `f(x) = Σ f⁽ⁿ⁾(a)/n! × (x-a)ⁿ` },
    ];

    let currentDeriv: math.MathNode = node;
    const terms: string[] = [];
    const coefficients: { n: number; deriv: string; value: number; coeff: number }[] = [];

    for (let n = 0; n < nTerms; n++) {
      const value = currentDeriv.evaluate({ x: a }) as number;
      const fact = n <= 1 ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
      const coeff = value / fact;

      coefficients.push({ n, deriv: math.simplify(currentDeriv).toString(), value, coeff });

      if (Math.abs(coeff) > 1e-15) {
        if (n === 0) {
          terms.push(fmtDec(coeff));
        } else if (isMaclaurin) {
          terms.push(`${fmtDec(coeff)}x${n > 1 ? `^${n}` : ''}`);
        } else {
          terms.push(`${fmtDec(coeff)}(x-${a})${n > 1 ? `^${n}` : ''}`);
        }
      }

      if (n < nTerms - 1) {
        try {
          currentDeriv = math.derivative(currentDeriv, 'x');
        } catch { break; }
      }
    }

    coefficients.forEach(c => {
      steps.push({
        description: `n = ${c.n}: f${"'".repeat(c.n)}(${a})`,
        expression: `f${"'".repeat(c.n)}(x) = ${c.deriv} → f${"'".repeat(c.n)}(${a}) = ${fmtDec(c.value)}, coeff = ${fmtDec(c.value)}/${c.n}! = ${fmtDec(c.coeff)}`
      });
    });

    const result = terms.join(' + ').replace(/\+ -/g, '- ') + ' + ...';
    steps.push({ description: `${isMaclaurin ? 'Maclaurin' : 'Taylor'} series`, expression: `f(x) ≈ ${result}` });

    // Add common known series
    if (expr.match(/^e\s*\^\s*x$/)) {
      steps.push({ description: 'Known series for eˣ', expression: 'eˣ = 1 + x + x²/2! + x³/3! + x⁴/4! + ...' });
    } else if (expr.match(/^sin\s*\(\s*x\s*\)$/)) {
      steps.push({ description: 'Known series for sin(x)', expression: 'sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...' });
    } else if (expr.match(/^cos\s*\(\s*x\s*\)$/)) {
      steps.push({ description: 'Known series for cos(x)', expression: 'cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...' });
    } else if (expr.match(/^ln\s*\(\s*1\s*\+\s*x\s*\)$/)) {
      steps.push({ description: 'Known series for ln(1+x)', expression: 'ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... (|x| < 1)' });
    }

    return { problem: input, category: `Calculus (${isMaclaurin ? 'Maclaurin' : 'Taylor'} Series)`, result, steps, success: true };
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// LAPLACE TRANSFORMS
// ═══════════════════════════════════════════════════════════════

export function solveLaplaceTransform(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  const m = lower.match(/(?:laplace\s*(?:transform)?|ℒ)\s*(?:of\s*)?(.+)/);
  if (!m) return null;

  const expr = m[1].trim();
  const transforms: { pattern: RegExp; result: string; steps: SolutionStep[] }[] = [
    {
      pattern: /^1$/,
      result: '1/s',
      steps: [
        { description: 'Standard Laplace transform', expression: 'ℒ{1} = 1/s, s > 0' },
      ],
    },
    {
      pattern: /^t$/,
      result: '1/s²',
      steps: [
        { description: 'Standard Laplace transform', expression: 'ℒ{t} = 1/s²' },
        { description: 'General rule: ℒ{tⁿ} = n!/s^(n+1)', expression: 'n = 1: 1!/s² = 1/s²' },
      ],
    },
    {
      pattern: /^t\s*\^\s*(\d+)$/,
      result: '',
      steps: [],
    },
    {
      pattern: /^e\s*\^\s*\(\s*([-\d.]+)\s*\*?\s*t\s*\)$/,
      result: '',
      steps: [],
    },
    {
      pattern: /^sin\s*\(\s*([\d.]+)\s*\*?\s*t\s*\)$/,
      result: '',
      steps: [],
    },
    {
      pattern: /^cos\s*\(\s*([\d.]+)\s*\*?\s*t\s*\)$/,
      result: '',
      steps: [],
    },
    {
      pattern: /^t\s*\*?\s*e\s*\^\s*\(\s*([-\d.]+)\s*\*?\s*t\s*\)$/,
      result: '',
      steps: [],
    },
  ];

  // t^n
  let pm = expr.match(/^t\s*\^\s*(\d+)$/);
  if (pm) {
    const n = parseInt(pm[1]);
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    return {
      problem: input, category: 'Laplace Transform', result: `${fact}/s^${n + 1}`,
      steps: [
        { description: 'Rule: ℒ{tⁿ} = n!/s^(n+1)', expression: `n = ${n}` },
        { description: 'Calculate n!', expression: `${n}! = ${fact}` },
        { description: 'Result', expression: `ℒ{t^${n}} = ${fact}/s^${n + 1}` },
      ],
      success: true,
    };
  }

  // e^(at)
  pm = expr.match(/^e\s*\^\s*\(?\s*([-\d.]+)\s*\*?\s*t\s*\)?$/);
  if (pm) {
    const a = parseFloat(pm[1]);
    return {
      problem: input, category: 'Laplace Transform', result: `1/(s - ${fmt(a)})`,
      steps: [
        { description: 'Rule: ℒ{e^(at)} = 1/(s-a)', expression: `a = ${a}` },
        { description: 'Result', expression: `ℒ{e^(${a}t)} = 1/(s - ${fmt(a)}), s > ${fmt(a)}` },
      ],
      success: true,
    };
  }

  // sin(wt)
  pm = expr.match(/^sin\s*\(\s*([\d.]+)\s*\*?\s*t\s*\)$/);
  if (pm) {
    const w = parseFloat(pm[1]);
    return {
      problem: input, category: 'Laplace Transform', result: `${fmt(w)}/(s² + ${fmtDec(w * w)})`,
      steps: [
        { description: 'Rule: ℒ{sin(ωt)} = ω/(s² + ω²)', expression: `ω = ${w}` },
        { description: 'Result', expression: `ℒ{sin(${w}t)} = ${fmt(w)}/(s² + ${fmtDec(w * w)})` },
      ],
      success: true,
    };
  }

  // cos(wt)
  pm = expr.match(/^cos\s*\(\s*([\d.]+)\s*\*?\s*t\s*\)$/);
  if (pm) {
    const w = parseFloat(pm[1]);
    return {
      problem: input, category: 'Laplace Transform', result: `s/(s² + ${fmtDec(w * w)})`,
      steps: [
        { description: 'Rule: ℒ{cos(ωt)} = s/(s² + ω²)', expression: `ω = ${w}` },
        { description: 'Result', expression: `ℒ{cos(${w}t)} = s/(s² + ${fmtDec(w * w)})` },
      ],
      success: true,
    };
  }

  // Generic table
  for (const t of transforms) {
    if (expr.match(t.pattern) && t.result) {
      return { problem: input, category: 'Laplace Transform', result: t.result, steps: t.steps, success: true };
    }
  }

  // If no specific match, show common transforms table
  return {
    problem: input, category: 'Laplace Transform', result: 'See transform table',
    steps: [
      { description: 'Common Laplace Transforms', expression: `ℒ{1} = 1/s\nℒ{t} = 1/s²\nℒ{tⁿ} = n!/s^(n+1)\nℒ{e^(at)} = 1/(s-a)\nℒ{sin(ωt)} = ω/(s²+ω²)\nℒ{cos(ωt)} = s/(s²+ω²)` },
      { description: 'Properties', expression: `Linearity: ℒ{af+bg} = aℒ{f}+bℒ{g}\nFirst shift: ℒ{e^(at)f(t)} = F(s-a)\nDerivative: ℒ{f'(t)} = sF(s) - f(0)\nIntegral: ℒ{∫f(τ)dτ} = F(s)/s` },
      { description: 'Try entering a specific function', expression: 'Examples: laplace of sin(3t), laplace of e^(-2t), laplace of t^4' },
    ],
    success: true,
  };
}

// ═══════════════════════════════════════════════════════════════
// MATRIX OPERATIONS (Enhanced)
// ═══════════════════════════════════════════════════════════════

export function solveMatrixOperations(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── EIGENVALUES 2x2 ──
  let m = lower.match(/eigenvalue[s]?\s*(?:of\s*)?(?:matrix\s*)?\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    const c = parseFloat(m[3]), d = parseFloat(m[4]);
    const trace = a + d;
    const det = a * d - b * c;
    const disc = trace * trace - 4 * det;

    const steps: SolutionStep[] = [
      { description: '2×2 Matrix', expression: `| ${a}  ${b} |\n| ${c}  ${d} |` },
      { description: 'Characteristic equation: det(A - λI) = 0', expression: `λ² - tr(A)λ + det(A) = 0` },
      { description: 'Trace and determinant', expression: `tr(A) = ${a} + ${d} = ${fmt(trace)}\ndet(A) = ${a}×${d} - ${b}×${c} = ${fmt(det)}` },
      { description: 'Characteristic equation', expression: `λ² - ${fmt(trace)}λ + ${fmt(det)} = 0` },
      { description: 'Discriminant', expression: `Δ = ${fmt(trace)}² - 4(${fmt(det)}) = ${fmtDec(disc)}` },
    ];

    if (disc >= 0) {
      const l1 = (trace + Math.sqrt(disc)) / 2;
      const l2 = (trace - Math.sqrt(disc)) / 2;
      steps.push({ description: 'Eigenvalues', expression: `λ₁ = ${fmtDec(l1)}\nλ₂ = ${fmtDec(l2)}` });
      steps.push({ description: 'Verify: λ₁ + λ₂ = trace, λ₁ × λ₂ = det', expression: `${fmtDec(l1)} + ${fmtDec(l2)} = ${fmtDec(l1 + l2)} ≈ ${fmt(trace)} ✓\n${fmtDec(l1)} × ${fmtDec(l2)} = ${fmtDec(l1 * l2)} ≈ ${fmt(det)} ✓` });
      return { problem: input, category: 'Linear Algebra (Eigenvalues)', result: `λ₁ = ${fmtDec(l1)}, λ₂ = ${fmtDec(l2)}`, steps, success: true };
    } else {
      const re = trace / 2;
      const im = Math.sqrt(-disc) / 2;
      steps.push({ description: 'Complex eigenvalues', expression: `λ = ${fmtDec(re)} ± ${fmtDec(im)}i` });
      return { problem: input, category: 'Linear Algebra (Eigenvalues)', result: `λ = ${fmtDec(re)} ± ${fmtDec(im)}i`, steps, success: true };
    }
  }

  // ── MATRIX MULTIPLICATION 2x2 ──
  m = lower.match(/(?:matrix\s*)?(?:multiply|multiplication|product)\s*\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?\s*(?:×|x|\*|by|and)\s*\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const A = [[parseFloat(m[1]), parseFloat(m[2])], [parseFloat(m[3]), parseFloat(m[4])]];
    const B = [[parseFloat(m[5]), parseFloat(m[6])], [parseFloat(m[7]), parseFloat(m[8])]];
    const C = [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
    ];

    return {
      problem: input, category: 'Linear Algebra (Matrix Multiplication)', result: `[${C[0].map(fmt).join(', ')}; ${C[1].map(fmt).join(', ')}]`,
      steps: [
        { description: 'Matrix A', expression: `| ${A[0].join('  ')} |\n| ${A[1].join('  ')} |` },
        { description: 'Matrix B', expression: `| ${B[0].join('  ')} |\n| ${B[1].join('  ')} |` },
        { description: 'C₁₁ = Row1(A) · Col1(B)', expression: `${A[0][0]}×${B[0][0]} + ${A[0][1]}×${B[1][0]} = ${fmt(C[0][0])}` },
        { description: 'C₁₂ = Row1(A) · Col2(B)', expression: `${A[0][0]}×${B[0][1]} + ${A[0][1]}×${B[1][1]} = ${fmt(C[0][1])}` },
        { description: 'C₂₁ = Row2(A) · Col1(B)', expression: `${A[1][0]}×${B[0][0]} + ${A[1][1]}×${B[1][0]} = ${fmt(C[1][0])}` },
        { description: 'C₂₂ = Row2(A) · Col2(B)', expression: `${A[1][0]}×${B[0][1]} + ${A[1][1]}×${B[1][1]} = ${fmt(C[1][1])}` },
        { description: 'Result C = A × B', expression: `| ${C[0].map(fmt).join('  ')} |\n| ${C[1].map(fmt).join('  ')} |` },
      ],
      success: true,
    };
  }

  // ── TRANSPOSE ──
  m = lower.match(/transpose\s*(?:of\s*)?(?:matrix\s*)?\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    const c = parseFloat(m[3]), d = parseFloat(m[4]);
    return {
      problem: input, category: 'Linear Algebra (Transpose)', result: `[${a}, ${c}; ${b}, ${d}]`,
      steps: [
        { description: 'Original matrix A', expression: `| ${a}  ${b} |\n| ${c}  ${d} |` },
        { description: 'Transpose: swap rows and columns', expression: `Aᵀᵢⱼ = Aⱼᵢ` },
        { description: 'Result Aᵀ', expression: `| ${a}  ${c} |\n| ${b}  ${d} |` },
      ],
      success: true,
    };
  }

  // ── 3x3 DETERMINANT ──
  m = lower.match(/(?:determinant|det)\s*(?:of\s*)?(?:3\s*x\s*3\s*)?(?:matrix\s*)?\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const M = [
      [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])],
      [parseFloat(m[4]), parseFloat(m[5]), parseFloat(m[6])],
      [parseFloat(m[7]), parseFloat(m[8]), parseFloat(m[9])],
    ];
    const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
      - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
      + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);

    return {
      problem: input, category: 'Linear Algebra (3×3 Determinant)', result: fmt(det),
      steps: [
        { description: '3×3 Matrix', expression: `| ${M[0].join('  ')} |\n| ${M[1].join('  ')} |\n| ${M[2].join('  ')} |` },
        { description: 'Cofactor expansion along first row', expression: `det = a₁₁(a₂₂a₃₃-a₂₃a₃₂) - a₁₂(a₂₁a₃₃-a₂₃a₃₁) + a₁₃(a₂₁a₃₂-a₂₂a₃₁)` },
        { description: 'First minor', expression: `${M[0][0]} × (${M[1][1]}×${M[2][2]} - ${M[1][2]}×${M[2][1]}) = ${M[0][0]} × ${fmt(M[1][1] * M[2][2] - M[1][2] * M[2][1])} = ${fmt(M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]))}` },
        { description: 'Second minor', expression: `-${M[0][1]} × (${M[1][0]}×${M[2][2]} - ${M[1][2]}×${M[2][0]}) = -${M[0][1]} × ${fmt(M[1][0] * M[2][2] - M[1][2] * M[2][0])} = ${fmt(-M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]))}` },
        { description: 'Third minor', expression: `${M[0][2]} × (${M[1][0]}×${M[2][1]} - ${M[1][1]}×${M[2][0]}) = ${M[0][2]} × ${fmt(M[1][0] * M[2][1] - M[1][1] * M[2][0])} = ${fmt(M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))}` },
        { description: 'Determinant', expression: `det = ${fmt(det)}` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// PARTIAL FRACTIONS
// ═══════════════════════════════════════════════════════════════

export function solvePartialFractions(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  const m = lower.match(/partial\s*fraction[s]?\s*(?:of|for|decompos\w*)?\s*(.+)/);
  if (!m) return null;

  const expr = m[1].trim();

  // ── 1/((x-a)(x-b)) ──
  let pm = expr.match(/1\s*\/\s*\(\s*\(\s*x\s*([+-]\s*\d+)\s*\)\s*\(\s*x\s*([+-]\s*\d+)\s*\)\s*\)/);
  if (!pm) {
    pm = expr.match(/1\s*\/\s*\(\s*\(\s*x\s*([+-]\s*\d+)\s*\)\s*\*?\s*\(\s*x\s*([+-]\s*\d+)\s*\)\s*\)/);
  }
  if (pm) {
    const a = -parseFloat(pm[1].replace(/\s/g, ''));
    const b = -parseFloat(pm[2].replace(/\s/g, ''));
    if (a !== b) {
      const A = 1 / (a - b);
      const B = 1 / (b - a);
      return {
        problem: input, category: 'Partial Fractions', result: `${fmtDec(A)}/(x-${fmt(a)}) + ${fmtDec(B)}/(x-${fmt(b)})`,
        steps: [
          { description: 'Express as partial fractions', expression: `1/((x-${a})(x-${b})) = A/(x-${a}) + B/(x-${b})` },
          { description: 'Multiply both sides by (x-a)(x-b)', expression: `1 = A(x-${b}) + B(x-${a})` },
          { description: `Set x = ${a} (to find A)`, expression: `1 = A(${a}-${b}) → A = 1/${fmt(a - b)} = ${fmtDec(A)}` },
          { description: `Set x = ${b} (to find B)`, expression: `1 = B(${b}-${a}) → B = 1/${fmt(b - a)} = ${fmtDec(B)}` },
          { description: 'Result', expression: `= ${fmtDec(A)}/(x-${fmt(a)}) + ${fmtDec(B)}/(x-${fmt(b)})` },
        ],
        success: true,
      };
    }
  }

  // General guidance
  return {
    problem: input, category: 'Partial Fractions', result: 'See decomposition method',
    steps: [
      { description: 'Partial Fraction Decomposition', expression: `Expression: ${expr}` },
      { description: 'Step 1: Factor the denominator', expression: 'Find all roots of the denominator' },
      { description: 'Step 2: Set up partial fractions', expression: 'For distinct linear factors (x-a)(x-b):\n  → A/(x-a) + B/(x-b)\nFor repeated factor (x-a)²:\n  → A/(x-a) + B/(x-a)²\nFor irreducible quadratic (x²+bx+c):\n  → (Ax+B)/(x²+bx+c)' },
      { description: 'Step 3: Multiply through and solve', expression: 'Clear denominators, substitute convenient values to find A, B, C...' },
      { description: 'Example format', expression: 'Try: partial fractions of 1/((x-1)(x+2))' },
    ],
    success: true,
  };
}

// ═══════════════════════════════════════════════════════════════
// COLLEGE EXAMPLES
// ═══════════════════════════════════════════════════════════════

export const collegeExampleProblems = [
  {
    category: 'Integration',
    icon: '∫',
    problems: [
      'integrate x^3',
      'integrate sin(x)',
      'integrate e^x',
      'integrate 1/x',
      'integrate cos(2x)',
      'integrate ln(x)',
      'integrate x^3 from 0 to 2',
      'integrate sin(x) from 0 to 3.14159',
    ]
  },
  {
    category: 'Differentiation (Advanced)',
    icon: 'δ',
    problems: [
      'second derivative of x^4 + 3x^2',
      'third derivative of x^5',
      'partial derivative of x^2*y + y^3 wrt x',
      'partial derivative of x^2*y + y^3 wrt y',
      'derivative of x^3 - 6x^2 + 9x at x = 2',
      'implicit differentiation of x^2 + y^2 = 25',
      'critical points of x^3 - 3x + 1',
    ]
  },
  {
    category: 'Limits',
    icon: 'lim',
    problems: [
      'limit of sin(x)/x as x approaches 0',
      'limit of (x^2 - 1)/(x - 1) as x approaches 1',
      'limit of 1/x as x approaches infinity',
      'limit of e^(-x) as x approaches infinity',
      'limit of (1 + 1/x)^x as x approaches infinity',
    ]
  },
  {
    category: 'Complex Numbers',
    icon: 'ℂ',
    problems: [
      'modulus of 3 + 4i',
      'argument of 1 + 1i',
      'polar form of 3 + 4i',
      'multiply (2 + 3i) and (1 - 2i)',
      'divide (4 + 2i) by (1 + i)',
    ]
  },
  {
    category: 'Differential Equations',
    icon: 'dy',
    problems: [
      "y'' - 4y' + 3y = 0",
      "y'' + 4y = 0",
      "y' + 3y = 6",
      "dy/dx = 2xy",
    ]
  },
  {
    category: 'Vectors',
    icon: '→',
    problems: [
      'dot product of (1, 2, 3) and (4, 5, 6)',
      'cross product of (1, 0, 0) and (0, 1, 0)',
      'magnitude of (3, 4, 5)',
      'unit vector of (3, 4)',
    ]
  },
  {
    category: 'Taylor Series',
    icon: 'Σ',
    problems: [
      'taylor series of e^x',
      'maclaurin series of sin(x)',
      'taylor series of cos(x)',
      'taylor series of ln(1+x)',
    ]
  },
  {
    category: 'Laplace Transform',
    icon: 'ℒ',
    problems: [
      'laplace of 1',
      'laplace of t^3',
      'laplace of e^(-2t)',
      'laplace of sin(3t)',
      'laplace of cos(5t)',
    ]
  },
  {
    category: 'Linear Algebra',
    icon: '⊞',
    problems: [
      'eigenvalues of 4, 1; 2, 3',
      'matrix multiply [2, 1; 0, 3] x [1, 2; 3, 4]',
      'transpose of matrix 1, 2; 3, 4',
      'determinant of 3x3 matrix 1,2,3; 4,5,6; 7,8,0',
    ]
  },
  {
    category: 'Partial Fractions',
    icon: '⅟',
    problems: [
      'partial fractions of 1/((x-1)(x+2))',
      'partial fractions of 1/((x-2)(x-3))',
    ]
  },
];
