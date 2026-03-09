import * as math from 'mathjs';
import {
  solveStatistics,
  solveProbability,
  solveSimultaneous,
  solveBearing,
  solveLongitudeLatitude,
  solveSequences,
  solveSets,
  solveMatrices,
  solveMensuration,
  solveRatio,
  solveInterest,
  advancedExampleProblems,
} from './advancedSolvers';
import {
  solveCollegeDerivative,
  solveIntegration,
  solveLimit,
  solveComplexNumbers,
  solveDiffEquation,
  solveVectors,
  solveTaylorSeries,
  solveLaplaceTransform,
  solveMatrixOperations,
  solvePartialFractions,
  collegeExampleProblems,
} from './collegeSolvers';

export interface SolutionStep {
  description: string;
  expression: string;
}

export interface Solution {
  problem: string;
  category: string;
  result: string;
  steps: SolutionStep[];
  success: boolean;
  error?: string;
}

// ─── helpers ───────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(8)).toString();
}

function isClose(a: number, b: number, tol = 1e-9) {
  return Math.abs(a - b) < tol;
}

// ─── solvers ───────────────────────────────────────────────────────────

function solveArithmetic(input: string): Solution | null {
  const expr = input.trim();
  try {
    const result = math.evaluate(expr);
    if (typeof result === 'number' || typeof result === 'object') {
      const steps: SolutionStep[] = [];
      const numResult = typeof result === 'number' ? result : Number(result);

      const tokens = expr.match(/[\d.]+|[+\-*/^()]/g);
      if (tokens) {
        steps.push({ description: 'Start with the expression', expression: expr });
        if (expr.includes('(')) {
          steps.push({ description: 'Evaluate expressions inside parentheses first (PEMDAS/BODMAS)', expression: expr });
        }
        if (expr.includes('^') || expr.includes('**')) {
          steps.push({ description: 'Apply exponentiation (Powers)', expression: expr });
        }
        if (expr.includes('*') || expr.includes('/')) {
          steps.push({ description: 'Perform multiplication and division (left to right)', expression: expr });
        }
        if (expr.includes('+') || expr.match(/(?<!^)-/)) {
          steps.push({ description: 'Perform addition and subtraction (left to right)', expression: expr });
        }
        steps.push({ description: 'Final result', expression: `${expr} = ${fmt(numResult)}` });
      }

      return { problem: expr, category: 'Arithmetic', result: fmt(numResult), steps, success: true };
    }
  } catch {
    // not arithmetic
  }
  return null;
}

function solvePercentage(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  let m = lower.match(/what\s+is\s+([\d.]+)\s*%\s*of\s+([\d.]+)/);
  if (m) {
    const pct = parseFloat(m[1]);
    const base = parseFloat(m[2]);
    const result = (pct / 100) * base;
    return {
      problem: input, category: 'Percentage', result: fmt(result),
      steps: [
        { description: 'Identify the percentage and the base number', expression: `${pct}% of ${base}` },
        { description: 'Convert the percentage to a decimal', expression: `${pct}% = ${pct} ÷ 100 = ${fmt(pct / 100)}` },
        { description: 'Multiply the decimal by the base number', expression: `${fmt(pct / 100)} × ${base} = ${fmt(result)}` },
        { description: 'Final answer', expression: `${pct}% of ${base} = ${fmt(result)}` },
      ],
      success: true,
    };
  }

  m = lower.match(/([\d.]+)\s+is\s+what\s+percent\s+of\s+([\d.]+)/);
  if (m) {
    const part = parseFloat(m[1]);
    const whole = parseFloat(m[2]);
    const result = (part / whole) * 100;
    return {
      problem: input, category: 'Percentage', result: `${fmt(result)}%`,
      steps: [
        { description: 'Identify the part and the whole', expression: `Part = ${part}, Whole = ${whole}` },
        { description: 'Divide the part by the whole', expression: `${part} ÷ ${whole} = ${fmt(part / whole)}` },
        { description: 'Multiply by 100', expression: `${fmt(part / whole)} × 100 = ${fmt(result)}%` },
      ],
      success: true,
    };
  }

  m = lower.match(/percentage\s+(increase|decrease|change)\s+from\s+([\d.]+)\s+to\s+([\d.]+)/);
  if (m) {
    const oldVal = parseFloat(m[2]);
    const newVal = parseFloat(m[3]);
    const change = newVal - oldVal;
    const pctChange = (change / oldVal) * 100;
    const direction = pctChange >= 0 ? 'increase' : 'decrease';
    return {
      problem: input, category: 'Percentage', result: `${fmt(Math.abs(pctChange))}% ${direction}`,
      steps: [
        { description: 'Find the difference', expression: `${newVal} - ${oldVal} = ${fmt(change)}` },
        { description: 'Divide by the original value', expression: `${fmt(change)} ÷ ${oldVal} = ${fmt(change / oldVal)}` },
        { description: 'Multiply by 100', expression: `${fmt(change / oldVal)} × 100 = ${fmt(pctChange)}%` },
        { description: 'Final answer', expression: `${fmt(Math.abs(pctChange))}% ${direction}` },
      ],
      success: true,
    };
  }

  return null;
}

