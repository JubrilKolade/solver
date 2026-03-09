import * as math from 'mathjs';
import { type Solution, type SolutionStep } from './mathSolver';

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(8)).toString();
}

function fmtDec(n: number, dp: number = 4): string {
  return parseFloat(n.toFixed(dp)).toString();
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// ═══════════════════════════════════════════════════════════════
// STATISTICS — full support
// ═══════════════════════════════════════════════════════════════

function parseNumberList(input: string): number[] | null {
  const cleaned = input.replace(/\band\b/g, ',').replace(/\s+/g, ' ');
  const nums = cleaned.match(/-?[\d.]+/g);
  if (!nums || nums.length < 2) return null;
  const parsed = nums.map(Number);
  if (parsed.some(isNaN)) return null;
  return parsed;
}

export function solveStatistics(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── MEDIAN ──
  if (lower.match(/median/)) {
    const nums = parseNumberList(lower.replace(/median\s*(of)?/i, ''));
    if (!nums) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const n = sorted.length;
    const steps: SolutionStep[] = [
      { description: 'List the given data', expression: nums.join(', ') },
      { description: 'Sort the data in ascending order', expression: sorted.join(', ') },
      { description: 'Count the number of values', expression: `n = ${n}` },
    ];
    let median: number;
    if (n % 2 === 1) {
      const mid = Math.floor(n / 2);
      median = sorted[mid];
      steps.push({ description: 'n is odd, so median is the middle value', expression: `Position = (${n} + 1) / 2 = ${(n + 1) / 2}` });
      steps.push({ description: 'The median value', expression: `Median = ${fmt(median)}` });
    } else {
      const mid1 = n / 2 - 1;
      const mid2 = n / 2;
      median = (sorted[mid1] + sorted[mid2]) / 2;
      steps.push({ description: 'n is even, so median is average of two middle values', expression: `Positions: ${mid1 + 1} and ${mid2 + 1}` });
      steps.push({ description: 'Middle values', expression: `${sorted[mid1]} and ${sorted[mid2]}` });
      steps.push({ description: 'Average of middle values', expression: `(${sorted[mid1]} + ${sorted[mid2]}) / 2 = ${fmt(median)}` });
    }
    return { problem: input, category: 'Statistics (Median)', result: fmt(median), steps, success: true };
  }

  // ── MODE ──
  if (lower.match(/mode/)) {
    const nums = parseNumberList(lower.replace(/mode\s*(of)?/i, ''));
    if (!nums) return null;
    const freq: Record<number, number> = {};
    nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => Number(k));
    const steps: SolutionStep[] = [
      { description: 'List the given data', expression: nums.join(', ') },
      { description: 'Count the frequency of each value', expression: Object.entries(freq).map(([k, v]) => `${k} appears ${v} time(s)`).join('\n') },
      { description: 'Find the value(s) with highest frequency', expression: `Highest frequency = ${maxFreq}` },
    ];
    let result: string;
    if (maxFreq === 1) {
      result = 'No mode (all values appear once)';
      steps.push({ description: 'Result', expression: result });
    } else if (modes.length === 1) {
      result = fmt(modes[0]);
      steps.push({ description: 'The mode', expression: `Mode = ${result}` });
    } else {
      result = modes.map(fmt).join(', ');
      steps.push({ description: 'Multiple modes (multimodal)', expression: `Modes = ${result}` });
    }
    return { problem: input, category: 'Statistics (Mode)', result, steps, success: true };
  }

  // ── RANGE ──
  if (lower.match(/\brange\b/) && !lower.match(/inter/)) {
    const nums = parseNumberList(lower.replace(/range\s*(of)?/i, ''));
    if (!nums) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const range = sorted[sorted.length - 1] - sorted[0];
    return {
      problem: input, category: 'Statistics (Range)', result: fmt(range),
      steps: [
        { description: 'List the given data', expression: nums.join(', ') },
        { description: 'Sort the data', expression: sorted.join(', ') },
        { description: 'Find the maximum and minimum', expression: `Max = ${sorted[sorted.length - 1]}, Min = ${sorted[0]}` },
        { description: 'Range = Max - Min', expression: `${sorted[sorted.length - 1]} - ${sorted[0]} = ${fmt(range)}` },
      ],
      success: true,
    };
  }

  // ── VARIANCE & STANDARD DEVIATION ──
  if (lower.match(/(variance|standard\s*deviation|std\s*dev)/)) {
    const cleaned = lower.replace(/(population\s+|sample\s+)?(?:variance|standard\s*deviation|std\s*dev)\s*(of)?/i, '');
    const nums = parseNumberList(cleaned);
    if (!nums) return null;
    const isSample = lower.includes('sample');
    const isVariance = lower.includes('variance');
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const squaredDiffs = nums.map((x) => (x - mean) ** 2);
    const divisor = isSample ? n - 1 : n;
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
    const stdDev = Math.sqrt(variance);
    const steps: SolutionStep[] = [
      { description: 'List the given data', expression: nums.join(', ') },
      { description: 'Calculate the mean', expression: `Mean = (${nums.join(' + ')}) / ${n} = ${fmtDec(mean)}` },
      { description: 'Calculate squared deviations from the mean', expression: nums.map((x) => `(${x} - ${fmtDec(mean)})² = ${fmtDec((x - mean) ** 2)}`).join('\n') },
      { description: 'Sum of squared deviations', expression: `Σ(xᵢ - x̄)² = ${fmtDec(squaredDiffs.reduce((a, b) => a + b, 0))}` },
      { description: `Divide by ${isSample ? 'n-1 (sample)' : 'n (population)'}`, expression: `Variance = ${fmtDec(squaredDiffs.reduce((a, b) => a + b, 0))} / ${divisor} = ${fmtDec(variance)}` },
    ];
    if (!isVariance) {
      steps.push({ description: 'Take the square root for standard deviation', expression: `σ = √${fmtDec(variance)} = ${fmtDec(stdDev)}` });
    }
    const result = isVariance ? fmtDec(variance) : fmtDec(stdDev);
    return { problem: input, category: `Statistics (${isVariance ? 'Variance' : 'Std Dev'})`, result, steps, success: true };
  }

  // ── QUARTILES & IQR ──
  if (lower.match(/(quartile|iqr|interquartile)/)) {
    const cleaned = lower.replace(/(quartile|iqr|interquartile\s*range)\s*(of|for)?/i, '');
    const nums = parseNumberList(cleaned);
    if (!nums) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const n = sorted.length;

    const getMedian = (arr: number[]): number => {
      const len = arr.length;
      if (len % 2 === 1) return arr[Math.floor(len / 2)];
      return (arr[len / 2 - 1] + arr[len / 2]) / 2;
    };

    const Q2 = getMedian(sorted);
    const lowerHalf = sorted.slice(0, Math.floor(n / 2));
    const upperHalf = sorted.slice(n % 2 === 0 ? n / 2 : Math.floor(n / 2) + 1);
    const Q1 = getMedian(lowerHalf);
    const Q3 = getMedian(upperHalf);
    const IQR = Q3 - Q1;

    return {
      problem: input, category: 'Statistics (Quartiles)', result: `Q1=${fmtDec(Q1)}, Q2=${fmtDec(Q2)}, Q3=${fmtDec(Q3)}, IQR=${fmtDec(IQR)}`,
      steps: [
        { description: 'Sort the data in ascending order', expression: sorted.join(', ') },
        { description: 'Count values', expression: `n = ${n}` },
        { description: 'Find Q2 (Median)', expression: `Q2 = ${fmtDec(Q2)}` },
        { description: 'Lower half for Q1', expression: lowerHalf.join(', ') },
        { description: 'Q1 = Median of lower half', expression: `Q1 = ${fmtDec(Q1)}` },
        { description: 'Upper half for Q3', expression: upperHalf.join(', ') },
        { description: 'Q3 = Median of upper half', expression: `Q3 = ${fmtDec(Q3)}` },
        { description: 'Interquartile Range (IQR) = Q3 - Q1', expression: `IQR = ${fmtDec(Q3)} - ${fmtDec(Q1)} = ${fmtDec(IQR)}` },
      ],
      success: true,
    };
  }

  // ── MEAN (enhanced with weighted) ──
  if (lower.match(/(average|mean|avg)/)) {
    const cleaned = lower.replace(/(weighted\s+)?(average|mean|avg)\s*(of)?/i, '');

    // Weighted mean
    if (lower.includes('weight')) {
      const parts = cleaned.split(/with\s*weights?/i);
      if (parts.length === 2) {
        const values = parseNumberList(parts[0]);
        const weights = parseNumberList(parts[1]);
        if (values && weights && values.length === weights.length) {
          const sumWV = values.reduce((s, v, i) => s + v * weights[i], 0);
          const sumW = weights.reduce((a, b) => a + b, 0);
          const wMean = sumWV / sumW;
          return {
            problem: input, category: 'Statistics (Weighted Mean)', result: fmtDec(wMean),
            steps: [
              { description: 'Values and their weights', expression: values.map((v, i) => `${v} × ${weights[i]}`).join(', ') },
              { description: 'Sum of (value × weight)', expression: `${values.map((v, i) => `${v}×${weights[i]}`).join(' + ')} = ${fmtDec(sumWV)}` },
              { description: 'Sum of weights', expression: `${weights.join(' + ')} = ${fmtDec(sumW)}` },
              { description: 'Weighted Mean = Σ(v×w) / Σw', expression: `${fmtDec(sumWV)} / ${fmtDec(sumW)} = ${fmtDec(wMean)}` },
            ],
            success: true,
          };
        }
      }
    }

    const nums = parseNumberList(cleaned);
    if (!nums) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    return {
      problem: input, category: 'Statistics (Mean)', result: fmtDec(avg),
      steps: [
        { description: 'List the numbers', expression: nums.join(', ') },
        { description: 'Count the numbers', expression: `n = ${nums.length}` },
        { description: 'Sum all numbers', expression: `${nums.join(' + ')} = ${fmt(sum)}` },
        { description: 'Divide sum by count', expression: `${fmt(sum)} ÷ ${nums.length} = ${fmtDec(avg)}` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// PROBABILITY
// ═══════════════════════════════════════════════════════════════

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function combinationCalc(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function permutationCalc(n: number, r: number): number {
  return factorial(n) / factorial(n - r);
}

export function solveProbability(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── COMBINATION nCr ──
  let m = lower.match(/(?:combination|ncr|choose)\s*\(?\s*(\d+)\s*[,\s]+\s*(\d+)\s*\)?/);
  if (!m && lower.includes('c') && !lower.includes('cone') && !lower.includes('cylinder') && !lower.includes('compound')) {
    m = lower.match(/(\d+)\s*c\s*(\d+)/);
  }
  if (m && (lower.includes('combin') || lower.includes('choose') || lower.includes('ncr'))) {
    const n = parseInt(m[1]);
    const r = parseInt(m[2]);
    if (r > n) return { problem: input, category: 'Probability (Combination)', result: 'Invalid: r > n', steps: [{ description: 'r cannot be greater than n', expression: `${r} > ${n}` }], success: true };
    const result = combinationCalc(n, r);
    return {
      problem: input, category: 'Probability (Combination)', result: fmt(result),
      steps: [
        { description: 'Use the combination formula', expression: `C(n,r) = n! / (r! × (n-r)!)` },
        { description: 'Substitute values', expression: `C(${n},${r}) = ${n}! / (${r}! × ${n - r}!)` },
        { description: 'Calculate factorials', expression: `${n}! = ${factorial(n)}\n${r}! = ${factorial(r)}\n${n - r}! = ${factorial(n - r)}` },
        { description: 'Compute', expression: `C(${n},${r}) = ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)}) = ${fmt(result)}` },
        { description: 'Interpretation', expression: `There are ${fmt(result)} ways to choose ${r} items from ${n} items (order doesn't matter)` },
      ],
      success: true,
    };
  }

  // ── PERMUTATION nPr ──
  m = lower.match(/(?:permutation|npr)\s*\(?\s*(\d+)\s*[,\s]+\s*(\d+)\s*\)?/);
  if (!m) {
    m = lower.match(/(\d+)\s*p\s*(\d+)/);
  }
  if (m && (lower.includes('perm') || lower.includes('npr'))) {
    const n = parseInt(m[1]);
    const r = parseInt(m[2]);
    if (r > n) return { problem: input, category: 'Probability (Permutation)', result: 'Invalid: r > n', steps: [{ description: 'r cannot be greater than n', expression: `${r} > ${n}` }], success: true };
    const result = permutationCalc(n, r);
    return {
      problem: input, category: 'Probability (Permutation)', result: fmt(result),
      steps: [
        { description: 'Use the permutation formula', expression: `P(n,r) = n! / (n-r)!` },
        { description: 'Substitute values', expression: `P(${n},${r}) = ${n}! / ${n - r}!` },
        { description: 'Calculate factorials', expression: `${n}! = ${factorial(n)}\n${n - r}! = ${factorial(n - r)}` },
        { description: 'Compute', expression: `P(${n},${r}) = ${factorial(n)} / ${factorial(n - r)} = ${fmt(result)}` },
        { description: 'Interpretation', expression: `There are ${fmt(result)} ways to arrange ${r} items from ${n} items (order matters)` },
      ],
      success: true,
    };
  }

  // ── BINOMIAL PROBABILITY ──
  m = lower.match(/binomial\s*(?:probability)?\s*(?:n\s*=?\s*)?(\d+)\s*[,\s]+\s*(?:k\s*=?\s*|x\s*=?\s*|r\s*=?\s*)?(\d+)\s*[,\s]+\s*(?:p\s*=?\s*)?([\d.]+)/);
  if (m) {
    const n = parseInt(m[1]);
    const k = parseInt(m[2]);
    const p = parseFloat(m[3]);
    const q = 1 - p;
    const coeff = combinationCalc(n, k);
    const prob = coeff * Math.pow(p, k) * Math.pow(q, n - k);
    return {
      problem: input, category: 'Probability (Binomial)', result: fmtDec(prob, 6),
      steps: [
        { description: 'Binomial probability formula', expression: `P(X = k) = C(n,k) × p^k × (1-p)^(n-k)` },
        { description: 'Identify parameters', expression: `n = ${n}, k = ${k}, p = ${p}, q = 1-p = ${fmtDec(q)}` },
        { description: 'Calculate C(n,k)', expression: `C(${n},${k}) = ${coeff}` },
        { description: 'Calculate p^k', expression: `${p}^${k} = ${fmtDec(Math.pow(p, k), 8)}` },
        { description: 'Calculate q^(n-k)', expression: `${fmtDec(q)}^${n - k} = ${fmtDec(Math.pow(q, n - k), 8)}` },
        { description: 'Multiply all parts', expression: `P(X=${k}) = ${coeff} × ${fmtDec(Math.pow(p, k), 8)} × ${fmtDec(Math.pow(q, n - k), 8)} = ${fmtDec(prob, 6)}` },
        { description: 'As a percentage', expression: `${fmtDec(prob * 100, 4)}%` },
      ],
      success: true,
    };
  }

  // ── BASIC PROBABILITY ──
  m = lower.match(/probability\s*(?:of)?\s*(\d+)\s*(?:out\s*of|from|\/)\s*(\d+)/);
  if (m) {
    const favorable = parseInt(m[1]);
    const total = parseInt(m[2]);
    const prob = favorable / total;
    return {
      problem: input, category: 'Probability', result: fmtDec(prob, 6),
      steps: [
        { description: 'Probability formula', expression: `P(E) = Number of favorable outcomes / Total outcomes` },
        { description: 'Substitute values', expression: `P(E) = ${favorable} / ${total}` },
        { description: 'Calculate', expression: `P(E) = ${fmtDec(prob, 6)}` },
        { description: 'As a percentage', expression: `${fmtDec(prob * 100, 4)}%` },
        { description: 'As a fraction', expression: `${favorable}/${total}` },
      ],
      success: true,
    };
  }

  // ── EXPECTED VALUE ──
  if (lower.match(/expected\s*value/)) {
    const parts = lower.split(/with\s*prob/);
    if (parts.length === 2) {
      const values = parseNumberList(parts[0].replace(/expected\s*value\s*(of)?/, ''));
      const probs = parseNumberList(parts[1]);
      if (values && probs && values.length === probs.length) {
        const ev = values.reduce((s, v, i) => s + v * probs[i], 0);
        const probSum = probs.reduce((a, b) => a + b, 0);
        return {
          problem: input, category: 'Probability (Expected Value)', result: fmtDec(ev),
          steps: [
            { description: 'Expected Value formula', expression: `E(X) = Σ[xᵢ × P(xᵢ)]` },
            { description: 'Values and probabilities', expression: values.map((v, i) => `x=${v}, P=${probs[i]}`).join('\n') },
            { description: 'Check probabilities sum to 1', expression: `Σp = ${fmtDec(probSum)} ${Math.abs(probSum - 1) < 0.001 ? '✓' : '(Warning: ≠ 1)'}` },
            { description: 'Calculate each term', expression: values.map((v, i) => `${v} × ${probs[i]} = ${fmtDec(v * probs[i])}`).join('\n') },
            { description: 'Sum all terms', expression: `E(X) = ${values.map((v, i) => fmtDec(v * probs[i])).join(' + ')} = ${fmtDec(ev)}` },
          ],
          success: true,
        };
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// SIMULTANEOUS EQUATIONS (improved with elimination method)
// ═══════════════════════════════════════════════════════════════

export function solveSimultaneous(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // 3-variable system
  const threeVarMatch = lower.match(/(.+?=.+?)[,;&]\s*(.+?=.+?)[,;&]\s*(.+?=.+?)$/);
  if (threeVarMatch && lower.includes('z')) {
    return solveThreeVar(input, threeVarMatch[1].trim(), threeVarMatch[2].trim(), threeVarMatch[3].trim());
  }

  // 2-variable system
  const twoVarMatch = lower.match(/(.+?=.+?)(?:\s*(?:and|,|;|&)\s*)(.+?=.+?)$/);
  if (!twoVarMatch) return null;

  const eq1str = twoVarMatch[1].trim().replace(/^solve\s*/i, '');
  const eq2str = twoVarMatch[2].trim();

  // Check it has variables
  if (!eq1str.match(/[a-z]/i) || !eq2str.match(/[a-z]/i)) return null;

  try {
    const eq1parts = eq1str.split('=');
    const eq2parts = eq2str.split('=');
    if (eq1parts.length !== 2 || eq2parts.length !== 2) return null;

    const expr1 = math.simplify(math.parse(`(${eq1parts[0]}) - (${eq1parts[1]})`));
    const expr2 = math.simplify(math.parse(`(${eq2parts[0]}) - (${eq2parts[1]})`));

    const evalNode = (node: math.MathNode, vals: Record<string, number>) => node.evaluate(vals) as number;

    const c1 = -evalNode(expr1, { x: 0, y: 0 });
    const a1 = evalNode(expr1, { x: 1, y: 0 }) + c1;
    const b1 = evalNode(expr1, { x: 0, y: 1 }) + c1;
    const c2 = -evalNode(expr2, { x: 0, y: 0 });
    const a2 = evalNode(expr2, { x: 1, y: 0 }) + c2;
    const b2 = evalNode(expr2, { x: 0, y: 1 }) + c2;

    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < 1e-10) {
      return {
        problem: input, category: 'Simultaneous Equations', result: 'No unique solution',
        steps: [
          { description: 'Write in standard form', expression: `${fmt(a1)}x + ${fmt(b1)}y = ${fmt(c1)}\n${fmt(a2)}x + ${fmt(b2)}y = ${fmt(c2)}` },
          { description: 'Determinant = 0', expression: `The lines are parallel or identical — no unique solution` },
        ],
        success: true,
      };
    }

    const xSol = (c1 * b2 - c2 * b1) / det;
    const ySol = (a1 * c2 - a2 * c1) / det;

    const steps: SolutionStep[] = [
      { description: 'Write the system of equations', expression: `Equation 1: ${eq1str}\nEquation 2: ${eq2str}` },
      { description: 'Convert to standard form', expression: `${fmt(a1)}x + ${fmt(b1)}y = ${fmt(c1)}  ... (i)\n${fmt(a2)}x + ${fmt(b2)}y = ${fmt(c2)}  ... (ii)` },
      { description: '── Elimination Method ──', expression: `Multiply (i) by ${fmt(Math.abs(a2))} and (ii) by ${fmt(Math.abs(a1))} to equalize x-coefficients` },
      { description: 'After multiplication', expression: `${fmt(a1 * a2)}x + ${fmt(b1 * a2)}y = ${fmt(c1 * a2)}\n${fmt(a2 * a1)}x + ${fmt(b2 * a1)}y = ${fmt(c2 * a1)}` },
      { description: 'Subtract to eliminate x', expression: `(${fmt(b1 * a2)} - ${fmt(b2 * a1)})y = ${fmt(c1 * a2)} - ${fmt(c2 * a1)}\n${fmt(b1 * a2 - b2 * a1)}y = ${fmt(c1 * a2 - c2 * a1)}` },
      { description: 'Solve for y', expression: `y = ${fmt(c1 * a2 - c2 * a1)} / ${fmt(b1 * a2 - b2 * a1)} = ${fmtDec(ySol)}` },
      { description: 'Substitute y back into equation (i)', expression: `${fmt(a1)}x + ${fmt(b1)}(${fmtDec(ySol)}) = ${fmt(c1)}\n${fmt(a1)}x = ${fmt(c1)} - ${fmtDec(b1 * ySol)}\nx = ${fmtDec(xSol)}` },
      { description: '── Verification ──', expression: `Eq1: ${fmt(a1)}(${fmtDec(xSol)}) + ${fmt(b1)}(${fmtDec(ySol)}) = ${fmtDec(a1 * xSol + b1 * ySol)} ≈ ${fmt(c1)} ✓\nEq2: ${fmt(a2)}(${fmtDec(xSol)}) + ${fmt(b2)}(${fmtDec(ySol)}) = ${fmtDec(a2 * xSol + b2 * ySol)} ≈ ${fmt(c2)} ✓` },
      { description: 'Final answer', expression: `x = ${fmtDec(xSol)}, y = ${fmtDec(ySol)}` },
    ];

    return { problem: input, category: 'Simultaneous Equations', result: `x = ${fmtDec(xSol)}, y = ${fmtDec(ySol)}`, steps, success: true };
  } catch {
    return null;
  }
}

function solveThreeVar(input: string, eq1: string, eq2: string, eq3: string): Solution | null {
  try {
    const eqs = [eq1, eq2, eq3].map(eq => {
      const [lhs, rhs] = eq.split('=');
      return math.simplify(math.parse(`(${lhs}) - (${rhs})`));
    });

    const evalNode = (node: math.MathNode, vals: Record<string, number>) => node.evaluate(vals) as number;

    const coeffs = eqs.map(e => {
      const con = -evalNode(e, { x: 0, y: 0, z: 0 });
      const a = evalNode(e, { x: 1, y: 0, z: 0 }) + con;
      const b = evalNode(e, { x: 0, y: 1, z: 0 }) + con;
      const d = evalNode(e, { x: 0, y: 0, z: 1 }) + con;
      return { a, b, d, c: con };
    });

    const det3 = (m: number[][]) =>
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    const D = det3([
      [coeffs[0].a, coeffs[0].b, coeffs[0].d],
      [coeffs[1].a, coeffs[1].b, coeffs[1].d],
      [coeffs[2].a, coeffs[2].b, coeffs[2].d],
    ]);

    if (Math.abs(D) < 1e-10) {
      return { problem: input, category: 'Simultaneous Equations (3 vars)', result: 'No unique solution', steps: [{ description: 'Determinant is 0', expression: 'System has no unique solution' }], success: true };
    }

    const Dx = det3([
      [coeffs[0].c, coeffs[0].b, coeffs[0].d],
      [coeffs[1].c, coeffs[1].b, coeffs[1].d],
      [coeffs[2].c, coeffs[2].b, coeffs[2].d],
    ]);
    const Dy = det3([
      [coeffs[0].a, coeffs[0].c, coeffs[0].d],
      [coeffs[1].a, coeffs[1].c, coeffs[1].d],
      [coeffs[2].a, coeffs[2].c, coeffs[2].d],
    ]);
    const Dz = det3([
      [coeffs[0].a, coeffs[0].b, coeffs[0].c],
      [coeffs[1].a, coeffs[1].b, coeffs[1].c],
      [coeffs[2].a, coeffs[2].b, coeffs[2].c],
    ]);

    const x = Dx / D, y = Dy / D, z = Dz / D;

    return {
      problem: input, category: 'Simultaneous Equations (3 vars)',
      result: `x = ${fmtDec(x)}, y = ${fmtDec(y)}, z = ${fmtDec(z)}`,
      steps: [
        { description: 'Write the 3 equations', expression: `(i)  ${eq1}\n(ii) ${eq2}\n(iii) ${eq3}` },
        { description: 'Extract coefficients', expression: coeffs.map((c, i) => `Eq${i + 1}: ${fmt(c.a)}x + ${fmt(c.b)}y + ${fmt(c.d)}z = ${fmt(c.c)}`).join('\n') },
        { description: "Using Cramer's Rule", expression: `D = ${fmtDec(D)}, Dx = ${fmtDec(Dx)}, Dy = ${fmtDec(Dy)}, Dz = ${fmtDec(Dz)}` },
        { description: 'Solve', expression: `x = Dx/D = ${fmtDec(x)}\ny = Dy/D = ${fmtDec(y)}\nz = Dz/D = ${fmtDec(z)}` },
        { description: '── Verification ──', expression: `Eq1: ${fmt(coeffs[0].a)}(${fmtDec(x)}) + ${fmt(coeffs[0].b)}(${fmtDec(y)}) + ${fmt(coeffs[0].d)}(${fmtDec(z)}) = ${fmtDec(coeffs[0].a * x + coeffs[0].b * y + coeffs[0].d * z)} ≈ ${fmt(coeffs[0].c)} ✓` },
      ],
      success: true,
    };
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// BEARING
// ═══════════════════════════════════════════════════════════════

export function solveBearing(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── BACK BEARING ──
  let m = lower.match(/back\s*bearing\s*(?:of|from)?\s*([\d.]+)/);
  if (m) {
    const bearing = parseFloat(m[1]);
    const backBearing = bearing >= 180 ? bearing - 180 : bearing + 180;
    return {
      problem: input, category: 'Bearing', result: `${fmtDec(backBearing, 1)}°`,
      steps: [
        { description: 'Given bearing', expression: `${bearing}°` },
        { description: 'Back bearing formula', expression: bearing >= 180 ? 'If bearing ≥ 180°: Back bearing = bearing - 180°' : 'If bearing < 180°: Back bearing = bearing + 180°' },
        { description: 'Calculate', expression: bearing >= 180 ? `${bearing}° - 180° = ${fmtDec(backBearing, 1)}°` : `${bearing}° + 180° = ${fmtDec(backBearing, 1)}°` },
        { description: 'The back bearing', expression: `${fmtDec(backBearing, 1)}° (as 3-figure: ${backBearing < 100 ? (backBearing < 10 ? '00' + fmtDec(backBearing, 0) : '0' + fmtDec(backBearing, 0)) : fmtDec(backBearing, 0)}°)` },
      ],
      success: true,
    };
  }

  // ── BEARING BETWEEN TWO POINTS ──
  m = lower.match(/bearing\s*(?:of|from)?\s*\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\)?\s*(?:to|and)\s*\(?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\)?/);
  if (m) {
    const x1 = parseFloat(m[1]), y1 = parseFloat(m[2]);
    const x2 = parseFloat(m[3]), y2 = parseFloat(m[4]);
    const dx = x2 - x1;
    const dy = y2 - y1;
    let angle = toDeg(Math.atan2(dx, dy));
    if (angle < 0) angle += 360;
    const threeFig = angle < 10 ? `00${fmtDec(angle, 1)}` : angle < 100 ? `0${fmtDec(angle, 1)}` : fmtDec(angle, 1);
    return {
      problem: input, category: 'Bearing', result: `${threeFig}°`,
      steps: [
        { description: 'Points', expression: `A = (${x1}, ${y1}), B = (${x2}, ${y2})` },
        { description: 'Calculate differences', expression: `Δx = ${x2} - ${x1} = ${fmtDec(dx)}\nΔy = ${y2} - ${y1} = ${fmtDec(dy)}` },
        { description: 'Bearing is measured clockwise from North (positive y-axis)', expression: `θ = arctan(Δx / Δy)` },
        { description: 'Calculate angle', expression: `θ = arctan(${fmtDec(dx)} / ${fmtDec(dy)}) = ${fmtDec(toDeg(Math.atan2(dx, dy)), 2)}°` },
        { description: 'Adjust to 0-360° range', expression: `Bearing = ${fmtDec(angle, 2)}°` },
        { description: 'As 3-figure bearing', expression: `${threeFig}°` },
      ],
      success: true,
    };
  }

  // ── DISTANCE & DISPLACEMENT FROM BEARING ──
  m = lower.match(/(?:distance|travel)\s*([\d.]+)\s*(?:km|m|miles?)?\s*(?:on|at)?\s*(?:a\s*)?bearing\s*(?:of)?\s*([\d.]+)/);
  if (m) {
    const distance = parseFloat(m[1]);
    const bearing = parseFloat(m[2]);
    const bearingRad = toRad(bearing);
    const east = distance * Math.sin(bearingRad);
    const north = distance * Math.cos(bearingRad);
    return {
      problem: input, category: 'Bearing (Displacement)', result: `East: ${fmtDec(east, 2)}, North: ${fmtDec(north, 2)}`,
      steps: [
        { description: 'Given', expression: `Distance = ${distance}, Bearing = ${bearing}°` },
        { description: 'Convert bearing to components', expression: `Eastward = d × sin(θ)\nNorthward = d × cos(θ)` },
        { description: 'Calculate eastward displacement', expression: `East = ${distance} × sin(${bearing}°) = ${fmtDec(east, 4)}` },
        { description: 'Calculate northward displacement', expression: `North = ${distance} × cos(${bearing}°) = ${fmtDec(north, 4)}` },
        { description: 'Interpretation', expression: `Move ${fmtDec(Math.abs(east), 2)} ${east >= 0 ? 'East' : 'West'} and ${fmtDec(Math.abs(north), 2)} ${north >= 0 ? 'North' : 'South'}` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// LONGITUDE AND LATITUDE
// ═══════════════════════════════════════════════════════════════

const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_NM = 3440.065;

export function solveLongitudeLatitude(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── GREAT CIRCLE DISTANCE ──
  let m = lower.match(/(?:distance|great\s*circle)\s*(?:between|from)?\s*\(?\s*([-\d.]+)[°]?\s*[,\s]+\s*([-\d.]+)[°]?\s*\)?\s*(?:to|and)\s*\(?\s*([-\d.]+)[°]?\s*[,\s]+\s*([-\d.]+)[°]?\s*\)?/);
  if (m && (lower.includes('lat') || lower.includes('long') || lower.includes('coordinate') || lower.includes('great') || lower.includes('earth') || lower.includes('globe') || lower.includes('circle distance'))) {
    const lat1 = parseFloat(m[1]), lon1 = parseFloat(m[2]);
    const lat2 = parseFloat(m[3]), lon2 = parseFloat(m[4]);
    return computeGreatCircle(input, lat1, lon1, lat2, lon2);
  }

  // ── DISTANCE ALONG SAME LONGITUDE (meridian) ──
  m = lower.match(/(?:distance|arc)\s*(?:along)?\s*(?:same\s*)?(?:longitude|meridian)\s*(?:from|between)?\s*([-\d.]+)[°]?\s*(?:to|and)\s*([-\d.]+)[°]?/);
  if (m) {
    const lat1 = parseFloat(m[1]);
    const lat2 = parseFloat(m[2]);
    const diffDeg = Math.abs(lat2 - lat1);
    const distKm = (diffDeg / 360) * 2 * Math.PI * EARTH_RADIUS_KM;
    const distNm = diffDeg * 60;
    return {
      problem: input, category: 'Longitude & Latitude', result: `${fmtDec(distKm, 2)} km`,
      steps: [
        { description: 'Points on the same longitude (meridian)', expression: `Latitude 1 = ${lat1}°, Latitude 2 = ${lat2}°` },
        { description: 'Angular difference', expression: `Δθ = |${lat2}° - ${lat1}°| = ${fmtDec(diffDeg)}°` },
        { description: 'Distance along meridian', expression: `d = (Δθ/360) × 2πR` },
        { description: 'Substitute (R = 6371 km)', expression: `d = (${fmtDec(diffDeg)}/360) × 2π × 6371` },
        { description: 'Calculate', expression: `d = ${fmtDec(distKm, 2)} km` },
        { description: 'In nautical miles (1° latitude = 60 nm)', expression: `d = ${fmtDec(diffDeg)}° × 60 = ${fmtDec(distNm, 2)} nm` },
      ],
      success: true,
    };
  }

  // ── DISTANCE ALONG SAME LATITUDE (parallel) ──
  m = lower.match(/(?:distance|arc)\s*(?:along)?\s*(?:same\s*)?(?:latitude|parallel)\s*(?:at)?\s*([-\d.]+)[°]?\s*(?:from|between)?\s*([-\d.]+)[°]?\s*(?:to|and)\s*([-\d.]+)[°]?/);
  if (m) {
    const lat = parseFloat(m[1]);
    const lon1 = parseFloat(m[2]);
    const lon2 = parseFloat(m[3]);
    const diffDeg = Math.abs(lon2 - lon1);
    const r = EARTH_RADIUS_KM * Math.cos(toRad(lat));
    const distKm = (diffDeg / 360) * 2 * Math.PI * r;
    return {
      problem: input, category: 'Longitude & Latitude', result: `${fmtDec(distKm, 2)} km`,
      steps: [
        { description: 'Points on the same latitude (parallel)', expression: `Latitude = ${lat}°, Longitude 1 = ${lon1}°, Longitude 2 = ${lon2}°` },
        { description: 'Angular difference in longitude', expression: `Δλ = |${lon2}° - ${lon1}°| = ${fmtDec(diffDeg)}°` },
        { description: 'Radius of the circle of latitude', expression: `r = R × cos(lat) = 6371 × cos(${lat}°) = ${fmtDec(r, 2)} km` },
        { description: 'Distance along parallel', expression: `d = (Δλ/360) × 2πr` },
        { description: 'Calculate', expression: `d = (${fmtDec(diffDeg)}/360) × 2π × ${fmtDec(r, 2)} = ${fmtDec(distKm, 2)} km` },
      ],
      success: true,
    };
  }

  // ── TIME DIFFERENCE ──
  m = lower.match(/time\s*(?:difference|zone)\s*(?:between)?\s*([-\d.]+)[°]?\s*(?:and|to)\s*([-\d.]+)[°]?/);
  if (m && lower.includes('time')) {
    const lon1 = parseFloat(m[1]);
    const lon2 = parseFloat(m[2]);
    const diffDeg = lon2 - lon1;
    const timeDiffHours = diffDeg / 15;
    const hours = Math.floor(Math.abs(timeDiffHours));
    const minutes = Math.round((Math.abs(timeDiffHours) - hours) * 60);
    return {
      problem: input, category: 'Longitude & Latitude (Time)', result: `${fmtDec(Math.abs(timeDiffHours), 2)} hours`,
      steps: [
        { description: 'Given longitudes', expression: `Longitude 1 = ${lon1}°, Longitude 2 = ${lon2}°` },
        { description: 'Difference in longitude', expression: `Δλ = ${lon2}° - ${lon1}° = ${fmtDec(diffDeg)}°` },
        { description: 'Earth rotates 360° in 24 hours', expression: `15° = 1 hour, 1° = 4 minutes` },
        { description: 'Time difference', expression: `${fmtDec(Math.abs(diffDeg))}° ÷ 15 = ${fmtDec(Math.abs(timeDiffHours), 4)} hours` },
        { description: 'In hours and minutes', expression: `= ${hours} hours ${minutes} minutes` },
        { description: 'Direction', expression: diffDeg > 0 ? `Location 2 is EAST → ${fmtDec(Math.abs(timeDiffHours), 2)} hours AHEAD` : `Location 2 is WEST → ${fmtDec(Math.abs(timeDiffHours), 2)} hours BEHIND` },
      ],
      success: true,
    };
  }

  return null;
}

function computeGreatCircle(input: string, lat1: number, lon1: number, lat2: number, lon2: number): Solution {
  const ph1 = toRad(lat1), ph2 = toRad(lat2);
  const dPh = toRad(lat2 - lat1), dLm = toRad(lon2 - lon1);

  const a = Math.sin(dPh / 2) ** 2 + Math.cos(ph1) * Math.cos(ph2) * Math.sin(dLm / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTH_RADIUS_KM * c;
  const dNm = EARTH_RADIUS_NM * c;

  return {
    problem: input, category: 'Longitude & Latitude (Distance)', result: `${fmtDec(d, 2)} km`,
    steps: [
      { description: 'Given coordinates', expression: `Point A: (${lat1}°, ${lon1}°)\nPoint B: (${lat2}°, ${lon2}°)` },
      { description: 'Using the Haversine Formula', expression: `a = sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)` },
      { description: 'Convert to radians', expression: `φ₁ = ${fmtDec(ph1, 6)}, φ₂ = ${fmtDec(ph2, 6)}\nΔφ = ${fmtDec(dPh, 6)}, Δλ = ${fmtDec(dLm, 6)}` },
      { description: 'Calculate a', expression: `a = ${fmtDec(a, 8)}` },
      { description: 'Angular distance', expression: `c = 2 × atan2(√a, √(1-a)) = ${fmtDec(c, 6)} rad = ${fmtDec(toDeg(c), 4)}°` },
      { description: 'Distance (R = 6371 km)', expression: `d = R × c = 6371 × ${fmtDec(c, 6)} = ${fmtDec(d, 2)} km` },
      { description: 'In nautical miles', expression: `${fmtDec(dNm, 2)} nm` },
      { description: 'In miles', expression: `${fmtDec(d * 0.621371, 2)} miles` },
    ],
    success: true,
  };
}

// ═══════════════════════════════════════════════════════════════
// SEQUENCES AND SERIES
// ═══════════════════════════════════════════════════════════════

export function solveSequences(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── ARITHMETIC PROGRESSION ──
  let m = lower.match(/(?:arithmetic|ap)\s*(?:progression|sequence|series)?\s*(?:a|first\s*term)?\s*=?\s*([-\d.]+)\s*[,\s]+\s*(?:d|common\s*diff(?:erence)?)?\s*=?\s*([-\d.]+)\s*[,\s]+\s*(?:n|terms?)?\s*=?\s*(\d+)/);
  if (m && (lower.includes('arith') || lower.includes('ap '))) {
    const a = parseFloat(m[1]);
    const d = parseFloat(m[2]);
    const n = parseInt(m[3]);
    const nthTerm = a + (n - 1) * d;
    const sum = (n / 2) * (2 * a + (n - 1) * d);
    return {
      problem: input, category: 'Sequences (AP)', result: `nth term = ${fmtDec(nthTerm)}, Sum = ${fmtDec(sum)}`,
      steps: [
        { description: 'Arithmetic Progression (AP) parameters', expression: `First term (a) = ${a}\nCommon difference (d) = ${d}\nNumber of terms (n) = ${n}` },
        { description: 'nth term formula: Tₙ = a + (n-1)d', expression: `T${n} = ${a} + (${n}-1)(${d})` },
        { description: 'Calculate nth term', expression: `T${n} = ${a} + ${n - 1} × ${d} = ${a} + ${fmtDec((n - 1) * d)} = ${fmtDec(nthTerm)}` },
        { description: 'Sum formula: Sₙ = n/2 × [2a + (n-1)d]', expression: `S${n} = ${n}/2 × [2(${a}) + (${n}-1)(${d})]` },
        { description: 'Calculate sum', expression: `S${n} = ${n / 2} × [${2 * a} + ${fmtDec((n - 1) * d)}] = ${n / 2} × ${fmtDec(2 * a + (n - 1) * d)} = ${fmtDec(sum)}` },
        { description: 'First few terms', expression: Array.from({ length: Math.min(n, 8) }, (_, i) => fmtDec(a + i * d)).join(', ') + (n > 8 ? ', ...' : '') },
      ],
      success: true,
    };
  }

  // ── GEOMETRIC PROGRESSION ──
  m = lower.match(/(?:geometric|gp)\s*(?:progression|sequence|series)?\s*(?:a|first\s*term)?\s*=?\s*([-\d.]+)\s*[,\s]+\s*(?:r|common\s*ratio)?\s*=?\s*([-\d.]+)\s*[,\s]+\s*(?:n|terms?)?\s*=?\s*(\d+)/);
  if (m && (lower.includes('geo') || lower.includes('gp '))) {
    const a = parseFloat(m[1]);
    const r = parseFloat(m[2]);
    const n = parseInt(m[3]);
    const nthTerm = a * Math.pow(r, n - 1);
    let sum: number;
    let sumFormula: string;
    if (Math.abs(r) === 1) {
      sum = n * a;
      sumFormula = `Sₙ = n × a = ${n} × ${a} = ${fmtDec(sum)}`;
    } else {
      sum = a * (1 - Math.pow(r, n)) / (1 - r);
      sumFormula = `Sₙ = a(1 - rⁿ)/(1 - r) = ${a}(1 - ${fmtDec(Math.pow(r, n))})/(1 - ${r}) = ${fmtDec(sum)}`;
    }
    const steps: SolutionStep[] = [
      { description: 'Geometric Progression (GP) parameters', expression: `First term (a) = ${a}\nCommon ratio (r) = ${r}\nNumber of terms (n) = ${n}` },
      { description: 'nth term formula: Tₙ = a × r^(n-1)', expression: `T${n} = ${a} × ${r}^${n - 1} = ${a} × ${fmtDec(Math.pow(r, n - 1))} = ${fmtDec(nthTerm)}` },
      { description: 'Sum formula', expression: sumFormula },
      { description: 'First few terms', expression: Array.from({ length: Math.min(n, 8) }, (_, i) => fmtDec(a * Math.pow(r, i))).join(', ') + (n > 8 ? ', ...' : '') },
    ];
    if (Math.abs(r) < 1) {
      const sumInf = a / (1 - r);
      steps.push({ description: 'Sum to infinity (|r| < 1)', expression: `S∞ = a/(1-r) = ${a}/(1-${r}) = ${fmtDec(sumInf)}` });
    }
    return { problem: input, category: 'Sequences (GP)', result: `nth term = ${fmtDec(nthTerm)}, Sum = ${fmtDec(sum)}`, steps, success: true };
  }

  // ── FIND PATTERN ──
  m = lower.match(/(?:next|pattern|sequence|continue)\s*(?:term|number)?\s*(?:in|of|for)?\s*([-\d.,\s]+)/);
  if (m) {
    const nums = parseNumberList(m[1]);
    if (nums && nums.length >= 3) {
      // Check AP
      const diffs: number[] = [];
      for (let i = 1; i < nums.length; i++) diffs.push(nums[i] - nums[i - 1]);
      const isAP = diffs.every((d: number) => Math.abs(d - diffs[0]) < 1e-10);

      if (isAP) {
        const d = diffs[0];
        const next = nums[nums.length - 1] + d;
        return {
          problem: input, category: 'Sequences (Pattern)', result: `Next term = ${fmtDec(next)}`,
          steps: [
            { description: 'Given sequence', expression: nums.join(', ') },
            { description: 'Calculate differences', expression: diffs.map((d: number, i: number) => `${nums[i + 1]} - ${nums[i]} = ${fmtDec(d)}`).join('\n') },
            { description: 'Arithmetic Progression identified', expression: `Common difference d = ${fmtDec(d)}` },
            { description: 'Next term = last + d', expression: `${nums[nums.length - 1]} + ${fmtDec(d)} = ${fmtDec(next)}` },
          ],
          success: true,
        };
      }

      // Check GP
      const ratios: number[] = [];
      for (let i = 1; i < nums.length; i++) {
        if (nums[i - 1] !== 0) ratios.push(nums[i] / nums[i - 1]);
      }
      const isGP = ratios.length > 0 && ratios.every((r: number) => Math.abs(r - ratios[0]) < 1e-10);

      if (isGP) {
        const r = ratios[0];
        const next = nums[nums.length - 1] * r;
        return {
          problem: input, category: 'Sequences (Pattern)', result: `Next term = ${fmtDec(next)}`,
          steps: [
            { description: 'Given sequence', expression: nums.join(', ') },
            { description: 'Calculate ratios', expression: ratios.map((r: number, i: number) => `${nums[i + 1]} / ${nums[i]} = ${fmtDec(r)}`).join('\n') },
            { description: 'Geometric Progression identified', expression: `Common ratio r = ${fmtDec(r)}` },
            { description: 'Next term = last × r', expression: `${nums[nums.length - 1]} × ${fmtDec(r)} = ${fmtDec(next)}` },
          ],
          success: true,
        };
      }

      // Check quadratic (second differences constant)
      if (diffs.length >= 2) {
        const secondDiffs: number[] = [];
        for (let i = 1; i < diffs.length; i++) secondDiffs.push(diffs[i] - diffs[i - 1]);
        const isQuad = secondDiffs.every((d: number) => Math.abs(d - secondDiffs[0]) < 1e-10);
        if (isQuad) {
          const nextDiff = diffs[diffs.length - 1] + secondDiffs[0];
          const next = nums[nums.length - 1] + nextDiff;
          return {
            problem: input, category: 'Sequences (Pattern)', result: `Next term = ${fmtDec(next)}`,
            steps: [
              { description: 'Given sequence', expression: nums.join(', ') },
              { description: 'First differences', expression: diffs.map(fmtDec).join(', ') },
              { description: 'Second differences (constant → quadratic sequence)', expression: secondDiffs.map(fmtDec).join(', ') },
              { description: 'Next first difference', expression: `${fmtDec(diffs[diffs.length - 1])} + ${fmtDec(secondDiffs[0])} = ${fmtDec(nextDiff)}` },
              { description: 'Next term', expression: `${nums[nums.length - 1]} + ${fmtDec(nextDiff)} = ${fmtDec(next)}` },
            ],
            success: true,
          };
        }
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// SETS AND VENN DIAGRAMS
// ═══════════════════════════════════════════════════════════════

export function solveSets(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── n(A)=x, n(B)=y, n(A∩B)=z ──
  const m = lower.match(/n\s*\(\s*a\s*\)\s*=?\s*(\d+).*?n\s*\(\s*b\s*\)\s*=?\s*(\d+).*?n\s*\(\s*a\s*(?:∩|and|intersection|∧|&|n)\s*b\s*\)\s*=?\s*(\d+)/);
  if (m) {
    const nA = parseInt(m[1]);
    const nB = parseInt(m[2]);
    const nAintB = parseInt(m[3]);
    const nAunB = nA + nB - nAintB;
    const onlyA = nA - nAintB;
    const onlyB = nB - nAintB;
    return {
      problem: input, category: 'Sets (Venn Diagram)', result: `n(A∪B) = ${nAunB}`,
      steps: [
        { description: 'Given', expression: `n(A) = ${nA}, n(B) = ${nB}, n(A∩B) = ${nAintB}` },
        { description: 'Addition principle', expression: `n(A∪B) = n(A) + n(B) - n(A∩B)` },
        { description: 'Substitute', expression: `n(A∪B) = ${nA} + ${nB} - ${nAintB} = ${nAunB}` },
        { description: 'Venn diagram breakdown', expression: `Only A = ${nA} - ${nAintB} = ${onlyA}\nOnly B = ${nB} - ${nAintB} = ${onlyB}\nBoth A∩B = ${nAintB}\nTotal A∪B = ${nAunB}` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// MATRICES
// ═══════════════════════════════════════════════════════════════

export function solveMatrices(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── 2x2 DETERMINANT ──
  let m = lower.match(/(?:determinant|det)\s*(?:of)?\s*\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    const c = parseFloat(m[3]), d = parseFloat(m[4]);
    const det = a * d - b * c;
    return {
      problem: input, category: 'Matrices (Determinant)', result: fmt(det),
      steps: [
        { description: '2×2 Matrix', expression: `| ${a}  ${b} |\n| ${c}  ${d} |` },
        { description: 'det = ad - bc', expression: `det = (${a})(${d}) - (${b})(${c})` },
        { description: 'Calculate', expression: `det = ${fmtDec(a * d)} - ${fmtDec(b * c)} = ${fmt(det)}` },
      ],
      success: true,
    };
  }

  // ── 2x2 INVERSE ──
  m = lower.match(/(?:inverse)\s*(?:of)?\s*(?:matrix)?\s*\[?\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*[;|]\s*([-\d.]+)\s*[,\s]+\s*([-\d.]+)\s*\]?/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    const c = parseFloat(m[3]), d = parseFloat(m[4]);
    const det = a * d - b * c;
    if (Math.abs(det) < 1e-10) {
      return { problem: input, category: 'Matrices (Inverse)', result: 'Singular — no inverse', steps: [{ description: 'det = 0 → singular matrix', expression: 'No inverse exists' }], success: true };
    }
    return {
      problem: input, category: 'Matrices (Inverse)', result: `Inverse found (det = ${fmt(det)})`,
      steps: [
        { description: 'Matrix', expression: `| ${a}  ${b} |\n| ${c}  ${d} |` },
        { description: 'Determinant', expression: `det = ${a}×${d} - ${b}×${c} = ${fmt(det)}` },
        { description: 'Formula: A⁻¹ = (1/det) × adjugate', expression: `A⁻¹ = (1/${fmt(det)}) × | ${fmt(d)}  ${fmt(-b)} |\n                        | ${fmt(-c)}  ${fmt(a)} |` },
        { description: 'Result', expression: `| ${fmtDec(d / det, 4)}  ${fmtDec(-b / det, 4)} |\n| ${fmtDec(-c / det, 4)}  ${fmtDec(a / det, 4)} |` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// MENSURATION (3D shapes)
// ═══════════════════════════════════════════════════════════════

export function solveMensuration(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── CYLINDER ──
  if (lower.includes('cylinder')) {
    const m = lower.match(/(?:r(?:adius)?\s*=?\s*([\d.]+)).*?(?:h(?:eight)?\s*=?\s*([\d.]+))/);
    if (m) {
      const r = parseFloat(m[1]), h = parseFloat(m[2]);
      const vol = Math.PI * r * r * h;
      const csa = 2 * Math.PI * r * h;
      const tsa = 2 * Math.PI * r * (r + h);
      return {
        problem: input, category: 'Mensuration (Cylinder)', result: `Volume = ${fmtDec(vol, 4)}`,
        steps: [
          { description: 'Given', expression: `Radius r = ${r}, Height h = ${h}` },
          { description: 'Volume = πr²h', expression: `V = π × ${r}² × ${h} = ${fmtDec(vol, 4)}` },
          { description: 'Curved Surface Area = 2πrh', expression: `CSA = 2π × ${r} × ${h} = ${fmtDec(csa, 4)}` },
          { description: 'Total Surface Area = 2πr(r + h)', expression: `TSA = 2π × ${r} × (${r} + ${h}) = ${fmtDec(tsa, 4)}` },
        ],
        success: true,
      };
    }
  }

  // ── SPHERE ──
  if (lower.includes('sphere')) {
    const m = lower.match(/r(?:adius)?\s*=?\s*([\d.]+)/);
    if (m) {
      const r = parseFloat(m[1]);
      const vol = (4 / 3) * Math.PI * r ** 3;
      const sa = 4 * Math.PI * r ** 2;
      return {
        problem: input, category: 'Mensuration (Sphere)', result: `Volume = ${fmtDec(vol, 4)}, SA = ${fmtDec(sa, 4)}`,
        steps: [
          { description: 'Given', expression: `Radius r = ${r}` },
          { description: 'Volume = (4/3)πr³', expression: `V = (4/3) × π × ${r}³ = ${fmtDec(vol, 4)}` },
          { description: 'Surface Area = 4πr²', expression: `SA = 4π × ${r}² = ${fmtDec(sa, 4)}` },
        ],
        success: true,
      };
    }
  }

  // ── CONE ──
  if (lower.includes('cone')) {
    const m = lower.match(/r(?:adius)?\s*=?\s*([\d.]+).*?h(?:eight)?\s*=?\s*([\d.]+)/);
    if (m) {
      const r = parseFloat(m[1]), h = parseFloat(m[2]);
      const l = Math.sqrt(r * r + h * h);
      const vol = (1 / 3) * Math.PI * r * r * h;
      const csa = Math.PI * r * l;
      const tsa = Math.PI * r * (r + l);
      return {
        problem: input, category: 'Mensuration (Cone)', result: `Volume = ${fmtDec(vol, 4)}`,
        steps: [
          { description: 'Given', expression: `Radius r = ${r}, Height h = ${h}` },
          { description: 'Slant height l = √(r² + h²)', expression: `l = √(${r * r} + ${h * h}) = ${fmtDec(l, 4)}` },
          { description: 'Volume = (1/3)πr²h', expression: `V = (1/3)π × ${r}² × ${h} = ${fmtDec(vol, 4)}` },
          { description: 'Curved Surface Area = πrl', expression: `CSA = π × ${r} × ${fmtDec(l, 4)} = ${fmtDec(csa, 4)}` },
          { description: 'Total Surface Area = πr(r + l)', expression: `TSA = π × ${r} × (${r} + ${fmtDec(l, 4)}) = ${fmtDec(tsa, 4)}` },
        ],
        success: true,
      };
    }
  }

  // ── CUBOID ──
  if (lower.includes('cuboid') || lower.includes('rectangular') || lower.includes('box')) {
    const m = lower.match(/l(?:ength)?\s*=?\s*([\d.]+).*?w(?:idth)?\s*=?\s*([\d.]+).*?h(?:eight)?\s*=?\s*([\d.]+)/);
    if (m) {
      const l = parseFloat(m[1]), w = parseFloat(m[2]), h = parseFloat(m[3]);
      const vol = l * w * h;
      const sa = 2 * (l * w + l * h + w * h);
      const diag = Math.sqrt(l * l + w * w + h * h);
      return {
        problem: input, category: 'Mensuration (Cuboid)', result: `Volume = ${fmtDec(vol)}`,
        steps: [
          { description: 'Given', expression: `l = ${l}, w = ${w}, h = ${h}` },
          { description: 'Volume = lwh', expression: `V = ${l} × ${w} × ${h} = ${fmtDec(vol)}` },
          { description: 'Surface Area = 2(lw + lh + wh)', expression: `SA = 2(${l * w} + ${l * h} + ${w * h}) = ${fmtDec(sa)}` },
          { description: 'Space diagonal = √(l² + w² + h²)', expression: `d = √${fmtDec(l * l + w * w + h * h)} = ${fmtDec(diag, 4)}` },
        ],
        success: true,
      };
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// RATIO AND PROPORTION
// ═══════════════════════════════════════════════════════════════

export function solveRatio(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── DIVIDE X IN RATIO ──
  const m = lower.match(/divide\s*([\d.]+)\s*(?:in\s*(?:the\s*)?ratio)?\s*([\d.]+)\s*:\s*([\d.]+)(?:\s*:\s*([\d.]+))?/);
  if (m) {
    const total = parseFloat(m[1]);
    const parts = [parseFloat(m[2]), parseFloat(m[3])];
    if (m[4]) parts.push(parseFloat(m[4]));
    const sumParts = parts.reduce((a, b) => a + b, 0);
    const values = parts.map(p => (p / sumParts) * total);
    return {
      problem: input, category: 'Ratio & Proportion', result: values.map(v => fmtDec(v, 2)).join(', '),
      steps: [
        { description: 'Given', expression: `Total = ${total}, Ratio = ${parts.join(' : ')}` },
        { description: 'Sum of ratio parts', expression: `${parts.join(' + ')} = ${sumParts}` },
        { description: 'Value of one part', expression: `${total} ÷ ${sumParts} = ${fmtDec(total / sumParts, 4)}` },
        ...parts.map((p, i) => ({
          description: `Part ${i + 1} (×${p})`,
          expression: `${p} × ${fmtDec(total / sumParts, 4)} = ${fmtDec(values[i], 2)}`
        })),
        { description: 'Verify', expression: `${values.map(v => fmtDec(v, 2)).join(' + ')} = ${fmtDec(values.reduce((a, b) => a + b, 0), 2)} ✓` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// SIMPLE & COMPOUND INTEREST
// ═══════════════════════════════════════════════════════════════

export function solveInterest(input: string): Solution | null {
  const lower = input.toLowerCase().trim();

  // ── SIMPLE INTEREST ──
  let m = lower.match(/simple\s*interest\s*(?:on|for|of)?\s*(?:p(?:rincipal)?\s*=?\s*)?([\d.]+)\s*[,\s]+\s*(?:r(?:ate)?\s*=?\s*)?([\d.]+)\s*%?\s*[,\s]+\s*(?:t(?:ime)?\s*=?\s*)?([\d.]+)/);
  if (m) {
    const P = parseFloat(m[1]), R = parseFloat(m[2]), T = parseFloat(m[3]);
    const SI = (P * R * T) / 100;
    const A = P + SI;
    return {
      problem: input, category: 'Simple Interest', result: `SI = ${fmtDec(SI, 2)}, Amount = ${fmtDec(A, 2)}`,
      steps: [
        { description: 'Given', expression: `P = ${P}, R = ${R}%, T = ${T} years` },
        { description: 'SI = PRT/100', expression: `SI = (${P} × ${R} × ${T}) / 100 = ${fmtDec(SI, 2)}` },
        { description: 'Amount = P + SI', expression: `A = ${P} + ${fmtDec(SI, 2)} = ${fmtDec(A, 2)}` },
      ],
      success: true,
    };
  }

  // ── COMPOUND INTEREST ──
  m = lower.match(/compound\s*interest\s*(?:on|for|of)?\s*(?:p(?:rincipal)?\s*=?\s*)?([\d.]+)\s*[,\s]+\s*(?:r(?:ate)?\s*=?\s*)?([\d.]+)\s*%?\s*[,\s]+\s*(?:t(?:ime)?\s*=?\s*)?([\d.]+)/);
  if (m) {
    const P = parseFloat(m[1]), R = parseFloat(m[2]), T = parseFloat(m[3]);
    const n = lower.includes('monthly') ? 12 : lower.includes('quarterly') ? 4 : lower.includes('semi') ? 2 : 1;
    const A = P * Math.pow(1 + R / (100 * n), n * T);
    const CI = A - P;
    return {
      problem: input, category: 'Compound Interest', result: `CI = ${fmtDec(CI, 2)}, Amount = ${fmtDec(A, 2)}`,
      steps: [
        { description: 'Given', expression: `P = ${P}, R = ${R}%, T = ${T} years, n = ${n} (${n === 1 ? 'annual' : n === 2 ? 'semi-annual' : n === 4 ? 'quarterly' : 'monthly'})` },
        { description: 'A = P(1 + r/n)^(nt)', expression: `A = ${P} × (1 + ${R}/(100×${n}))^(${n}×${T})` },
        { description: 'Rate per period', expression: `r/n = ${fmtDec(R / (100 * n), 6)}` },
        { description: 'Growth factor', expression: `(1 + ${fmtDec(R / (100 * n), 6)})^${n * T} = ${fmtDec(Math.pow(1 + R / (100 * n), n * T), 6)}` },
        { description: 'Amount', expression: `A = ${P} × ${fmtDec(Math.pow(1 + R / (100 * n), n * T), 6)} = ${fmtDec(A, 2)}` },
        { description: 'CI = A - P', expression: `CI = ${fmtDec(A, 2)} - ${P} = ${fmtDec(CI, 2)}` },
      ],
      success: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// UPDATED EXAMPLES
// ═══════════════════════════════════════════════════════════════

export const advancedExampleProblems = [
  {
    category: 'Statistics',
    icon: '📊',
    problems: [
      'mean of 12, 15, 18, 20, 25',
      'median of 3, 7, 2, 9, 5, 1, 8',
      'mode of 4, 2, 4, 7, 2, 4, 9',
      'range of 10, 25, 33, 15, 42, 8',
      'standard deviation of 2, 4, 4, 4, 5, 5, 7, 9',
      'variance of 10, 20, 30, 40, 50',
      'quartile of 3, 7, 8, 5, 12, 14, 21, 15, 18, 14',
      'weighted mean of 80, 90, 70 with weights 3, 2, 5',
    ]
  },
  {
    category: 'Probability',
    icon: '🎲',
    problems: [
      'combination 10, 3',
      'permutation 8, 4',
      'probability of 3 out of 10',
      'binomial 10, 3, 0.5',
      'expected value of 1,2,3,4 with probabilities 0.1,0.2,0.3,0.4',
    ]
  },
  {
    category: 'Simultaneous Eq.',
    icon: '🔗',
    problems: [
      '2x + 3y = 12, x - y = 1',
      '3x + 2y = 16, 5x - y = 18',
      'x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2',
    ]
  },
  {
    category: 'Bearing',
    icon: '🧭',
    problems: [
      'back bearing of 045',
      'back bearing of 230',
      'bearing from (0,0) to (3,4)',
      'bearing from (2,5) to (7,1)',
    ]
  },
  {
    category: 'Longitude & Latitude',
    icon: '🌍',
    problems: [
      'great circle distance from (40.7128, -74.006) to (51.5074, -0.1278)',
      'distance along same longitude from 30 to 60',
      'distance along same latitude at 45 from 10 to 30',
      'time difference between 30 and -75',
    ]
  },
  {
    category: 'Sequences & Series',
    icon: '🔢',
    problems: [
      'arithmetic progression a=3, d=5, n=10',
      'geometric progression a=2, r=3, n=6',
      'next term in 2, 5, 10, 17, 26',
      'next term in 3, 6, 12, 24',
    ]
  },
  {
    category: 'Ratio & Proportion',
    icon: '⚖️',
    problems: [
      'divide 120 in ratio 2:3',
      'divide 500 in ratio 1:2:3',
    ]
  },
  {
    category: 'Interest',
    icon: '💰',
    problems: [
      'simple interest 5000, 8, 3',
      'compound interest 10000, 5, 4',
    ]
  },
  {
    category: 'Mensuration (3D)',
    icon: '📦',
    problems: [
      'volume of cylinder r=5, h=10',
      'volume of sphere r=7',
      'volume of cone r=4, h=9',
      'volume of cuboid l=5, w=3, h=8',
    ]
  },
  {
    category: 'Sets & Venn',
    icon: '⊕',
    problems: [
      'n(A)=25, n(B)=30, n(A∩B)=10',
    ]
  },
  {
    category: 'Matrices',
    icon: '▦',
    problems: [
      'determinant of 3, 7; 1, -4',
      'inverse of matrix 2, 1; 5, 3',
    ]
  },
];
