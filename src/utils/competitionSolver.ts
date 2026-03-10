import { type Solution, type SolutionStep } from './mathSolver';

function fmtDec(n: number, dp: number = 4): string {
  return parseFloat(n.toFixed(dp)).toString();
}

// ─── GCD for fraction simplification ────────────────────────
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplifyFraction(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  num = Math.abs(Math.round(num));
  den = Math.abs(Math.round(den));
  const g = gcd(num, den);
  return [sign * num / g, den / g];
}

function fractionStr(num: number, den: number): string {
  const [n, d] = simplifyFraction(num, den);
  if (d === 1) return n.toString();
  return `${n}/${d}`;
}

// ═══════════════════════════════════════════════════════════════
// FRACTION EXPRESSION EVALUATOR
// Handles: if p = 1/3 and q = 2/3, find (q²-p²)/(q²+p²)
// ═══════════════════════════════════════════════════════════════

function parseFractionValue(s: string): number | null {
  s = s.trim();
  // Unicode fractions
  const unicodeFracs: Record<string, number> = {
    '½': 1/2, '⅓': 1/3, '⅔': 2/3, '¼': 1/4, '¾': 3/4,
    '⅕': 1/5, '⅖': 2/5, '⅗': 3/5, '⅘': 4/5,
    '⅙': 1/6, '⅚': 5/6, '⅐': 1/7, '⅛': 1/8, '⅜': 3/8, '⅝': 5/8, '⅞': 7/8,
    '⅑': 1/9, '⅒': 1/10, '⅟': 1,
  };
  if (unicodeFracs[s] !== undefined) return unicodeFracs[s];
  
  // Regular fraction a/b
  const fracMatch = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fracMatch) return parseInt(fracMatch[1]) / parseInt(fracMatch[2]);
  
  // Decimal or integer
  const num = parseFloat(s);
  if (!isNaN(num)) return num;
  
  return null;
}

export function solveFractionExpression(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // Pattern: "if p = 1/3 and q = 2/3, find (q²-p²)/(q²+p²)"
  // or "if p = ⅓ and q = ⅔, find ..."
  // Extract variable assignments
  const varAssignments: Record<string, number> = {};
  const steps: SolutionStep[] = [];
  
  // Find all variable = value patterns
  const assignPattern = /([a-z])\s*=\s*([-\d\/⅟½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒.]+)/gi;
  let assignMatch;
  while ((assignMatch = assignPattern.exec(lower)) !== null) {
    const varName = assignMatch[1].toLowerCase();
    const value = parseFractionValue(assignMatch[2]);
    if (value !== null) {
      varAssignments[varName] = value;
    }
  }
  
  if (Object.keys(varAssignments).length === 0) return null;
  
  // Find the expression to evaluate - after "find" or "evaluate" or "calculate" or "value of"
  const exprMatch = lower.match(/(?:find|evaluate|calculate|value\s+of|solve|what\s+is)\s+(?:the\s+)?(?:value\s+of\s+)?(.+?)$/i);
  if (!exprMatch) return null;
  
  let expr = exprMatch[1].trim();
  
  // Clean up the expression
  expr = expr.replace(/[.?!]+$/, '').trim();
  
  // Show given values
  steps.push({
    description: 'Given values',
    expression: Object.entries(varAssignments).map(([k, v]) => `${k} = ${fmtDec(v, 6)}`).join(', ')
  });
  
  // Substitute and evaluate
  // Convert superscript ² to ^2, ³ to ^3, etc.
  let evalExpr = expr
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4');
  
  steps.push({
    description: 'Expression to evaluate',
    expression: expr
  });
  
  // Try to evaluate as a fraction expression
  // Parse the expression structure
  try {
    // Replace variables with their values
    let substituted = evalExpr;
    for (const [varName, value] of Object.entries(varAssignments)) {
      // Replace variable^n with (value)^n
      substituted = substituted.replace(new RegExp(varName + '\\^(\\d+)', 'gi'), `(${value})^$1`);
      // Replace standalone variable
      substituted = substituted.replace(new RegExp(varName + '(?![a-z\\d])', 'gi'), `(${value})`);
    }
    
    steps.push({
      description: 'Substitute values',
      expression: substituted
    });
    
    // Try to evaluate as a fraction: numerator/denominator
    // Check if it's in the form (expr1)/(expr2)
    const fracExprMatch = evalExpr.match(/^\(?(.+?)\)?\s*\/\s*\(?(.+?)\)?$/);
    
    if (fracExprMatch) {
      let numExpr = fracExprMatch[1];
      let denExpr = fracExprMatch[2];
      
      // Evaluate numerator and denominator separately
      const evalWithVars = (e: string): number => {
        let s = e;
        for (const [varName, value] of Object.entries(varAssignments)) {
          s = s.replace(new RegExp(varName + '\\^(\\d+)', 'gi'), `Math.pow(${value},$1)`);
          s = s.replace(new RegExp(varName + '(?![a-z\\d])', 'gi'), `(${value})`);
        }
        s = s.replace(/(\d+(?:\.\d+)?)\^(\d+)/g, 'Math.pow($1,$2)');
        return Function(`"use strict"; return (${s})`)();
      };
      
      const numVal = evalWithVars(numExpr);
      const denVal = evalWithVars(denExpr);
      
      steps.push({
        description: 'Calculate numerator',
        expression: `${numExpr} = ${fmtDec(numVal, 6)}`
      });
      
      steps.push({
        description: 'Calculate denominator',
        expression: `${denExpr} = ${fmtDec(denVal, 6)}`
      });
      
      const result = numVal / denVal;
      
      // Try to express as a simple fraction
      // Find best fraction representation
      const [fracNum, fracDen] = findBestFraction(result);
      const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
      
      steps.push({
        description: 'Divide numerator by denominator',
        expression: `${fmtDec(numVal, 6)} / ${fmtDec(denVal, 6)} = ${fmtDec(result, 6)} = ${fracResult}`
      });
      
      return {
        problem: input,
        category: 'Fraction Expression',
        result: fracResult,
        steps,
        success: true
      };
    }
    
    // General evaluation
    const evalWithVars = (e: string): number => {
      let s = e;
      for (const [varName, value] of Object.entries(varAssignments)) {
        s = s.replace(new RegExp(varName + '\\^(\\d+)', 'gi'), `Math.pow(${value},$1)`);
        s = s.replace(new RegExp(varName + '(?![a-z\\d])', 'gi'), `(${value})`);
      }
      s = s.replace(/(\d+(?:\.\d+)?)\^(\d+)/g, 'Math.pow($1,$2)');
      return Function(`"use strict"; return (${s})`)();
    };
    
    const result = evalWithVars(evalExpr);
    const [fracNum, fracDen] = findBestFraction(result);
    const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
    
    steps.push({
      description: 'Final result',
      expression: `= ${fmtDec(result, 6)} = ${fracResult}`
    });
    
    return {
      problem: input,
      category: 'Fraction Expression',
      result: fracResult,
      steps,
      success: true
    };
  } catch {
    return null;
  }
}

function findBestFraction(value: number, maxDen: number = 1000): [number, number] {
  if (Number.isInteger(value)) return [value, 1];
  const sign = value < 0 ? -1 : 1;
  value = Math.abs(value);
  
  let bestNum = Math.round(value);
  let bestDen = 1;
  let bestErr = Math.abs(value - bestNum);
  
  for (let d = 2; d <= maxDen; d++) {
    const n = Math.round(value * d);
    const err = Math.abs(value - n / d);
    if (err < bestErr) {
      bestErr = err;
      bestNum = n;
      bestDen = d;
      if (err < 1e-10) break;
    }
  }
  
  const g = gcd(bestNum, bestDen);
  return [sign * bestNum / g, bestDen / g];
}


// ═══════════════════════════════════════════════════════════════
// NUMBER BASE CONVERSION
// Handles: 47 base 8, 64 base 6, convert to base 10, etc.
// ═══════════════════════════════════════════════════════════════