function solveLinearEquation(input: string): Solution | null {
  const lower = input.toLowerCase().replace(/\s+/g, '');
  const eqMatch = lower.match(/^([^=]+)=([^=]+)$/);
  if (!eqMatch) return null;
  const lhs = eqMatch[1];
  const rhs = eqMatch[2];
  const varMatch = lower.match(/[a-z]/);
  if (!varMatch) return null;
  const variable = varMatch[0];
  if (lower.includes(variable + '^2') || lower.includes(variable + '²')) return null;

  try {
    const node = math.parse(`${lhs} - (${rhs})`);
    const simplified = math.simplify(node);
    const scope0: Record<string, number> = {}; scope0[variable] = 0;
    const scope1: Record<string, number> = {}; scope1[variable] = 1;

    const atZero = simplified.evaluate(scope0) as number;
    const atOne = simplified.evaluate(scope1) as number;
    const coefficient = atOne - atZero;
    const constant = atZero;

    if (isClose(coefficient, 0)) {
      return {
        problem: input, category: 'Linear Equation',
        result: isClose(constant, 0) ? 'Infinite solutions' : 'No solution',
        steps: [{ description: 'The equation simplifies to a contradiction or identity', expression: isClose(constant, 0) ? 'Any value works' : `${fmt(constant)} ≠ 0` }],
        success: true,
      };
    }

    const solution = -constant / coefficient;
    return {
      problem: input, category: 'Linear Equation', result: `${variable} = ${fmt(solution)}`,
      steps: [
        { description: 'Write the equation', expression: input.trim() },
        { description: 'Move all terms to one side', expression: `${lhs} - (${rhs}) = 0` },
        { description: 'Combine like terms', expression: `${fmt(coefficient)}${variable} + ${fmt(constant)} = 0` },
        { description: `Isolate ${variable}`, expression: `${fmt(coefficient)}${variable} = ${fmt(-constant)}` },
        { description: `Divide both sides by ${fmt(coefficient)}`, expression: `${variable} = ${fmt(-constant)} ÷ ${fmt(coefficient)} = ${fmt(solution)}` },
      ],
      success: true,
    };
  } catch {
    return null;
  }
}

function solveQuadratic(input: string): Solution | null {
  const lower = input.toLowerCase().replace(/\s+/g, '');
  const eqMatch = lower.match(/^([^=]+)=([^=]+)$/);
  if (!eqMatch) return null;
  const lhs = eqMatch[1];
  const rhs = eqMatch[2];
  const varMatch = lower.match(/[a-z]/);
  if (!varMatch) return null;
  const v = varMatch[0];
  if (!lower.includes(v + '^2') && !lower.includes(v + '²') && !lower.includes(v + '*' + v)) return null;

  try {
    const expr = `${lhs} - (${rhs})`;
    const node = math.parse(expr.replace(/²/g, '^2'));
    const simplified = math.simplify(node);

    const s0: Record<string, number> = {}; s0[v] = 0;
    const s1: Record<string, number> = {}; s1[v] = 1;
    const s2: Record<string, number> = {}; s2[v] = -1;

    const f0 = simplified.evaluate(s0) as number;
    const f1 = simplified.evaluate(s1) as number;
    const fm1 = simplified.evaluate(s2) as number;

    const c = f0;
    const a = (f1 + fm1 - 2 * c) / 2;
    const b = f1 - a - c;
    const discriminant = b * b - 4 * a * c;

    const steps: SolutionStep[] = [
      { description: 'Standard form', expression: `${fmt(a)}${v}² + ${fmt(b)}${v} + ${fmt(c)} = 0` },
      { description: 'Identify coefficients', expression: `a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}` },
      { description: 'Discriminant (Δ = b² - 4ac)', expression: `Δ = (${fmt(b)})² - 4(${fmt(a)})(${fmt(c)}) = ${fmt(discriminant)}` },
    ];

    if (discriminant < 0) {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      steps.push({ description: 'Δ < 0 → complex roots', expression: `${v} = ${fmt(realPart)} ± ${fmt(Math.abs(imagPart))}i` });
      return { problem: input, category: 'Quadratic Equation', result: `${v} = ${fmt(realPart)} ± ${fmt(Math.abs(imagPart))}i`, steps, success: true };
    }

    if (isClose(discriminant, 0)) {
      const root = -b / (2 * a);
      steps.push({ description: 'Δ = 0 → one repeated root', expression: `${v} = -b/(2a) = ${fmt(root)}` });
      return { problem: input, category: 'Quadratic Equation', result: `${v} = ${fmt(root)} (repeated)`, steps, success: true };
    }

    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    steps.push({ description: 'Δ > 0 → two real roots', expression: `√Δ = ${fmt(sqrtD)}` });
    steps.push({ description: 'Apply quadratic formula', expression: `${v} = (-b ± √Δ) / (2a)` });
    steps.push({ description: 'First root', expression: `${v}₁ = (-${fmt(b)} + ${fmt(sqrtD)}) / ${fmt(2 * a)} = ${fmt(x1)}` });
    steps.push({ description: 'Second root', expression: `${v}₂ = (-${fmt(b)} - ${fmt(sqrtD)}) / ${fmt(2 * a)} = ${fmt(x2)}` });

    return { problem: input, category: 'Quadratic Equation', result: `${v}₁ = ${fmt(x1)}, ${v}₂ = ${fmt(x2)}`, steps, success: true };
  } catch {
    return null;
  }
}

function solveDerivative(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  const m = lower.match(/(?:derivative|differentiate|d\/dx|diff)\s*(?:of\s*)?\(?\s*(.+?)\s*\)?$/);
  if (!m) return null;
  const expr = m[1].replace(/\)$/, '');

  try {
    const node = math.parse(expr);
    const derivative = math.derivative(node, 'x');
    const simplified = math.simplify(derivative);
    return {
      problem: input, category: 'Calculus (Derivative)', result: simplified.toString(),
      steps: [
        { description: 'Function', expression: `f(x) = ${expr}` },
        { description: 'Differentiate', expression: `f'(x) = d/dx [${expr}]` },
        { description: 'Apply rules', expression: `f'(x) = ${derivative.toString()}` },
        { description: 'Simplify', expression: `f'(x) = ${simplified.toString()}` },
      ],
      success: true,
    };
  } catch {
    return null;
  }
}