export function solveNumberBase(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // Pattern: "rearrange in ascending order: 47_eight, 64_six, 72_five"
  const orderMatch = lower.match(/(?:rearrange|arrange|order|sort|ascending|descending).*?(\d+)\s*(?:_|base\s*|in\s*base\s*)(\w+).*?(\d+)\s*(?:_|base\s*|in\s*base\s*)(\w+).*?(\d+)\s*(?:_|base\s*|in\s*base\s*)(\w+)/i);
  if (orderMatch) {
    const wordToNum: Record<string, number> = {
      'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
      'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'twelve': 12, 'sixteen': 16,
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, '16': 16,
    };
    
    const items = [
      { digits: orderMatch[1], base: wordToNum[orderMatch[2]] || parseInt(orderMatch[2]) },
      { digits: orderMatch[3], base: wordToNum[orderMatch[4]] || parseInt(orderMatch[4]) },
      { digits: orderMatch[5], base: wordToNum[orderMatch[6]] || parseInt(orderMatch[6]) },
    ];
    
    const steps: SolutionStep[] = [
      { description: 'Convert each number to base 10', expression: '' }
    ];
    
    const values = items.map(item => {
      let val = 0;
      const digits = item.digits.split('');
      for (let i = 0; i < digits.length; i++) {
        val += parseInt(digits[i]) * Math.pow(item.base, digits.length - 1 - i);
      }
      steps.push({
        description: `Convert ${item.digits} (base ${item.base}) to base 10`,
        expression: digits.map((d, i) => `${d} × ${item.base}^${digits.length - 1 - i}`).join(' + ') + ` = ${val}`
      });
      return { ...item, decimal: val };
    });
    
    const isAscending = lower.includes('ascending') || !lower.includes('descending');
    const sorted = [...values].sort((a, b) => isAscending ? a.decimal - b.decimal : b.decimal - a.decimal);
    
    steps.push({
      description: `${isAscending ? 'Ascending' : 'Descending'} order by decimal value`,
      expression: sorted.map(v => `${v.digits}(base ${v.base}) = ${v.decimal}`).join(', ')
    });
    
    const result = sorted.map(v => `${v.digits}(base ${v.base})`).join(', ');
    steps.push({ description: 'Final order', expression: result });
    
    return { problem: input, category: 'Number Base', result, steps, success: true };
  }
  
  // Pattern: "convert 47 base 8 to base 10" or "47_eight to decimal"
  const convertMatch = lower.match(/(?:convert\s+)?(\w+)\s*(?:_|base\s*|in\s*base\s*)(\w+)\s*(?:to\s*(?:base\s*)?(\w+))?/);
  if (convertMatch && (lower.includes('base') || lower.includes('convert') || lower.includes('binary') || lower.includes('octal') || lower.includes('hex'))) {
    const wordToNum: Record<string, number> = {
      'two': 2, 'binary': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
      'seven': 7, 'eight': 8, 'octal': 8, 'nine': 9, 'ten': 10, 'decimal': 10,
      'twelve': 12, 'sixteen': 16, 'hex': 16, 'hexadecimal': 16,
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, '16': 16,
    };
    
    const number = convertMatch[1];
    const fromBase = wordToNum[convertMatch[2]] || parseInt(convertMatch[2]);
    const toBase = convertMatch[3] ? (wordToNum[convertMatch[3]] || parseInt(convertMatch[3])) : 10;
    
    if (isNaN(fromBase) || fromBase < 2) return null;
    
    // Convert from base to decimal
    const digits = number.split('');
    let decimal = 0;
    const steps: SolutionStep[] = [
      { description: `Convert ${number} from base ${fromBase}`, expression: '' }
    ];
    
    for (let i = 0; i < digits.length; i++) {
      const digitVal = parseInt(digits[i], 36); // supports hex digits
      decimal += digitVal * Math.pow(fromBase, digits.length - 1 - i);
    }
    
    steps.push({
      description: 'Expand using positional notation',
      expression: digits.map((d, i) => `${d} × ${fromBase}^${digits.length - 1 - i}`).join(' + ') + ` = ${decimal}`
    });
    
    if (toBase !== 10) {
      // Convert decimal to target base
      let result = '';
      let temp = decimal;
      const convSteps: string[] = [];
      while (temp > 0) {
        const remainder = temp % toBase;
        convSteps.push(`${temp} ÷ ${toBase} = ${Math.floor(temp / toBase)} remainder ${remainder}`);
        result = remainder.toString(36).toUpperCase() + result;
        temp = Math.floor(temp / toBase);
      }
      
      steps.push({ description: `Convert ${decimal} to base ${toBase}`, expression: convSteps.join('\n') });
      steps.push({ description: 'Read remainders bottom to top', expression: `${number} (base ${fromBase}) = ${result} (base ${toBase})` });
      
      return { problem: input, category: 'Number Base', result: `${result} (base ${toBase})`, steps, success: true };
    }
    
    steps.push({ description: 'Result in base 10', expression: `${number} (base ${fromBase}) = ${decimal}` });
    return { problem: input, category: 'Number Base', result: decimal.toString(), steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// INVERSE/DIRECT VARIATION
// ═══════════════════════════════════════════════════════════════

export function solveVariation(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "P varies inversely as the square root of Q. When P = 1/16, Q = 16, find P when Q = 9"
  const invSqrtMatch = lower.match(/(\w)\s*varies?\s*inversely\s*(?:as|with)\s*(?:the\s*)?(?:square\s*root|sqrt|√)\s*(?:of\s*)?(\w).*?(?:when\s*)?(\w)\s*(?:=|is)\s*([\d.\/]+).*?(\w)\s*(?:=|is)\s*([\d.\/]+).*?find\s*(\w)\s*when\s*(\w)\s*(?:=|is)\s*([\d.\/]+)/i);
  if (invSqrtMatch) {
    const P1 = parseFractionValue(invSqrtMatch[4]) || 0;
    const Q1 = parseFractionValue(invSqrtMatch[6]) || 0;
    const Q2 = parseFractionValue(invSqrtMatch[9]) || 0;
    
    // P = k / √Q → k = P × √Q
    const k = P1 * Math.sqrt(Q1);
    const P2 = k / Math.sqrt(Q2);
    
    const [fracNum, fracDen] = findBestFraction(P2);
    const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
    
    const steps: SolutionStep[] = [
      { description: 'Identify the relationship', expression: `P ∝ 1/√Q → P = k/√Q` },
      { description: 'Find the constant k using given values', expression: `When P = ${fmtDec(P1)}, Q = ${Q1}` },
      { description: 'Substitute to find k', expression: `${fmtDec(P1)} = k/√${Q1} → k = ${fmtDec(P1)} × √${Q1} = ${fmtDec(P1)} × ${fmtDec(Math.sqrt(Q1))} = ${fmtDec(k)}` },
      { description: 'Write the formula with k', expression: `P = ${fmtDec(k)}/√Q` },
      { description: `Find P when Q = ${Q2}`, expression: `P = ${fmtDec(k)}/√${Q2} = ${fmtDec(k)}/${fmtDec(Math.sqrt(Q2))} = ${fmtDec(P2)} = ${fracResult}` },
    ];
    
    return { problem: input, category: 'Variation', result: fracResult, steps, success: true };
  }
  
  // General "varies inversely as Q" or "varies inversely as Q^2"
  const invMatch = lower.match(/(\w)\s*varies?\s*inversely\s*(?:as|with)\s*(?:the\s*)?(?:square\s+of\s+)?(\w)(?:\^?(\d))?.*?(?:when\s*)?(\w)\s*(?:=|is)\s*([\d.\/]+).*?(\w)\s*(?:=|is)\s*([\d.\/]+).*?find\s*(\w)\s*when\s*(\w)\s*(?:=|is)\s*([\d.\/]+)/i);
  if (invMatch) {
    const power = invMatch[3] ? parseInt(invMatch[3]) : (lower.includes('square of') ? 2 : 1);
    const P1 = parseFractionValue(invMatch[5]) || 0;
    const Q1 = parseFractionValue(invMatch[7]) || 0;
    const Q2 = parseFractionValue(invMatch[10]) || 0;
    
    const k = P1 * Math.pow(Q1, power);
    const P2 = k / Math.pow(Q2, power);
    
    const [fracNum, fracDen] = findBestFraction(P2);
    const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
    
    const powerStr = power === 1 ? '' : `^${power}`;
    const steps: SolutionStep[] = [
      { description: 'Identify the relationship', expression: `P ∝ 1/Q${powerStr} → P = k/Q${powerStr}` },
      { description: 'Find k', expression: `k = P × Q${powerStr} = ${fmtDec(P1)} × ${Q1}${powerStr} = ${fmtDec(k)}` },
      { description: `Find P when Q = ${Q2}`, expression: `P = ${fmtDec(k)}/${Q2}${powerStr} = ${fmtDec(k)}/${fmtDec(Math.pow(Q2, power))} = ${fmtDec(P2)} = ${fracResult}` },
    ];
    
    return { problem: input, category: 'Variation', result: fracResult, steps, success: true };
  }
  
  // Direct variation
  const directMatch = lower.match(/(\w)\s*varies?\s*(?:directly\s*)?(?:as|with)\s*(?:the\s*)?(?:square\s+of\s+)?(\w)(?:\^?(\d))?.*?(?:when\s*)?(\w)\s*(?:=|is)\s*([\d.\/]+).*?(\w)\s*(?:=|is)\s*([\d.\/]+).*?find\s*(\w)\s*when\s*(\w)\s*(?:=|is)\s*([\d.\/]+)/i);
  if (directMatch && !lower.includes('inversely')) {
    const power = directMatch[3] ? parseInt(directMatch[3]) : (lower.includes('square of') ? 2 : 1);
    const P1 = parseFractionValue(directMatch[5]) || 0;
    const Q1 = parseFractionValue(directMatch[7]) || 0;
    const Q2 = parseFractionValue(directMatch[10]) || 0;
    
    const k = P1 / Math.pow(Q1, power);
    const P2 = k * Math.pow(Q2, power);
    
    const [fracNum, fracDen] = findBestFraction(P2);
    const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
    
    const steps: SolutionStep[] = [
      { description: 'Identify the relationship', expression: `P ∝ Q^${power} → P = kQ^${power}` },
      { description: 'Find k', expression: `k = P/Q^${power} = ${fmtDec(P1)}/${fmtDec(Math.pow(Q1, power))} = ${fmtDec(k)}` },
      { description: `Find P when Q = ${Q2}`, expression: `P = ${fmtDec(k)} × ${Q2}^${power} = ${fmtDec(k)} × ${fmtDec(Math.pow(Q2, power))} = ${fmtDec(P2)} = ${fracResult}` },
    ];
    
    return { problem: input, category: 'Variation', result: fracResult, steps, success: true };
  }
  
  // Force variation: "F varies inversely as sqrt(d)..."
  const forceMatch = lower.match(/(\w)\s*=\s*([\d.]+)\s*(?:newtons?|n)?\s*when\s*(\w)\s*=\s*([\d.]+).*?(?:find|what\s+is)\s*(\w)\s*when\s*(\w)\s*=\s*([\d.]+)/i);
  if (forceMatch && lower.includes('varies')) {
    const val1 = parseFloat(forceMatch[2]);
    const var2val1 = parseFloat(forceMatch[4]);
    const var2val2 = parseFloat(forceMatch[7]);
    
    const isInverse = lower.includes('inversely');
    const isSqrt = lower.includes('square root') || lower.includes('sqrt');
    const isSquare = lower.includes('square of') && !isSqrt;
    
    let power = 1;
    if (isSqrt) power = 0.5;
    else if (isSquare) power = 2;
    
    let k: number, result: number;
    if (isInverse) {
      k = val1 * Math.pow(var2val1, power);
      result = k / Math.pow(var2val2, power);
    } else {
      k = val1 / Math.pow(var2val1, power);
      result = k * Math.pow(var2val2, power);
    }
    
    const [fracNum, fracDen] = findBestFraction(result);
    const fracResult = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
    
    const steps: SolutionStep[] = [
      { description: 'Given relationship', expression: isInverse ? `F ∝ 1/d^${power}` : `F ∝ d^${power}` },
      { description: 'Find constant k', expression: `k = ${fmtDec(k)}` },
      { description: 'Calculate result', expression: `F = ${fmtDec(result)} = ${fracResult}` },
    ];
    
    return { problem: input, category: 'Variation', result: `${fmtDec(result)} = ${fracResult}`, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// AGE WORD PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveAgeProblems(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/(?:age|old|year|ago|elder|younger)/)) return null;
  
  // "Five years ago, a father was three times as old as his daughter. 
  //  Last year, their combined age was 108, how old will the father be next year?"
  const agoTimesMatch = lower.match(/(\w+)\s*years?\s*ago.*?(\w+)\s*(?:was|were)\s*(\w+)\s*times?\s*(?:as\s*old\s*(?:as)?|the\s*age\s*of)\s*(?:his|her|the)?\s*(\w+)/i);
  const combinedMatch = lower.match(/(?:last\s*year|(\w+)\s*years?\s*ago).*?(?:combined|total|sum|together)\s*(?:age\s*)?(?:was|were|is)\s*(\d+)/i);
  
  if (agoTimesMatch && combinedMatch) {
    const wordToNum: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'last': 1,
    };
    
    const yearsAgo1 = wordToNum[agoTimesMatch[1]] || parseInt(agoTimesMatch[1]) || 0;
    const multiplier = wordToNum[agoTimesMatch[3]] || parseInt(agoTimesMatch[3]) || 0;
    const combinedYearsAgo = combinedMatch[1] ? (wordToNum[combinedMatch[1]] || parseInt(combinedMatch[1]) || 1) : 1;
    const combinedAge = parseInt(combinedMatch[2]);
    
    // Let father's current age = F, daughter's current age = D
    // yearsAgo1 years ago: F - yearsAgo1 = multiplier * (D - yearsAgo1)
    // combinedYearsAgo years ago: (F - combinedYearsAgo) + (D - combinedYearsAgo) = combinedAge
    // From eq2: F + D = combinedAge + 2 * combinedYearsAgo
    // From eq1: F - yearsAgo1 = multiplier * D - multiplier * yearsAgo1
    //           F = multiplier * D - multiplier * yearsAgo1 + yearsAgo1
    //           F = multiplier * D + yearsAgo1(1 - multiplier)
    
    const sumNow = combinedAge + 2 * combinedYearsAgo;
    // F = multiplier * D + yearsAgo1 * (1 - multiplier)
    // multiplier * D + yearsAgo1 * (1 - multiplier) + D = sumNow
    // D * (multiplier + 1) = sumNow - yearsAgo1 * (1 - multiplier)
    const D = (sumNow - yearsAgo1 * (1 - multiplier)) / (multiplier + 1);
    const F = sumNow - D;
    
    const askNextYear = lower.includes('next year') || lower.includes('will be');
    const result = askNextYear ? F + 1 : F;
    
    const steps: SolutionStep[] = [
      { description: 'Let F = father\'s current age, D = daughter\'s current age', expression: '' },
      { description: `${yearsAgo1} years ago, father was ${multiplier} times daughter's age`, expression: `F - ${yearsAgo1} = ${multiplier}(D - ${yearsAgo1})` },
      { description: `${combinedYearsAgo === 1 ? 'Last year' : `${combinedYearsAgo} years ago`}, combined age was ${combinedAge}`, expression: `(F - ${combinedYearsAgo}) + (D - ${combinedYearsAgo}) = ${combinedAge}` },
      { description: 'From equation 2: their current combined age', expression: `F + D = ${combinedAge} + ${2 * combinedYearsAgo} = ${sumNow}` },
      { description: 'From equation 1: expand', expression: `F = ${multiplier}D - ${multiplier * yearsAgo1} + ${yearsAgo1} = ${multiplier}D + ${yearsAgo1 * (1 - multiplier)}` },
      { description: 'Substitute into F + D = ' + sumNow, expression: `${multiplier}D + ${yearsAgo1 * (1 - multiplier)} + D = ${sumNow}` },
      { description: 'Solve for D', expression: `${multiplier + 1}D = ${sumNow - yearsAgo1 * (1 - multiplier)} → D = ${fmtDec(D)}` },
      { description: 'Find F', expression: `F = ${sumNow} - ${fmtDec(D)} = ${fmtDec(F)}` },
      { description: askNextYear ? 'Father\'s age next year' : 'Father\'s current age', expression: askNextYear ? `${fmtDec(F)} + 1 = ${fmtDec(result)}` : `${fmtDec(result)} years` },
    ];
    
    return { problem: input, category: 'Age Problem', result: `${fmtDec(result)} years`, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// PERFECT SQUARE COMPLETION
// ═══════════════════════════════════════════════════════════════

export function solvePerfectSquare(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/perfect\s*square/)) return null;
  
  // "What value of K makes x² - 12x + K a perfect square?"
  // or "What value of K makes x² - 12x - K a perfect square?"
  const match = lower.match(/(\w)\s*(?:=|makes?|will\s*make)?\s*.*?(\w)\s*[²\^2]\s*([+-])\s*([\d.]+)\s*\1\s*([+-])\s*(\w)/i) ||
                lower.match(/(\w)\s*[²\^2]\s*([+-])\s*([\d.]+)\s*(\w)\s*([+-])\s*(\w).*?perfect\s*square/i);
  
  if (!match) {
    // Try simpler pattern: x² - 12x + K or x² - 12x - K
    const simpler = lower.match(/(\w)\^?2?\s*[²]?\s*([+-])\s*([\d.]+)\s*\1\s*([+-])\s*(\w).*?perfect/i);
    if (simpler) {
      const b = parseFloat(simpler[3]);
      const bSign = simpler[2] === '-' ? -1 : 1;
      const kSign = simpler[4] === '-' ? -1 : 1;
      
      // For x² + bx + c to be perfect square: c = (b/2)²
      const halfB = (bSign * b) / 2;
      const needed = halfB * halfB;
      const K = kSign > 0 ? needed : -needed;
      
      const steps: SolutionStep[] = [
        { description: 'For a perfect square trinomial: x² + bx + c, we need c = (b/2)²', expression: '' },
        { description: 'Identify b', expression: `b = ${bSign * b}` },
        { description: 'Calculate (b/2)²', expression: `(${bSign * b}/2)² = (${fmtDec(halfB)})² = ${fmtDec(needed)}` },
        { description: kSign < 0 ? 'Since expression has -K, K must be negative of needed value' : 'K equals the needed value', expression: `K = ${fmtDec(K)}` },
        { description: 'The perfect square trinomial', expression: `x² ${bSign < 0 ? '-' : '+'} ${b}x + ${fmtDec(needed)} = (x ${bSign < 0 ? '-' : '+'} ${fmtDec(Math.abs(halfB))})²` },
      ];
      
      return { problem: input, category: 'Perfect Square', result: `K = ${fmtDec(K)}`, steps, success: true };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// SPEED / DISTANCE / TIME
// ═══════════════════════════════════════════════════════════════

export function solveSpeedDistanceTime(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "covers 960 meters in 16 seconds... how many km in 45 minutes"
  const coverMatch = lower.match(/covers?\s*([\d.]+)\s*(m(?:eters?)?|km|kilometers?|miles?)\s*(?:in|per)\s*([\d.]+)\s*(seconds?|sec|s|minutes?|min|hours?|hr|h)/i);
  if (coverMatch) {
    let dist1 = parseFloat(coverMatch[1]);
    let unit1 = coverMatch[2].toLowerCase();
    let time1 = parseFloat(coverMatch[3]);
    let timeUnit1 = coverMatch[4].toLowerCase();
    
    // Convert to meters and seconds
    if (unit1.startsWith('km') || unit1.startsWith('kilom')) dist1 *= 1000;
    if (unit1.startsWith('mile')) dist1 *= 1609.34;
    if (timeUnit1.startsWith('min')) time1 *= 60;
    if (timeUnit1.startsWith('h')) time1 *= 3600;
    
    const speedMps = dist1 / time1; // m/s
    
    const steps: SolutionStep[] = [
      { description: 'Calculate speed', expression: `Speed = Distance / Time = ${coverMatch[1]} ${coverMatch[2]} / ${coverMatch[3]} ${coverMatch[4]}` },
      { description: 'Speed in m/s', expression: `${fmtDec(dist1)} m / ${fmtDec(time1)} s = ${fmtDec(speedMps)} m/s` },
    ];
    
    // Check for "how far in X time" or "how many km in X minutes"
    const howFarMatch = lower.match(/how\s*(?:many|far|much)?\s*(km|kilometers?|m(?:eters?)?|miles?)?\s*(?:will|in|does|can|would)?\s*(?:it|he|she|the\s+\w+)?\s*(?:cover|travel|fly|go|move)?\s*(?:in|for|after)?\s*([\d.]+)\s*(seconds?|sec|s|minutes?|min|hours?|hr|h)/i);
    
    if (howFarMatch) {
      let time2 = parseFloat(howFarMatch[2]);
      const timeUnit2 = howFarMatch[3].toLowerCase();
      const targetUnit = howFarMatch[1] ? howFarMatch[1].toLowerCase() : 'km';
      
      if (timeUnit2.startsWith('min')) time2 *= 60;
      if (timeUnit2.startsWith('h')) time2 *= 3600;
      
      let distance = speedMps * time2; // in meters
      
      steps.push({
        description: `Calculate distance in ${howFarMatch[2]} ${howFarMatch[3]}`,
        expression: `Distance = ${fmtDec(speedMps)} m/s × ${fmtDec(time2)} s = ${fmtDec(distance)} m`
      });
      
      if (targetUnit.startsWith('km') || targetUnit.startsWith('kilom')) {
        distance /= 1000;
        steps.push({ description: 'Convert to km', expression: `${fmtDec(distance * 1000)} m = ${fmtDec(distance)} km` });
      } else if (targetUnit.startsWith('mile')) {
        distance /= 1609.34;
        steps.push({ description: 'Convert to miles', expression: `${fmtDec(distance)} miles` });
      }
      
      return { problem: input, category: 'Speed/Distance/Time', result: `${fmtDec(distance)} ${targetUnit.startsWith('km') ? 'km' : targetUnit.startsWith('mile') ? 'miles' : 'm'}`, steps, success: true };
    }
    
    // Convert speed to different units
    const speedKmph = speedMps * 3.6;
    steps.push({ description: 'Speed in km/h', expression: `${fmtDec(speedMps)} × 3.6 = ${fmtDec(speedKmph)} km/h` });
    
    return { problem: input, category: 'Speed/Distance/Time', result: `${fmtDec(speedMps)} m/s = ${fmtDec(speedKmph)} km/h`, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// ALGEBRAIC SIMPLIFICATION
// ═══════════════════════════════════════════════════════════════

export function solveAlgebraicSimplify(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "Simplify (6a + 3b - 4) - (2a - 7b + 6)"
  if (!lower.match(/simplif/i)) return null;
  
  const exprMatch = lower.match(/simplif[y|ied|ication]\s*:?\s*(.+)/i);
  if (!exprMatch) return null;
  
  const expr = exprMatch[1].trim();
  
  // Handle subtraction of expressions: (expr1) - (expr2) or (expr1) + (expr2)
  const bracketMatch = expr.match(/\(([^)]+)\)\s*([+-])\s*\(([^)]+)\)/);
  if (bracketMatch) {
    const expr1 = bracketMatch[1].trim();
    const op = bracketMatch[2];
    const expr2 = bracketMatch[3].trim();
    
    const steps: SolutionStep[] = [
      { description: 'Write the expression', expression: `(${expr1}) ${op} (${expr2})` },
    ];
    
    // Parse terms from each expression
    const parseTerms = (s: string): Record<string, number> => {
      const terms: Record<string, number> = {};
      const regex = /([+-]?\s*\d*\.?\d*)\s*([a-z]*)/gi;
      let m;
      while ((m = regex.exec(s)) !== null) {
        if (!m[0].trim()) continue;
        let coeff = m[1].replace(/\s/g, '');
        const variable = m[2] || '_const';
        let coeffNum: number;
        if (coeff === '' || coeff === '+') coeffNum = 1;
        else if (coeff === '-') coeffNum = -1;
        else coeffNum = parseFloat(coeff);
        if (isNaN(coeffNum)) continue;
        terms[variable] = (terms[variable] || 0) + coeffNum;
      }
      return terms;
    };
    
    const terms1 = parseTerms(expr1);
    const terms2 = parseTerms(expr2);
    
    if (op === '-') {
      steps.push({ description: 'Distribute the negative sign to the second bracket', expression: `${expr1} ${Object.entries(terms2).map(([v, c]) => `${-c >= 0 ? '+' : ''}${-c}${v === '_const' ? '' : v}`).join(' ')}` });
    } else {
      steps.push({ description: 'Remove brackets (addition)', expression: `${expr1} + ${expr2}` });
    }
    
    // Combine like terms
    const combined: Record<string, number> = { ...terms1 };
    for (const [variable, coeff] of Object.entries(terms2)) {
      const adjustedCoeff = op === '-' ? -coeff : coeff;
      combined[variable] = (combined[variable] || 0) + adjustedCoeff;
    }
    
    steps.push({ description: 'Collect like terms', expression: Object.entries(combined).filter(([, c]) => c !== 0).map(([v, c]) => v === '_const' ? fmtDec(c) : `${c === 1 ? '' : c === -1 ? '-' : fmtDec(c)}${v}`).join(' + ').replace(/\+ -/g, '- ') });
    
    const result = Object.entries(combined)
      .filter(([, c]) => c !== 0)
      .map(([v, c]) => v === '_const' ? fmtDec(c) : `${c === 1 ? '' : c === -1 ? '-' : fmtDec(c)}${v}`)
      .join(' + ')
      .replace(/\+ -/g, '- ');
    
    steps.push({ description: 'Final simplified expression', expression: result });
    
    return { problem: input, category: 'Algebraic Simplification', result, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// PERCENTAGE ERROR
// ═══════════════════════════════════════════════════════════════

export function solvePercentageError(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/percent(?:age)?\s*error/)) return null;
  
  // "actual cost was 20.00, priced at 18.50, what is the percentage error"
  const match = lower.match(/(?:actual|true|correct|real)\s*(?:cost|value|price|amount)?\s*(?:was|is|=)?\s*([\d.]+).*?(?:measured|given|priced|estimated|observed)\s*(?:at|as|cost|value|price|amount)?\s*(?:was|is|=|at)?\s*([\d.]+)/i) ||
                lower.match(/([\d.]+).*?(?:actual|true|correct).*?([\d.]+).*?(?:measured|given|priced|estimated|observed)/i) ||
                lower.match(/(?:priced|measured|estimated)\s*(?:at)?\s*([\d.]+).*?(?:actual|true|correct|real)\s*(?:cost|value)?\s*(?:was|is)?\s*([\d.]+)/i);
  
  if (match) {
    let actual: number, measured: number;
    if (lower.indexOf('actual') < lower.indexOf('priced') || lower.indexOf('actual') < lower.indexOf('measured')) {
      actual = parseFloat(match[1]);
      measured = parseFloat(match[2]);
    } else {
      measured = parseFloat(match[1]);
      actual = parseFloat(match[2]);
    }
    
    // Try to figure out which is actual and which is measured from context
    if (lower.match(/priced\s*(?:at)?\s*[\d.]+.*?actual.*?[\d.]+/)) {
      measured = parseFloat(match[1] || match[2]);
      actual = parseFloat(match[2] || match[1]);
      // Re-parse
      const priceMatch = lower.match(/priced\s*(?:at)?\s*([\d.]+)/);
      const actualMatch = lower.match(/actual\s*(?:cost|value|price)?\s*(?:was|is)?\s*([\d.]+)/);
      if (priceMatch && actualMatch) {
        measured = parseFloat(priceMatch[1]);
        actual = parseFloat(actualMatch[1]);
      }
    }
    
    const error = Math.abs(actual - measured);
    const pctError = (error / actual) * 100;
    
    const steps: SolutionStep[] = [
      { description: 'Identify values', expression: `Actual value = ${actual}\nMeasured/Given value = ${measured}` },
      { description: 'Calculate absolute error', expression: `|${actual} - ${measured}| = ${fmtDec(error)}` },
      { description: 'Percentage Error = (|Error| / Actual) × 100', expression: `(${fmtDec(error)} / ${actual}) × 100 = ${fmtDec(pctError, 2)}%` },
    ];
    
    return { problem: input, category: 'Percentage Error', result: `${fmtDec(pctError, 1)}%`, steps, success: true };
  }
  
  // Simpler pattern with just two numbers
  const simpleMatch = lower.match(/percent(?:age)?\s*error.*?([\d.]+).*?([\d.]+)/);
  if (simpleMatch) {
    const a = parseFloat(simpleMatch[1]);
    const b = parseFloat(simpleMatch[2]);
    const actual = Math.max(a, b);
    const measured = Math.min(a, b);
    const error = Math.abs(actual - measured);
    const pctError = (error / actual) * 100;
    
    return {
      problem: input, category: 'Percentage Error', result: `${fmtDec(pctError, 1)}%`,
      steps: [
        { description: 'Error', expression: `|${actual} - ${measured}| = ${fmtDec(error)}` },
        { description: '% Error', expression: `(${fmtDec(error)}/${actual}) × 100 = ${fmtDec(pctError, 1)}%` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// ROMAN NUMERALS
// ═══════════════════════════════════════════════════════════════

export function solveRomanNumerals(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // Check if input contains roman numerals
  const romanPattern = /\b([IVXLCDM]+)\b/g;
  const hasRoman = input.match(romanPattern);
  if (!hasRoman || hasRoman.length < 1) return null;
  if (!lower.match(/roman|ratio|simplif|convert/i) && hasRoman.length < 2) return null;
  
  const romanToDecimal = (s: string): number => {
    const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;
    for (let i = 0; i < s.length; i++) {
      if (i + 1 < s.length && values[s[i]] < values[s[i + 1]]) {
        result -= values[s[i]];
      } else {
        result += values[s[i]];
      }
    }
    return result;
  };
  
  const decimalToRoman = (num: number): string => {
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < vals.length; i++) {
      while (num >= vals[i]) {
        result += syms[i];
        num -= vals[i];
      }
    }
    return result;
  };
  
  // Ratio of roman numerals: "CLII : CLXXVI in simplest form"
  const ratioMatch = input.match(/([IVXLCDM]+)\s*:\s*([IVXLCDM]+)/);
  if (ratioMatch) {
    const val1 = romanToDecimal(ratioMatch[1]);
    const val2 = romanToDecimal(ratioMatch[2]);
    const g = gcd(val1, val2);
    const simplified1 = val1 / g;
    const simplified2 = val2 / g;
    
    const steps: SolutionStep[] = [
      { description: 'Convert roman numerals to decimal', expression: `${ratioMatch[1]} = ${val1}, ${ratioMatch[2]} = ${val2}` },
      { description: 'Find GCD', expression: `GCD(${val1}, ${val2}) = ${g}` },
      { description: 'Simplify ratio', expression: `${val1}:${val2} = ${val1/g}:${val2/g} = ${simplified1}:${simplified2}` },
      { description: 'Convert back to Roman numerals', expression: `${decimalToRoman(simplified1)} : ${decimalToRoman(simplified2)}` },
    ];
    
    return { problem: input, category: 'Roman Numerals', result: `${decimalToRoman(simplified1)} : ${decimalToRoman(simplified2)} (${simplified1}:${simplified2})`, steps, success: true };
  }
  
  // Simple conversion
  if (hasRoman.length >= 1) {
    const steps: SolutionStep[] = [];
    const results: string[] = [];
    for (const roman of hasRoman) {
      if (roman.length < 1) continue;
      const val = romanToDecimal(roman);
      steps.push({ description: `Convert ${roman}`, expression: `${roman} = ${val}` });
      results.push(`${roman} = ${val}`);
    }
    
    if (results.length > 0) {
      return { problem: input, category: 'Roman Numerals', result: results.join(', '), steps, success: true };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// WORK RATE PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveWorkRate(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "6 workers can complete in 20 days, how many days for 15 workers"
  const workersMatch = lower.match(/(\d+)\s*(?:workers?|men|women|people|persons?)\s*(?:can\s*)?(?:complete|finish|do|build|make)\s*.*?(?:in|takes?)\s*(\d+)\s*(?:days?|hours?|minutes?)/i);
  const findDaysMatch = lower.match(/(?:how\s*(?:many|long)|find)\s*(?:days?|hours?)?\s*(?:will|would|for|if)?\s*(\d+)\s*(?:workers?|men|women|people|persons?)/i);
  const findWorkersMatch = lower.match(/(?:how\s*many)\s*(?:workers?|men|women|people|persons?)\s*.*?(\d+)\s*(?:days?|hours?)/i);
  
  if (workersMatch && (findDaysMatch || findWorkersMatch)) {
    const workers1 = parseInt(workersMatch[1]);
    const time1 = parseInt(workersMatch[2]);
    const totalWork = workers1 * time1;
    
    if (findDaysMatch) {
      const workers2 = parseInt(findDaysMatch[1]);
      const time2 = totalWork / workers2;
      
      return {
        problem: input, category: 'Work Rate', result: `${fmtDec(time2)} days`,
        steps: [
          { description: 'Calculate total work units', expression: `Total work = ${workers1} workers × ${time1} days = ${totalWork} worker-days` },
          { description: 'With new number of workers', expression: `${workers2} workers` },
          { description: 'Time needed = Total work / Workers', expression: `Time = ${totalWork} / ${workers2} = ${fmtDec(time2)} days` },
        ],
        success: true,
      };
    }
    
    if (findWorkersMatch) {
      const time2 = parseInt(findWorkersMatch[1]);
      const workers2 = totalWork / time2;
      
      return {
        problem: input, category: 'Work Rate', result: `${Math.ceil(workers2)} workers`,
        steps: [
          { description: 'Total work', expression: `${workers1} × ${time1} = ${totalWork} worker-days` },
          { description: 'Workers needed', expression: `${totalWork} / ${time2} = ${fmtDec(workers2)} ≈ ${Math.ceil(workers2)} workers` },
        ],
        success: true,
      };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// PROFIT AND LOSS
// ═══════════════════════════════════════════════════════════════

export function solveProfitLoss(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/profit|loss|sold|cost|selling\s*price|marked\s*price/)) return null;
  
  // "sold at profit of 15%..." patterns
  const costMatch = lower.match(/cost\s*(?:price|of)?\s*(?:was|is|=)?\s*(?:₦|N|\$)?(\d+[\d,]*)/i);
  const profitPctMatch = lower.match(/profit\s*(?:of)?\s*(\d+)%/i);
  const lossPctMatch = lower.match(/loss\s*(?:of)?\s*(\d+)%/i);
  
  if (costMatch && (profitPctMatch || lossPctMatch)) {
    const cost = parseFloat(costMatch[1].replace(/,/g, ''));
    const pct = profitPctMatch ? parseFloat(profitPctMatch[1]) : parseFloat(lossPctMatch![1]);
    const isProfit = !!profitPctMatch;
    
    const amount = cost * pct / 100;
    const sellingPrice = isProfit ? cost + amount : cost - amount;
    
    return {
      problem: input, category: 'Profit & Loss', result: `${isProfit ? 'Profit' : 'Loss'} = ${fmtDec(amount)}, SP = ${fmtDec(sellingPrice)}`,
      steps: [
        { description: 'Cost Price', expression: `CP = ${cost}` },
        { description: `${isProfit ? 'Profit' : 'Loss'} %`, expression: `${pct}%` },
        { description: `${isProfit ? 'Profit' : 'Loss'} amount`, expression: `${pct}% of ${cost} = ${cost} × ${pct}/100 = ${fmtDec(amount)}` },
        { description: 'Selling Price', expression: `SP = CP ${isProfit ? '+' : '-'} ${isProfit ? 'Profit' : 'Loss'} = ${cost} ${isProfit ? '+' : '-'} ${fmtDec(amount)} = ${fmtDec(sellingPrice)}` },
      ],
      success: true,
    };
  }
  
  // "selling price and cost price given, find profit/loss %"
  const spMatch = lower.match(/(?:sell(?:ing)?\s*(?:price)?|sold\s*(?:for|at)?)\s*(?:₦|N|\$)?\s*(\d+[\d,]*)/i);
  const cpMatch = lower.match(/(?:cost\s*(?:price)?|bought?\s*(?:for|at)?)\s*(?:₦|N|\$)?\s*(\d+[\d,]*)/i);
  
  if (spMatch && cpMatch) {
    const sp = parseFloat(spMatch[1].replace(/,/g, ''));
    const cp = parseFloat(cpMatch[1].replace(/,/g, ''));
    const diff = sp - cp;
    const isProfit = diff >= 0;
    const pct = (Math.abs(diff) / cp) * 100;
    
    return {
      problem: input, category: 'Profit & Loss', result: `${isProfit ? 'Profit' : 'Loss'} = ${fmtDec(pct, 2)}%`,
      steps: [
        { description: 'Cost Price and Selling Price', expression: `CP = ${cp}, SP = ${sp}` },
        { description: isProfit ? 'Profit = SP - CP' : 'Loss = CP - SP', expression: `${isProfit ? 'Profit' : 'Loss'} = ${Math.abs(diff)}` },
        { description: `${isProfit ? 'Profit' : 'Loss'} % = (${isProfit ? 'Profit' : 'Loss'}/CP) × 100`, expression: `(${Math.abs(diff)}/${cp}) × 100 = ${fmtDec(pct, 2)}%` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// CONSECUTIVE NUMBER PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveConsecutiveNumbers(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/consecutive/)) return null;
  
  // "product of two consecutive even numbers is 840"
  const productMatch = lower.match(/product\s*(?:of\s*)?(?:two|2)\s*consecutive\s*(even|odd)?\s*(?:numbers?|integers?)\s*(?:is|=)\s*(\d+)/i);
  if (productMatch) {
    const isEven = productMatch[1]?.toLowerCase() === 'even';
    const isOdd = productMatch[1]?.toLowerCase() === 'odd';
    const product = parseInt(productMatch[2]);
    const step = (isEven || isOdd) ? 2 : 1;
    
    const steps: SolutionStep[] = [
      { description: 'Let the numbers be n and n + ' + step, expression: `n(n + ${step}) = ${product}` },
      { description: 'Expand', expression: `n² + ${step}n - ${product} = 0` },
    ];
    
    // Solve quadratic: n² + step*n - product = 0
    const disc = step * step + 4 * product;
    const sqrtDisc = Math.sqrt(disc);
    const n1 = (-step + sqrtDisc) / 2;
    const n2 = (-step - sqrtDisc) / 2;
    
    steps.push({ description: 'Discriminant', expression: `Δ = ${step}² + 4(${product}) = ${disc}` });
    steps.push({ description: 'Solve for n', expression: `n = (-${step} ± √${disc}) / 2` });
    
    const n = n1 > 0 ? n1 : n2;
    const pair = [n, n + step];
    
    steps.push({ description: 'Positive solution', expression: `n = ${fmtDec(n)}, so numbers are ${fmtDec(pair[0])} and ${fmtDec(pair[1])}` });
    steps.push({ description: 'Verify', expression: `${fmtDec(pair[0])} × ${fmtDec(pair[1])} = ${fmtDec(pair[0] * pair[1])} ✓` });
    
    // Check if asking for sum of squares
    if (lower.match(/sum\s*of\s*(?:the\s*)?squares?/)) {
      const sumOfSquares = pair[0] * pair[0] + pair[1] * pair[1];
      steps.push({ description: 'Sum of squares', expression: `${fmtDec(pair[0])}² + ${fmtDec(pair[1])}² = ${fmtDec(pair[0]*pair[0])} + ${fmtDec(pair[1]*pair[1])} = ${fmtDec(sumOfSquares)}` });
      return { problem: input, category: 'Consecutive Numbers', result: fmtDec(sumOfSquares), steps, success: true };
    }
    
    return { problem: input, category: 'Consecutive Numbers', result: `${fmtDec(pair[0])} and ${fmtDec(pair[1])}`, steps, success: true };
  }
  
  // "sum of two consecutive numbers is X"
  const sumMatch = lower.match(/sum\s*(?:of\s*)?(?:two|2|three|3)\s*consecutive\s*(even|odd)?\s*(?:numbers?|integers?)\s*(?:is|=)\s*(\d+)/i);
  if (sumMatch) {
    const isEven = sumMatch[1]?.toLowerCase() === 'even';
    const isOdd = sumMatch[1]?.toLowerCase() === 'odd';
    const sum = parseInt(sumMatch[2]);
    const count = lower.includes('three') || lower.includes('3') ? 3 : 2;
    const step = (isEven || isOdd) ? 2 : 1;
    
    // n + (n+step) + ... = sum
    const totalOffset = count * (count - 1) * step / 2;
    const n = (sum - totalOffset) / count;
    
    const numbers = Array.from({ length: count }, (_, i) => n + i * step);
    
    return {
      problem: input, category: 'Consecutive Numbers', result: numbers.map(fmtDec).join(', '),
      steps: [
        { description: `Let the ${count} consecutive ${isEven ? 'even ' : isOdd ? 'odd ' : ''}numbers be`, expression: numbers.map((_, i) => `n + ${i * step}`).join(', ') },
        { description: 'Their sum', expression: `${count}n + ${totalOffset} = ${sum}` },
        { description: 'Solve for n', expression: `n = (${sum} - ${totalOffset}) / ${count} = ${fmtDec(n)}` },
        { description: 'The numbers are', expression: numbers.map(fmtDec).join(', ') },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// OBTUSE/ACUTE ANGLE PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveAngleProblems(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "if sum of 2y, 3y and 4y is an obtuse angle, find y"
  const obtuseMatch = lower.match(/sum\s*(?:of\s*)?([\d.]+)\s*y\s*[°,]?\s*([\d.]+)\s*y\s*[°,]?\s*(?:and\s*)?([\d.]+)\s*y.*?obtuse/i);
  if (obtuseMatch) {
    const coeffs = [parseFloat(obtuseMatch[1]), parseFloat(obtuseMatch[2]), parseFloat(obtuseMatch[3])];
    const totalCoeff = coeffs.reduce((a, b) => a + b, 0);
    
    // Obtuse angle: 90 < totalCoeff * y < 180
    const minY = 90 / totalCoeff;
    const maxY = 180 / totalCoeff;
    
    const steps: SolutionStep[] = [
      { description: 'Sum of the angles', expression: `${coeffs.map(c => c + 'y').join(' + ')} = ${totalCoeff}y` },
      { description: 'An obtuse angle is between 90° and 180°', expression: `90° < ${totalCoeff}y < 180°` },
      { description: 'Divide by ' + totalCoeff, expression: `${fmtDec(minY)}° < y < ${fmtDec(maxY)}°` },
    ];
    
    // Check which of the given options fits
    const options = lower.match(/\d+/g)?.map(Number).filter(n => n > minY && n < maxY && n !== coeffs[0] && n !== coeffs[1] && n !== coeffs[2]);
    if (options && options.length > 0) {
      steps.push({ description: 'From the given options', expression: `y = ${options[0]}° works because ${fmtDec(totalCoeff * options[0])}° is obtuse` });
      return { problem: input, category: 'Angle Problem', result: `y could be any value where ${fmtDec(minY)}° < y < ${fmtDec(maxY)}°`, steps, success: true };
    }
    
    return { problem: input, category: 'Angle Problem', result: `${fmtDec(minY)}° < y < ${fmtDec(maxY)}°`, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// TILES / AREA COVERAGE PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveTileCoverage(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/tiles?|cover|pav/i)) return null;
  
  // "wall 3m x 2m, tiles 20cm x 20cm"
  const wallMatch = lower.match(/([\d.]+)\s*(?:m(?:eters?)?|cm|centim)\s*(?:by|×|x|and)\s*([\d.]+)\s*(?:m(?:eters?)?|cm|centim)/i);
  const tileMatch = lower.match(/(?:tiles?|squares?)\s*(?:with\s*)?(?:sides?\s*(?:of|=)?\s*)?([\d.]+)\s*(?:cm|centim|m(?:eters?)?)/i);
  
  if (wallMatch && tileMatch) {
    let wallL = parseFloat(wallMatch[1]);
    let wallW = parseFloat(wallMatch[2]);
    let tileSize = parseFloat(tileMatch[1]);
    
    // Convert to same units (cm)
    const wallUnit = wallMatch[0].toLowerCase().includes('meter') || wallMatch[0].match(/\d\s*m\b/) ? 'm' : 'cm';
    const tileUnit = tileMatch[0].toLowerCase().includes('meter') || tileMatch[0].match(/\d\s*m\b/) ? 'm' : 'cm';
    
    if (wallUnit === 'm') { wallL *= 100; wallW *= 100; }
    if (tileUnit === 'm') { tileSize *= 100; }
    
    const wallArea = wallL * wallW;
    const tileArea = tileSize * tileSize;
    const numTiles = Math.ceil(wallArea / tileArea);
    
    return {
      problem: input, category: 'Area Coverage', result: `${numTiles} tiles`,
      steps: [
        { description: 'Wall area (in cm)', expression: `${wallL} × ${wallW} = ${fmtDec(wallArea)} cm²` },
        { description: 'Tile area', expression: `${tileSize} × ${tileSize} = ${fmtDec(tileArea)} cm²` },
        { description: 'Number of tiles', expression: `${fmtDec(wallArea)} ÷ ${fmtDec(tileArea)} = ${numTiles}` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// RATIO SHARING (ENHANCED)
// ═══════════════════════════════════════════════════════════════

export function solveRatioSharing(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "shared in ratio 2:3:5, Seyi received 5400, find total"
  const ratioMatch = lower.match(/ratio\s*([\d]+)\s*:\s*([\d]+)(?:\s*:\s*([\d]+))?/i);
  if (!ratioMatch) return null;
  
  const parts = [parseInt(ratioMatch[1]), parseInt(ratioMatch[2])];
  if (ratioMatch[3]) parts.push(parseInt(ratioMatch[3]));
  const totalParts = parts.reduce((a, b) => a + b, 0);
  
  // Find who received how much
  const receivedMatch = lower.match(/(?:received|got|given|share\s*(?:of|is|was)?)\s*(?:₦|N|\$)?\s*([\d,]+)/i);
  const totalMatch = lower.match(/(?:total|whole|amount)\s*(?:is|was|=)?\s*(?:₦|N|\$)?\s*([\d,]+)/i);
  
  if (receivedMatch) {
    const received = parseFloat(receivedMatch[1].replace(/,/g, ''));
    
    // Try to figure out which person (by position in ratio)
    // Look for ordinal or name indicators
    let personIdx = -1;
    const names = lower.match(/(\w+)\s*,\s*(\w+)(?:\s*,?\s*(?:and\s*)?(\w+))?/);
    const personReceived = lower.match(/(\w+)\s*received/i);
    
    if (names && personReceived) {
      const receiverName = personReceived[1].toLowerCase();
      if (names[2] && names[2].toLowerCase() === receiverName) personIdx = 1;
      else if (names[1] && names[1].toLowerCase() === receiverName) personIdx = 0;
      else if (names[3] && names[3].toLowerCase() === receiverName) personIdx = 2;
    }
    
    // Default to second person if can't determine
    if (personIdx === -1) {
      if (lower.includes('second') || lower.includes('2nd')) personIdx = 1;
      else if (lower.includes('third') || lower.includes('3rd')) personIdx = 2;
      else if (lower.includes('first') || lower.includes('1st')) personIdx = 0;
      else personIdx = 1; // default
    }
    
    const personPart = parts[personIdx];
    const valuePerPart = received / personPart;
    const total = valuePerPart * totalParts;
    
    const steps: SolutionStep[] = [
      { description: 'Given ratio', expression: parts.join(' : ') },
      { description: 'Total ratio parts', expression: `${parts.join(' + ')} = ${totalParts}` },
      { description: `Person ${personIdx + 1} (ratio part ${personPart}) received`, expression: `${fmtDec(received)}` },
      { description: 'Value of one part', expression: `${fmtDec(received)} ÷ ${personPart} = ${fmtDec(valuePerPart)}` },
      { description: 'Total amount', expression: `${fmtDec(valuePerPart)} × ${totalParts} = ${fmtDec(total)}` },
    ];
    
    // Also show each person's share
    parts.forEach((p, i) => {
      steps.push({ description: `Person ${i + 1}'s share (${p} parts)`, expression: `${p} × ${fmtDec(valuePerPart)} = ${fmtDec(p * valuePerPart)}` });
    });
    
    return { problem: input, category: 'Ratio & Proportion', result: `Total = ${fmtDec(total)}`, steps, success: true };
  }
  
  if (totalMatch) {
    const total = parseFloat(totalMatch[1].replace(/,/g, ''));
    const valuePerPart = total / totalParts;
    
    const steps: SolutionStep[] = [
      { description: 'Given ratio', expression: parts.join(' : ') },
      { description: 'Total', expression: fmtDec(total) },
      { description: 'Value per part', expression: `${fmtDec(total)} ÷ ${totalParts} = ${fmtDec(valuePerPart)}` },
    ];
    
    parts.forEach((p, i) => {
      steps.push({ description: `Share ${i + 1}`, expression: `${p} × ${fmtDec(valuePerPart)} = ${fmtDec(p * valuePerPart)}` });
    });
    
    return { problem: input, category: 'Ratio & Proportion', result: parts.map(p => fmtDec(p * valuePerPart)).join(', '), steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// PROBABILITY (ENHANCED - coin toss, at least, neither)
// ═══════════════════════════════════════════════════════════════

export function solveEnhancedProbability(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "two coins tossed, probability of at least one tail"
  if (lower.match(/(?:two|2|three|3)\s*(?:fair\s*)?coins?\s*(?:are\s*)?(?:tossed|flipped|thrown)/)) {
    const numCoins = lower.match(/three|3/) ? 3 : 2;
    const totalOutcomes = Math.pow(2, numCoins);
    
    const steps: SolutionStep[] = [
      { description: `Total outcomes when ${numCoins} coins are tossed`, expression: `2^${numCoins} = ${totalOutcomes}` },
    ];
    
    if (numCoins === 2) {
      steps.push({ description: 'All outcomes', expression: 'HH, HT, TH, TT' });
    }
    
    if (lower.match(/at\s*least\s*(?:one|a|1)\s*tail/)) {
      const noTails = 1; // all heads
      const atLeastOne = totalOutcomes - noTails;
      const prob = atLeastOne / totalOutcomes;
      const [n, d] = findBestFraction(prob);
      
      steps.push({ description: 'P(at least 1 tail) = 1 - P(no tails)', expression: '' });
      steps.push({ description: 'P(no tails) = P(all heads)', expression: `1/${totalOutcomes}` });
      steps.push({ description: 'P(at least 1 tail)', expression: `1 - 1/${totalOutcomes} = ${atLeastOne}/${totalOutcomes} = ${fractionStr(n, d)}` });
      
      return { problem: input, category: 'Probability', result: fractionStr(n, d), steps, success: true };
    }
    
    if (lower.match(/at\s*least\s*(?:one|a|1)\s*head/)) {
      const noHeads = 1;
      const atLeastOne = totalOutcomes - noHeads;
      const prob = atLeastOne / totalOutcomes;
      const [n, d] = findBestFraction(prob);
      
      steps.push({ description: 'P(at least 1 head) = 1 - P(no heads)', expression: `1 - 1/${totalOutcomes} = ${fractionStr(n, d)}` });
      
      return { problem: input, category: 'Probability', result: fractionStr(n, d), steps, success: true };
    }
    
    if (lower.match(/both\s*tails?|two\s*tails?|all\s*tails?/)) {
      const [n, d] = findBestFraction(1 / totalOutcomes);
      return { problem: input, category: 'Probability', result: fractionStr(n, d), steps: [...steps, { description: 'P(all tails)', expression: fractionStr(n, d) }], success: true };
    }
    
    if (lower.match(/both\s*heads?|two\s*heads?|all\s*heads?/)) {
      const [n, d] = findBestFraction(1 / totalOutcomes);
      return { problem: input, category: 'Probability', result: fractionStr(n, d), steps: [...steps, { description: 'P(all heads)', expression: fractionStr(n, d) }], success: true };
    }
  }
  
  // "probability that neither A nor B"
  // "P(A) = 3/5, P(B) = 2/3, probability neither selected"
  const neitherMatch = lower.match(/(?:p(?:robability)?)\s*(?:that\s*)?(?:\w+)\s*(?:=|is)\s*([\d\/]+).*?(?:p(?:robability)?)\s*(?:that\s*)?(?:\w+)\s*(?:=|is)\s*([\d\/]+).*?(?:neither|none|not\s*(?:be\s*)?selected)/i);
  if (neitherMatch) {
    const pA = parseFractionValue(neitherMatch[1]) || 0;
    const pB = parseFractionValue(neitherMatch[2]) || 0;
    const pNotA = 1 - pA;
    const pNotB = 1 - pB;
    const pNeither = pNotA * pNotB;
    
    const [n, d] = findBestFraction(pNeither);
    
    return {
      problem: input, category: 'Probability', result: fractionStr(n, d),
      steps: [
        { description: 'Given probabilities', expression: `P(A) = ${fmtDec(pA)}, P(B) = ${fmtDec(pB)}` },
        { description: 'P(not A)', expression: `1 - ${fmtDec(pA)} = ${fmtDec(pNotA)}` },
        { description: 'P(not B)', expression: `1 - ${fmtDec(pB)} = ${fmtDec(pNotB)}` },
        { description: 'P(neither) = P(not A) × P(not B) (independent)', expression: `${fmtDec(pNotA)} × ${fmtDec(pNotB)} = ${fmtDec(pNeither)} = ${fractionStr(n, d)}` },
      ],
      success: true,
    };
  }
  
  // "50 students, 25 speak Hausa, 30 speak Igbo, probability of speaking both"
  const setsProbMatch = lower.match(/(\d+)\s*(?:students?|people|persons?).*?(\d+)\s*(?:speak|study|play|like).*?(\d+)\s*(?:speak|study|play|like).*?(?:probability|what\s*is\s*the\s*prob)/i);
  if (setsProbMatch) {
    const total = parseInt(setsProbMatch[1]);
    const nA = parseInt(setsProbMatch[2]);
    const nB = parseInt(setsProbMatch[3]);
    const nBoth = nA + nB - total;
    const prob = nBoth / total;
    const [n, d] = findBestFraction(prob);
    
    return {
      problem: input, category: 'Probability (Sets)', result: fractionStr(n, d),
      steps: [
        { description: 'Total', expression: `n = ${total}` },
        { description: 'Group A', expression: `n(A) = ${nA}` },
        { description: 'Group B', expression: `n(B) = ${nB}` },
        { description: 'n(A∩B) = n(A) + n(B) - n(A∪B)', expression: `${nA} + ${nB} - ${total} = ${nBoth}` },
        { description: 'P(both)', expression: `${nBoth}/${total} = ${fractionStr(n, d)}` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// QUADRANT PERIMETER
// ═══════════════════════════════════════════════════════════════

export function solveQuadrantPerimeter(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  const quadrantMatch = lower.match(/(?:perimeter|circumference)\s*(?:of\s*)?(?:a\s*)?quadrant.*?(?:radius|r)\s*(?:=|of|is)?\s*([\d.]+)/i) ||
                        lower.match(/quadrant.*?(?:radius|r)\s*(?:=|of|is)?\s*([\d.]+).*?(?:perimeter)/i);
  
  const diameterQuadrant = lower.match(/(?:perimeter|circumference)\s*(?:of\s*)?(?:a\s*)?quadrant.*?(?:diameter|d)\s*(?:=|of|is)?\s*([\d.]+)/i) ||
                           lower.match(/quadrant.*?(?:diameter|d)\s*(?:=|of|is)?\s*([\d.]+).*?(?:perimeter)/i);
  
  if (quadrantMatch || diameterQuadrant) {
    let r: number;
    const usePi = lower.includes('22/7') || lower.includes('²²⁄₇');
    const pi = usePi ? 22/7 : Math.PI;
    
    if (diameterQuadrant) {
      r = parseFloat(diameterQuadrant[1]) / 2;
    } else {
      r = parseFloat(quadrantMatch![1]);
    }
    
    // Perimeter of quadrant = (1/4)(2πr) + 2r = πr/2 + 2r
    const arcLength = (pi * r) / 2;
    const perimeter = arcLength + 2 * r;
    
    const steps: SolutionStep[] = [
      { description: 'Given', expression: `Radius r = ${r}${usePi ? ', π = 22/7' : ''}` },
      { description: 'Perimeter of quadrant = Arc length + 2 radii', expression: `P = (2πr/4) + 2r = πr/2 + 2r` },
      { description: 'Calculate arc length (quarter circle)', expression: `Arc = πr/2 = ${usePi ? '22/7' : 'π'} × ${r} / 2 = ${fmtDec(arcLength)}` },
      { description: 'Add two radii', expression: `2r = 2 × ${r} = ${2 * r}` },
      { description: 'Total perimeter', expression: `P = ${fmtDec(arcLength)} + ${2 * r} = ${fmtDec(perimeter)} cm` },
    ];
    
    return { problem: input, category: 'Geometry (Quadrant)', result: `${fmtDec(perimeter)} cm`, steps, success: true };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// FRAME / BORDER AREA PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveFrameArea(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/frame|border|margin|surround/)) return null;
  
  const match = lower.match(/([\d.]+)\s*(?:cm|m)?\s*(?:by|×|x)\s*([\d.]+)\s*(?:cm|m)?.*?(?:frame|border|margin)\s*([\d.]+)\s*(?:cm|m)?/i);
  if (match) {
    const innerL = parseFloat(match[1]);
    const innerW = parseFloat(match[2]);
    const frameWidth = parseFloat(match[3]);
    
    const outerL = innerL + 2 * frameWidth;
    const outerW = innerW + 2 * frameWidth;
    const outerArea = outerL * outerW;
    const innerArea = innerL * innerW;
    const frameArea = outerArea - innerArea;
    
    return {
      problem: input, category: 'Area (Frame)', result: `${fmtDec(frameArea)} cm²`,
      steps: [
        { description: 'Inner dimensions', expression: `${innerL} × ${innerW} = ${innerArea} cm²` },
        { description: 'Outer dimensions (adding frame on all sides)', expression: `(${innerL} + 2×${frameWidth}) × (${innerW} + 2×${frameWidth}) = ${outerL} × ${outerW} = ${outerArea} cm²` },
        { description: 'Frame area = Outer - Inner', expression: `${outerArea} - ${innerArea} = ${fmtDec(frameArea)} cm²` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// CIRCUMFERENCE RATIO / AREA RATIO PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveCircumferenceAreaRatio(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "circumference reduced in ratio 3:5, in what ratio is area reduced?"
  const circRatioMatch = lower.match(/circumference\s*(?:is\s*)?(?:reduced|increased|changed).*?ratio\s*(\d+)\s*:\s*(\d+).*?(?:area|surface)/i);
  if (circRatioMatch) {
    const c1 = parseInt(circRatioMatch[1]);
    const c2 = parseInt(circRatioMatch[2]);
    
    // C = 2πr, so r ratio = C ratio
    // A = πr², so A ratio = (C ratio)²
    const a1 = c1 * c1;
    const a2 = c2 * c2;
    
    return {
      problem: input, category: 'Ratio (Circle)', result: `${a1}:${a2}`,
      steps: [
        { description: 'Circumference ratio', expression: `C₁:C₂ = ${c1}:${c2}` },
        { description: 'Since C = 2πr, radius ratio is same', expression: `r₁:r₂ = ${c1}:${c2}` },
        { description: 'Area = πr², so area ratio = (radius ratio)²', expression: `A₁:A₂ = ${c1}²:${c2}² = ${a1}:${a2}` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// SEQUENCE NTH TERM (3 × 2^(n-2) style)
// ═══════════════════════════════════════════════════════════════

export function solveNthTermSequence(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "nth term is 3 × 2^(n-2), find first, second and sixth terms"
  const nthTermMatch = lower.match(/(?:nth\s*term|n(?:th)?\s*term)\s*(?:is|=|represented\s*by)\s*([\d.]+)\s*[×*]\s*([\d.]+)\s*\^\s*\(\s*n\s*([+-])\s*(\d+)\s*\)/i);
  if (nthTermMatch) {
    const a = parseFloat(nthTermMatch[1]);
    const base = parseFloat(nthTermMatch[2]);
    const sign = nthTermMatch[3];
    const offset = parseInt(nthTermMatch[4]);
    
    // Find which terms are requested
    const termsMatch = lower.match(/(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th))/gi);
    const wordToNum: Record<string, number> = {
      'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5,
      'sixth': 6, 'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10,
    };
    
    const termNumbers: number[] = [];
    if (termsMatch) {
      for (const t of termsMatch) {
        const ordinal = t.toLowerCase();
        if (wordToNum[ordinal]) {
          termNumbers.push(wordToNum[ordinal]);
        } else {
          const num = parseInt(ordinal);
          if (!isNaN(num)) termNumbers.push(num);
        }
      }
    }
    
    if (termNumbers.length === 0) termNumbers.push(1, 2, 3);
    
    const steps: SolutionStep[] = [
      { description: 'General term formula', expression: `T(n) = ${a} × ${base}^(n ${sign} ${offset})` },
    ];
    
    const results: string[] = [];
    for (const n of termNumbers) {
      const exp = sign === '-' ? n - offset : n + offset;
      const value = a * Math.pow(base, exp);
      const [fracNum, fracDen] = findBestFraction(value);
      const fracStr = fracDen === 1 ? fracNum.toString() : `${fracNum}/${fracDen}`;
      
      steps.push({
        description: `Term ${n} (n = ${n})`,
        expression: `T(${n}) = ${a} × ${base}^(${n} ${sign} ${offset}) = ${a} × ${base}^${exp} = ${a} × ${fmtDec(Math.pow(base, exp))} = ${fmtDec(value)} = ${fracStr}`
      });
      results.push(fracStr);
    }
    
    return {
      problem: input,
      category: 'Sequences',
      result: results.join(', '),
      steps,
      success: true
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// RHOMBUS/KITE PROBLEMS
// ═══════════════════════════════════════════════════════════════

export function solveRhombusKite(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "diagonal is 12cm, area is 48cm², find other diagonal"
  if ((lower.includes('rhombus') || lower.includes('kite')) && lower.includes('diagonal') && lower.includes('area')) {
    const diagMatch = lower.match(/diagonal\s*(?:is|=|of)?\s*([\d.]+)/i);
    const areaMatch = lower.match(/area\s*(?:is|=|of)?\s*([\d.]+)/i);
    
    if (diagMatch && areaMatch) {
      const d1 = parseFloat(diagMatch[1]);
      const area = parseFloat(areaMatch[1]);
      const d2 = (2 * area) / d1;
      
      return {
        problem: input, category: 'Geometry (Rhombus/Kite)', result: `Other diagonal = ${fmtDec(d2)} cm`,
        steps: [
          { description: 'Area formula for rhombus/kite', expression: `Area = (d₁ × d₂) / 2` },
          { description: 'Given', expression: `d₁ = ${d1} cm, Area = ${area} cm²` },
          { description: 'Rearrange for d₂', expression: `d₂ = 2 × Area / d₁ = 2 × ${area} / ${d1} = ${fmtDec(d2)} cm` },
        ],
        success: true,
      };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// RECTANGLE/SQUARE SAME PERIMETER
// ═══════════════════════════════════════════════════════════════

export function solveRectSquarePerimeter(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "rectangle and square have same perimeter, rectangle length 12cm, area 108cm², find square side"
  if (lower.includes('rectangle') && lower.includes('square') && lower.match(/same\s*perimeter/)) {
    const lengthMatch = lower.match(/length\s*(?:=|of|is)?\s*([\d.]+)/i);
    const areaMatch = lower.match(/area\s*(?:=|of|is)?\s*([\d.]+)/i);
    
    if (lengthMatch && areaMatch) {
      const l = parseFloat(lengthMatch[1]);
      const area = parseFloat(areaMatch[1]);
      const w = area / l;
      const perimeter = 2 * (l + w);
      const squareSide = perimeter / 4;
      
      return {
        problem: input, category: 'Geometry', result: `Square side = ${fmtDec(squareSide)} cm`,
        steps: [
          { description: 'Rectangle length', expression: `l = ${l} cm` },
          { description: 'Rectangle area = l × w', expression: `${area} = ${l} × w → w = ${fmtDec(w)} cm` },
          { description: 'Rectangle perimeter', expression: `P = 2(l + w) = 2(${l} + ${fmtDec(w)}) = ${fmtDec(perimeter)} cm` },
          { description: 'Square has same perimeter, so', expression: `4s = ${fmtDec(perimeter)} → s = ${fmtDec(squareSide)} cm` },
        ],
        success: true,
      };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// MEAN WITH UNKNOWN (e.g., mean of 5,11,9,3,2y-1 is 7)
// ═══════════════════════════════════════════════════════════════

export function solveMeanWithUnknown(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/mean|average/)) return null;
  
  // "mean of 5, 11, 9, 3, 2y-1 is 7" or similar
  const meanValMatch = lower.match(/(?:mean|average)\s*(?:of\s*)?.*?(?:is|=)\s*([\d.]+)/);
  if (!meanValMatch) return null;
  
  const targetMean = parseFloat(meanValMatch[1]);
  
  // Extract all terms (numbers and expressions with y)
  const termsStr = lower.match(/(?:mean|average)\s*(?:of\s*)?(.+?)(?:is|=)/);
  if (!termsStr) return null;
  
  const termsPart = termsStr[1].trim();
  
  // Check for variable terms (containing y, x, etc.)
  if (!termsPart.match(/[a-z]/)) return null;
  
  // Parse individual terms
  const rawTerms = termsPart.split(/[,]+/).map(s => s.trim()).filter(s => s);
  const numericTerms: number[] = [];
  let varExpression = '';
  let varCoeff = 0;
  let varConst = 0;
  
  for (const term of rawTerms) {
    const num = parseFloat(term);
    if (!isNaN(num) && !term.match(/[a-z]/)) {
      numericTerms.push(num);
    } else {
      // Parse expression like "2y-1" or "3x+2"
      varExpression = term;
      const coeffMatch = term.match(/(\d*)\s*([a-z])\s*([+-]\s*\d+)?/);
      if (coeffMatch) {
        varCoeff = coeffMatch[1] ? parseInt(coeffMatch[1]) : 1;
        varConst = coeffMatch[3] ? parseInt(coeffMatch[3].replace(/\s/g, '')) : 0;
      }
    }
  }
  
  if (varCoeff === 0) return null;
  
  const n = numericTerms.length + 1; // total count including the variable term
  const numericSum = numericTerms.reduce((a, b) => a + b, 0);
  const totalNeeded = targetMean * n;
  // numericSum + varCoeff * y + varConst = totalNeeded
  const varValue = (totalNeeded - numericSum - varConst) / varCoeff;
  
  const steps: SolutionStep[] = [
    { description: 'Given', expression: `Mean of ${rawTerms.join(', ')} = ${targetMean}` },
    { description: 'Number of terms', expression: `n = ${n}` },
    { description: 'Sum must equal mean × n', expression: `Sum = ${targetMean} × ${n} = ${totalNeeded}` },
    { description: 'Sum of known values', expression: `${numericTerms.join(' + ')} = ${numericSum}` },
    { description: 'Set up equation', expression: `${numericSum} + ${varExpression} = ${totalNeeded}` },
    { description: 'Solve for the variable', expression: `${varExpression} = ${totalNeeded} - ${numericSum} = ${totalNeeded - numericSum}` },
    { description: 'Find variable value', expression: `${varCoeff}y + (${varConst}) = ${totalNeeded - numericSum}\n${varCoeff}y = ${totalNeeded - numericSum - varConst}\ny = ${fmtDec(varValue)}` },
  ];
  
  return { problem: input, category: 'Statistics (Mean)', result: `y = ${fmtDec(varValue)}`, steps, success: true };
}


// ═══════════════════════════════════════════════════════════════
// CUBE / CUBOID FROM VOLUME
// ═══════════════════════════════════════════════════════════════

export function solveCubeFromVolume(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "3D figure with equal side lengths occupies 512cm³" → cube root
  if ((lower.includes('equal') && lower.includes('side') && lower.includes('volume')) ||
      (lower.includes('cube') && lower.match(/volume|occupies|space/)) ||
      (lower.includes('equal') && lower.match(/\d+\s*cm³|\d+\s*m³|\d+\s*cm\^3/))) {
    
    const volMatch = lower.match(/([\d.]+)\s*(?:cm³|cm\^3|m³|m\^3|cubic)/);
    if (volMatch) {
      const vol = parseFloat(volMatch[1]);
      const side = Math.cbrt(vol);
      
      return {
        problem: input, category: 'Geometry (Cube)', result: `Edge = ${fmtDec(side)} cm`,
        steps: [
          { description: 'For a cube with equal sides: V = s³', expression: `${vol} = s³` },
          { description: 'Find side length', expression: `s = ∛${vol} = ${fmtDec(side)} cm` },
          { description: 'Verify', expression: `${fmtDec(side)}³ = ${fmtDec(Math.pow(side, 3))} ✓` },
        ],
        success: true,
      };
    }
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// AP SUM (enhanced: −5, −3, −1, ... find sum of first 7 terms)
// ═══════════════════════════════════════════════════════════════

export function solveAPFromSequence(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  if (!lower.match(/(?:sum|find|arithmetic|ap)\s/)) return null;
  
  // "sum of first 7 terms of AP: -5, -3, -1, ..."
  const apMatch = lower.match(/(?:sum\s*(?:of\s*)?(?:the\s*)?(?:first\s*)?)(\d+)\s*terms?\s*(?:of\s*)?(?:the\s*)?(?:arithmetic\s*(?:progression|sequence|series)|ap)\s*:?\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)/i);
  
  if (!apMatch) {
    // Alternative: "AP: -5, -3, -1, ... find sum of first 7 terms"
    const altMatch = lower.match(/(?:arithmetic|ap)\s*(?:progression|sequence|series)?\s*:?\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+).*?sum\s*(?:of\s*)?(?:the\s*)?(?:first\s*)?(\d+)/i);
    if (!altMatch) return null;
    
    const a = parseFloat(altMatch[1]);
    const d = parseFloat(altMatch[2]) - a;
    const n = parseInt(altMatch[4]);
    const sum = (n / 2) * (2 * a + (n - 1) * d);
    const lastTerm = a + (n - 1) * d;
    
    return {
      problem: input, category: 'AP (Sum)', result: `S${n} = ${fmtDec(sum)}`,
      steps: [
        { description: 'Identify AP', expression: `First term a = ${a}, Common difference d = ${fmtDec(d)}` },
        { description: 'Formula: Sn = n/2 × [2a + (n-1)d]', expression: '' },
        { description: 'Substitute', expression: `S${n} = ${n}/2 × [2(${a}) + (${n}-1)(${fmtDec(d)})]` },
        { description: 'Calculate inside bracket', expression: `2(${a}) + ${n - 1}(${fmtDec(d)}) = ${fmtDec(2 * a)} + ${fmtDec((n - 1) * d)} = ${fmtDec(2 * a + (n - 1) * d)}` },
        { description: 'Last term', expression: `T${n} = ${a} + ${n - 1}(${fmtDec(d)}) = ${fmtDec(lastTerm)}` },
        { description: 'Sum', expression: `S${n} = ${n}/2 × ${fmtDec(2 * a + (n - 1) * d)} = ${fmtDec(n / 2)} × ${fmtDec(2 * a + (n - 1) * d)} = ${fmtDec(sum)}` },
      ],
      success: true,
    };
  }
  
  const n = parseInt(apMatch[1]);
  const a = parseFloat(apMatch[2]);
  const d = parseFloat(apMatch[3]) - a;
  const sum = (n / 2) * (2 * a + (n - 1) * d);
  const lastTerm = a + (n - 1) * d;
  
  return {
    problem: input, category: 'AP (Sum)', result: `S${n} = ${fmtDec(sum)}`,
    steps: [
      { description: 'Identify AP', expression: `a = ${a}, d = ${fmtDec(d)}, n = ${n}` },
      { description: 'Sn = n/2 × [2a + (n-1)d]', expression: `S${n} = ${n}/2 × [2(${a}) + (${n}-1)(${fmtDec(d)})]` },
      { description: 'Calculate', expression: `= ${fmtDec(n / 2)} × [${fmtDec(2 * a)} + ${fmtDec((n - 1) * d)}]` },
      { description: 'Last term', expression: `T${n} = ${a} + ${n - 1}(${fmtDec(d)}) = ${fmtDec(lastTerm)}` },
      { description: 'Sum', expression: `S${n} = ${fmtDec(n / 2)} × ${fmtDec(2 * a + (n - 1) * d)} = ${fmtDec(sum)}` },
    ],
    success: true,
  };
}


// ═══════════════════════════════════════════════════════════════
// EXPAND ALGEBRAIC EXPRESSION
// ═══════════════════════════════════════════════════════════════

export function solveExpandExpression(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "area of new garden (6x+4)(2x-8)" or just expand (a+b)(c+d)
  // "(3x+2)(x-4)" pattern
  const expandMatch = lower.match(/\((\s*[-\d.]*\s*[a-z]?\s*[+-]\s*[\d.]+)\)\s*[×*]?\s*\((\s*[-\d.]*\s*[a-z]?\s*[+-]\s*[\d.]+)\)/);
  if (!expandMatch) return null;
  
  // Parse each binomial
  const parseBinomial = (s: string): [number, number] => {
    // ax ± b
    const m = s.trim().match(/([-\d.]*)\s*[a-z]\s*([+-]\s*[\d.]+)/);
    if (m) {
      const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
      const b = parseFloat(m[2].replace(/\s/g, ''));
      return [a, b];
    }
    return [0, 0];
  };
  
  const [a, b] = parseBinomial(expandMatch[1]);
  const [c, d] = parseBinomial(expandMatch[2]);
  
  if (a === 0 && b === 0) return null;
  
  // FOIL: (ax+b)(cx+d) = acx² + (ad+bc)x + bd
  const ac = a * c;
  const ad = a * d;
  const bc = b * c;
  const bd = b * d;
  const middle = ad + bc;
  
  const steps: SolutionStep[] = [
    { description: 'Apply FOIL method', expression: `(${a}x ${b >= 0 ? '+' : ''}${b})(${c}x ${d >= 0 ? '+' : ''}${d})` },
    { description: 'First: multiply first terms', expression: `${a}x × ${c}x = ${ac}x²` },
    { description: 'Outer: multiply outer terms', expression: `${a}x × ${d} = ${ad}x` },
    { description: 'Inner: multiply inner terms', expression: `${b} × ${c}x = ${bc}x` },
    { description: 'Last: multiply last terms', expression: `${b} × ${d} = ${bd}` },
    { description: 'Combine like terms', expression: `${ac}x² + ${ad}x + ${bc}x + ${bd} = ${ac}x² ${middle >= 0 ? '+' : ''}${middle}x ${bd >= 0 ? '+' : ''}${bd}` },
  ];
  
  const result = `${ac}x² ${middle >= 0 ? '+' : ''}${middle}x ${bd >= 0 ? '+' : ''}${bd}`;
  
  return { problem: input, category: 'Algebra (Expansion)', result, steps, success: true };
}


// ═══════════════════════════════════════════════════════════════
// BACK BEARING (enhanced)
// ═══════════════════════════════════════════════════════════════

export function solveBackBearing(input: string): Solution | null {
  const lower = input.toLowerCase().trim();
  
  // "bearing of school from fire station" when "fire station is 295° from school"
  const bearingFromMatch = lower.match(/(?:bearing|located)\s*(?:of|at)?\s*(\d+)\s*°?\s*(?:from|of)/i);
  const findBearingMatch = lower.match(/(?:find|what|calculate)\s*(?:the\s*)?(?:bearing|back\s*bearing)/i);
  
  if ((bearingFromMatch || lower.match(/\d+°/)) && findBearingMatch) {
    const bearing = parseInt(lower.match(/(\d+)\s*°/)?.[1] || bearingFromMatch?.[1] || '0');
    const backBearing = bearing >= 180 ? bearing - 180 : bearing + 180;
    
    return {
      problem: input, category: 'Bearing', result: `${backBearing}°`,
      steps: [
        { description: 'Given bearing', expression: `${bearing}°` },
        { description: bearing >= 180 ? 'Bearing ≥ 180°, subtract 180°' : 'Bearing < 180°, add 180°', 
          expression: `${bearing}° ${bearing >= 180 ? '-' : '+'} 180° = ${backBearing}°` },
        { description: 'Back bearing (3-figure)', expression: `${String(backBearing).padStart(3, '0')}°` },
      ],
      success: true,
    };
  }
  
  return null;
}


// ═══════════════════════════════════════════════════════════════
// COMBINED EXPORT — Competition examples
// ═══════════════════════════════════════════════════════════════

export const competitionExampleProblems = [
  {
    category: 'Fraction Expressions',
    icon: '🔢',
    problems: [
      'if p = 1/3 and q = 2/3, find the value of (q²-p²)/(q²+p²)',
      'if a = 2/5 and b = 3/4, evaluate (a+b)/(a-b)',
    ]
  },
  {
    category: 'Number Base',
    icon: '🔟',
    problems: [
      'rearrange in ascending order: 47 base eight, 64 base six, 72 base five',
      'convert 47 base 8 to base 10',
    ]
  },
  {
    category: 'Variation',
    icon: '📉',
    problems: [
      'P varies inversely as the square root of Q. When P is 1/16, Q is 16, find P when Q is 9',
      'F varies inversely as the square root of d. If F = 20 when d = 4, find F when d = 64',
    ]
  },
  {
    category: 'Age Problems',
    icon: '👴',
    problems: [
      'Five years ago, a father was three times as old as his daughter. Last year, their combined age was 108, how old will the father be next year?',
    ]
  },
  {
    category: 'Speed/Distance/Time',
    icon: '✈️',
    problems: [
      'airplane covers 960 meters in 16 seconds. how many km will it cover in 45 minutes?',
    ]
  },
  {
    category: 'Work Rate',
    icon: '👷',
    problems: [
      '6 workers can complete a project in 20 days, how many days will 15 workers take?',
    ]
  },
  {
    category: 'Profit & Loss',
    icon: '💸',
    problems: [
      'cost price is 48000, sold at profit of 15%, find selling price',
    ]
  },
  {
    category: 'Competition Math',
    icon: '🏆',
    problems: [
      'product of two consecutive even numbers is 840, find sum of squares',
      'simplify (6a + 3b - 4) - (2a - 7b + 6)',
      'what value of K will make x² - 12x + K a perfect square',
      'perimeter of a quadrant of a circle with radius 14, take pi as 22/7',
      'picture 8cm by 6cm enclosed by frame 1.5cm wide, calculate area of frame',
      'circumference reduced in ratio 3:5, in what ratio is area reduced',
    ]
  },
];