function solveFactorial(input: string): Solution | null {
  const m = input.trim().match(/^(\d+)\s*!$/) || input.toLowerCase().trim().match(/factorial\s+(?:of\s+)?(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1]);
  if (n < 0 || n > 170) return null;

  const steps: SolutionStep[] = [{ description: 'n! = n × (n-1) × ... × 1', expression: `${n}!` }];

  if (n <= 1) {
    steps.push({ description: 'By definition', expression: `${n}! = 1` });
    return { problem: input, category: 'Factorial', result: '1', steps, success: true };
  }

  let result = 1;
  const factors: string[] = [];
  for (let i = n; i >= 1; i--) { factors.push(i.toString()); result *= i; }
  steps.push({ description: 'Expand', expression: `${n}! = ${factors.join(' × ')}` });
  steps.push({ description: 'Result', expression: `${n}! = ${result}` });

  return { problem: input, category: 'Factorial', result: result.toString(), steps, success: true };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function solveGCDLCM(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  let m = lower.match(/(?:gcd|hcf|greatest\s+common\s+(?:divisor|factor))\s*(?:of\s*)?\(?\s*(\d+)\s*[,\s]+\s*(\d+)\s*\)?/);
  if (m) {
    const a = parseInt(m[1]), b = parseInt(m[2]);
    const steps: SolutionStep[] = [{ description: 'Euclidean Algorithm', expression: `GCD(${a}, ${b})` }];
    let x = Math.abs(a), y = Math.abs(b);
    while (y !== 0) {
      const r = x % y;
      steps.push({ description: 'Divide', expression: `${x} = ${Math.floor(x / y)} × ${y} + ${r}` });
      x = y; y = r;
    }
    steps.push({ description: 'GCD', expression: `GCD(${a}, ${b}) = ${x}` });
    return { problem: input, category: 'GCD', result: x.toString(), steps, success: true };
  }

  m = lower.match(/(?:lcm|least\s+common\s+multiple)\s*(?:of\s*)?\(?\s*(\d+)\s*[,\s]+\s*(\d+)\s*\)?/);
  if (m) {
    const a = parseInt(m[1]), b = parseInt(m[2]);
    const g = gcd(a, b);
    const lcm = (a * b) / g;
    return {
      problem: input, category: 'LCM', result: lcm.toString(),
      steps: [
        { description: 'LCM(a,b) = |a×b| / GCD(a,b)', expression: `LCM(${a}, ${b})` },
        { description: 'Find GCD', expression: `GCD(${a}, ${b}) = ${g}` },
        { description: 'Calculate', expression: `LCM = |${a} × ${b}| / ${g} = ${Math.abs(a * b)} / ${g} = ${lcm}` },
      ],
      success: true,
    };
  }

  return null;
}

function solveTrigonometry(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  const m = lower.match(/(sin|cos|tan|cot|sec|csc|asin|acos|atan|arcsin|arccos|arctan)\s*\(?\s*([\d.]+)\s*(degrees?|deg|°|radians?|rad)?\s*\)?/);
  if (!m) return null;

  let func = m[1];
  const value = parseFloat(m[2]);
  const unit = m[3] || 'radians';
  const isDegrees = unit.startsWith('deg') || unit === '°';
  const angleInRad = isDegrees ? (value * Math.PI) / 180 : value;

  const steps: SolutionStep[] = [{ description: 'Identify', expression: `${func}(${value}${isDegrees ? '°' : ' rad'})` }];
  if (isDegrees) steps.push({ description: 'Convert to radians', expression: `${value}° = ${fmt(angleInRad)} rad` });

  const isInverse = func.startsWith('a') || func.startsWith('arc');
  if (isInverse) func = func.replace('arc', 'a');

  let result: number;
  switch (func) {
    case 'sin': result = Math.sin(angleInRad); break;
    case 'cos': result = Math.cos(angleInRad); break;
    case 'tan': result = Math.tan(angleInRad); break;
    case 'cot': result = 1 / Math.tan(angleInRad); break;
    case 'sec': result = 1 / Math.cos(angleInRad); break;
    case 'csc': result = 1 / Math.sin(angleInRad); break;
    case 'asin': result = Math.asin(value); break;
    case 'acos': result = Math.acos(value); break;
    case 'atan': result = Math.atan(value); break;
    default: return null;
  }

  steps.push({ description: `Evaluate`, expression: `${func}(${isDegrees ? value + '°' : fmt(angleInRad)}) = ${fmt(result)}` });
  if (isInverse) steps.push({ description: 'In degrees', expression: `${fmt((result * 180) / Math.PI)}°` });

  return { problem: input, category: 'Trigonometry', result: fmt(result), steps, success: true };
}

function solvePrimeFactors(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  const m = lower.match(/(?:prime\s+factor(?:s|ization|ize)?|factori[sz]e)\s*(?:of\s*)?\(?\s*(\d+)\s*\)?/);
  if (!m) return null;

  let n = parseInt(m[1]);
  if (n < 2) return null;
  const original = n;
  const factors: number[] = [];
  const steps: SolutionStep[] = [{ description: 'Find prime factors', expression: `Factorize ${n}` }];

  for (let d = 2; d * d <= n; d++) {
    while (n % d === 0) {
      factors.push(d);
      steps.push({ description: `${n} ÷ ${d}`, expression: `${n} / ${d} = ${n / d}` });
      n = n / d;
    }
  }
  if (n > 1) { factors.push(n); steps.push({ description: `${n} is prime`, expression: `Factor: ${n}` }); }

  const result = factors.join(' × ');
  steps.push({ description: 'Prime factorization', expression: `${original} = ${result}` });
  return { problem: input, category: 'Prime Factorization', result, steps, success: true };
}

function solvePower(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  let m = lower.match(/([\d.]+)\s*(?:\^|\*\*|to\s+the\s+power\s+(?:of\s+)?)([\d.]+)/);
  if (m) {
    const base = parseFloat(m[1]), exp = parseFloat(m[2]);
    const result = Math.pow(base, exp);
    return {
      problem: input, category: 'Exponentiation', result: fmt(result),
      steps: [
        { description: 'Base and exponent', expression: `${base}^${exp}` },
        { description: 'Calculate', expression: `${base}^${exp} = ${fmt(result)}` },
      ],
      success: true,
    };
  }

  m = lower.match(/(?:sqrt|square\s*root|√)\s*\(?\s*([\d.]+)\s*\)?/);
  if (m) {
    const n = parseFloat(m[1]);
    const result = Math.sqrt(n);
    return {
      problem: input, category: 'Square Root', result: fmt(result),
      steps: [
        { description: 'Find √' + n, expression: `y² = ${n}` },
        { description: 'Calculate', expression: `√${n} = ${fmt(result)}` },
        { description: 'Verify', expression: `${fmt(result)}² = ${fmt(result * result)}` },
      ],
      success: true,
    };
  }

  m = lower.match(/(?:cbrt|cube\s*root|∛)\s*\(?\s*([\d.]+)\s*\)?/);
  if (m) {
    const n = parseFloat(m[1]);
    const result = Math.cbrt(n);
    return {
      problem: input, category: 'Cube Root', result: fmt(result),
      steps: [
        { description: 'Find ∛' + n, expression: `y³ = ${n}` },
        { description: 'Calculate', expression: `∛${n} = ${fmt(result)}` },
      ],
      success: true,
    };
  }

  return null;
}

function solveLogarithm(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  let m = lower.match(/log\s*(?:base\s*)?(\d+)\s*(?:of\s*)?\(?\s*([\d.]+)\s*\)?/);
  if (m) {
    const base = parseFloat(m[1]), x = parseFloat(m[2]);
    const result = Math.log(x) / Math.log(base);
    return {
      problem: input, category: 'Logarithm', result: fmt(result),
      steps: [
        { description: 'Change of base', expression: `log_${base}(${x}) = ln(${x}) / ln(${base})` },
        { description: 'Calculate', expression: `= ${fmt(Math.log(x))} / ${fmt(Math.log(base))} = ${fmt(result)}` },
        { description: 'Verify', expression: `${base}^${fmt(result)} ≈ ${fmt(Math.pow(base, result))}` },
      ],
      success: true,
    };
  }

  m = lower.match(/(?:ln|natural\s*log)\s*\(?\s*([\d.]+)\s*\)?/);
  if (m) {
    const x = parseFloat(m[1]);
    const result = Math.log(x);
    return {
      problem: input, category: 'Logarithm', result: fmt(result),
      steps: [
        { description: 'Natural logarithm (base e)', expression: `ln(${x})` },
        { description: 'Calculate', expression: `ln(${x}) = ${fmt(result)}` },
        { description: 'Verify', expression: `e^${fmt(result)} ≈ ${fmt(Math.exp(result))}` },
      ],
      success: true,
    };
  }

  m = lower.match(/log\s*\(?\s*([\d.]+)\s*\)?/);
  if (m) {
    const x = parseFloat(m[1]);
    const result = Math.log10(x);
    return {
      problem: input, category: 'Logarithm', result: fmt(result),
      steps: [
        { description: 'Common log (base 10)', expression: `log₁₀(${x})` },
        { description: 'Calculate', expression: `log₁₀(${x}) = ${fmt(result)}` },
        { description: 'Verify', expression: `10^${fmt(result)} ≈ ${fmt(Math.pow(10, result))}` },
      ],
      success: true,
    };
  }

  return null;
}

function solveSystemOfEquations(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  const m = lower.match(/(.+?=.+?)(?:and|,|;)\s*(.+?=.+?)$/);
  if (!m) return null;

  const eq1str = m[1].trim();
  const eq2str = m[2].trim();

  try {
    const eq1parts = eq1str.split('=');
    const eq2parts = eq2str.split('=');
    const expr1 = `(${eq1parts[0]}) - (${eq1parts[1]})`;
    const expr2 = `(${eq2parts[0]}) - (${eq2parts[1]})`;

    const node1 = math.parse(expr1);
    const node2 = math.parse(expr2);

    const f1_00 = node1.evaluate({ x: 0, y: 0 }) as number;
    const f1_10 = node1.evaluate({ x: 1, y: 0 }) as number;
    const f1_01 = node1.evaluate({ x: 0, y: 1 }) as number;
    const f2_00 = node2.evaluate({ x: 0, y: 0 }) as number;
    const f2_10 = node2.evaluate({ x: 1, y: 0 }) as number;
    const f2_01 = node2.evaluate({ x: 0, y: 1 }) as number;

    const a1 = f1_10 - f1_00, b1 = f1_01 - f1_00, c1 = -f1_00;
    const a2 = f2_10 - f2_00, b2 = f2_01 - f2_00, c2 = -f2_00;
    const det = a1 * b2 - a2 * b1;

    if (isClose(det, 0)) {
      return { problem: input, category: 'System of Equations', result: 'No unique solution', steps: [{ description: 'det = 0', expression: 'Parallel or identical lines' }], success: true };
    }

    const xSol = (c1 * b2 - c2 * b1) / det;
    const ySol = (a1 * c2 - a2 * c1) / det;

    return {
      problem: input, category: 'System of Equations', result: `x = ${fmt(xSol)}, y = ${fmt(ySol)}`,
      steps: [
        { description: 'System', expression: `${eq1str}\n${eq2str}` },
        { description: 'Standard form', expression: `${fmt(a1)}x + ${fmt(b1)}y = ${fmt(c1)}\n${fmt(a2)}x + ${fmt(b2)}y = ${fmt(c2)}` },
        { description: 'Determinant', expression: `det = ${fmt(a1)}×${fmt(b2)} - ${fmt(a2)}×${fmt(b1)} = ${fmt(det)}` },
        { description: "Cramer's Rule", expression: `x = ${fmt(xSol)}, y = ${fmt(ySol)}` },
        { description: 'Verify in Eq1', expression: `${fmt(a1)}(${fmt(xSol)}) + ${fmt(b1)}(${fmt(ySol)}) = ${fmt(a1 * xSol + b1 * ySol)} ≈ ${fmt(c1)} ✓` },
      ],
      success: true,
    };
  } catch {
    return null;
  }
}

// ─── fallback ──────────────────────────────────────────────────────────

function fallbackSolve(input: string): Solution {
  try {
    const result = math.evaluate(input);
    const resultStr = typeof result === 'number' ? fmt(result) : result.toString();
    return {
      problem: input, category: 'General Math', result: resultStr,
      steps: [
        { description: 'Evaluate', expression: input },
        { description: 'Result', expression: `= ${resultStr}` },
      ],
      success: true,
    };
  } catch {
    return {
      problem: input, category: 'Unknown', result: '', steps: [], success: false,
      error: `Could not solve this problem. Try rephrasing or check the syntax.\n\nSupported topics:\n• Arithmetic: 2 + 3 * 4\n• Algebra: 2x + 5 = 11\n• Quadratics: x^2 - 5x + 6 = 0\n• Percentages: what is 15% of 200\n• Statistics: mean/median/mode/std dev of 1,2,3,4,5\n• Probability: combination 10,3 | binomial 10,3,0.5\n• Simultaneous Eq: 2x+3y=12, x-y=1\n• Sequences: arithmetic progression a=3, d=5, n=10\n• Bearing: back bearing of 045\n• Longitude/Latitude: distance along same longitude from 30 to 60\n• Interest: simple interest 5000, 8, 3\n• Mensuration: volume of sphere r=7\n• Sets: n(A)=25, n(B)=30, n(A∩B)=10\n• Matrices: determinant of 3,7; 1,-4\n\n── College Level ──\n• Integration: integrate x^3 | integrate sin(x) from 0 to pi\n• Differentiation: second derivative of x^4 | partial derivative of x^2*y wrt x\n• Limits: limit of sin(x)/x as x approaches 0\n• Complex Numbers: modulus of 3+4i | polar form of 3+4i\n• Diff Equations: y'' - 4y' + 3y = 0 | y' + 3y = 6\n• Vectors: dot product of (1,2,3) and (4,5,6)\n• Taylor Series: taylor series of e^x\n• Laplace: laplace of sin(3t)\n• Eigenvalues: eigenvalues of 4,1; 2,3\n• Partial Fractions: partial fractions of 1/((x-1)(x+2))`,
    };
  }
}

// ─── main solver ───────────────────────────────────────────────────────

export function solveProblem(input: string): Solution {
  if (!input.trim()) {
    return { problem: '', category: '', result: '', steps: [], success: false, error: 'Please enter a math problem.' };
  }

  // Try each solver in order of specificity
  const solvers = [
    // College-level solvers (most specific first)
    solveCollegeDerivative,
    solveIntegration,
    solveLimit,
    solveComplexNumbers,
    solveDiffEquation,
    solveVectors,
    solveTaylorSeries,
    solveLaplaceTransform,
    solveMatrixOperations,
    solvePartialFractions,
    // Advanced solvers (new topics)
    solveStatistics,
    solveProbability,
    solveBearing,
    solveLongitudeLatitude,
    solveSequences,
    solveSets,
    solveMatrices,
    solveMensuration,
    solveRatio,
    solveInterest,
    solveSimultaneous,
    // Original solvers
    solvePercentage,
    solveFactorial,
    solveGCDLCM,
    solvePrimeFactors,
    solveTrigonometry,
    solveLogarithm,
    solvePower,
    solveDerivative,
    solveSystemOfEquations,
    solveQuadratic,
    solveLinearEquation,
    solveArithmetic,
  ];

  for (const solver of solvers) {
    const result = solver(input);
    if (result) return result;
  }

  return fallbackSolve(input);
}

// ─── examples ──────────────────────────────────────────────────────────

export const exampleProblems = [
  { category: 'Arithmetic', icon: '➕', problems: ['2 + 3 * 4', '(15 + 7) * 3 - 10', '144 / 12 + 8'] },
  { category: 'Algebra', icon: '🔤', problems: ['2x + 5 = 11', '3x - 7 = 2x + 4', 'x^2 - 5x + 6 = 0'] },
  { category: 'Percentage', icon: '💯', problems: ['what is 15% of 200', '45 is what percent of 180', 'percentage change from 80 to 100'] },
  { category: 'Powers & Roots', icon: '√', problems: ['2^10', 'sqrt(144)', 'cube root 27'] },
  { category: 'Trigonometry', icon: '📐', problems: ['sin(30 degrees)', 'cos(60 degrees)', 'tan(45 degrees)'] },
  { category: 'Calculus', icon: '∫', problems: ['derivative of x^3 + 2x', 'derivative of sin(x)', 'differentiate x^2 * cos(x)'] },
  { category: 'Number Theory', icon: '🔢', problems: ['5!', 'gcd of 48 and 36', 'lcm of 12 and 18', 'factorize 360'] },
  { category: 'Logarithms', icon: '📈', problems: ['log(1000)', 'ln(2.718)', 'log base 2 of 64'] },
  { category: 'Geometry', icon: '📏', problems: ['Use Geometry Tools tab for:', 'Circle area, sector, arcs', 'Triangle theorems & Pythagoras'] },
  // Advanced examples (high school+)
  ...advancedExampleProblems,
  // College-level examples
  ...collegeExampleProblems,
];
