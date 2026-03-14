import * as math from 'mathjs';

/**
 * Graph Plotting Utilities
 * Generate and visualize mathematical functions
 */

export interface PlotPoint {
  x: number;
  y: number;
}

export interface PlotData {
  label: string;
  points: PlotPoint[];
  color: string;
}

/**
 * Generate plot points for a mathematical expression
 */
export function generatePlotData(
  expression: string,
  xMin: number = -10,
  xMax: number = 10,
  steps: number = 200,
  variable: string = 'x'
): PlotPoint[] {
  const points: PlotPoint[] = [];
  const step = (xMax - xMin) / steps;

  for (let x = xMin; x <= xMax; x += step) {
    try {
      const y = math.evaluate(expression, { [variable]: x }) as number;
      if (typeof y === 'number' && isFinite(y)) {
        points.push({ x, y });
      }
    } catch {
      // Skip invalid points (e.g., division by zero)
    }
  }

  return points;
}

/**
 * Find extrema (min/max) of a function
 */
export function findExtrema(
  points: PlotPoint[]
): { min: PlotPoint; max: PlotPoint } | null {
  if (points.length === 0) return null;

  let min = points[0];
  let max = points[0];

  for (const point of points) {
    if (point.y < min.y) min = point;
    if (point.y > max.y) max = point;
  }

  return { min, max };
}

/**
 * Find zeros (x-intercepts) of a function
 */
export function findZeros(points: PlotPoint[], tolerance: number = 0.1): number[] {
  const zeros: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    // Sign change indicates zero crossing
    if ((p1.y > 0 && p2.y < 0) || (p1.y < 0 && p2.y > 0)) {
      const zeroX = p1.x + (p2.x - p1.x) * (p1.y / (p1.y - p2.y));
      
      // Avoid duplicates
      if (!zeros.some((z) => Math.abs(z - zeroX) < tolerance)) {
        zeros.push(zeroX);
      }
    }
  }

  return zeros;
}

/**
 * Numeric integration (area under curve)
 */
export function numericIntegration(
  expression: string,
  a: number,
  b: number,
  steps: number = 100
): number {
  const dx = (b - a) / steps;
  let sum = 0;

  for (let i = 0; i < steps; i++) {
    const x = a + (i + 0.5) * dx;
    try {
      const y = math.evaluate(expression, { x }) as number;
      if (typeof y === 'number' && isFinite(y)) {
        sum += y;
      }
    } catch {
      // Skip invalid points
    }
  }

  return sum * dx;
}

/**
 * Generate SVG path for plotting
 */
export function generateSVGPath(points: PlotPoint[], width: number, height: number): string {
  if (points.length === 0) return '';

  // Find bounds
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  // Add padding
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const xPadding = xRange * 0.1;
  const yPadding = yRange * 0.1;

  minX -= xPadding;
  maxX += xPadding;
  minY -= yPadding;
  maxY += yPadding;

  // Scale points to SVG coordinates
  const scaleX = width / (maxX - minX);
  const scaleY = height / (maxY - minY);

  let path = '';

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const svgX = (p.x - minX) * scaleX;
    const svgY = height - (p.y - minY) * scaleY; // Flip Y axis

    if (i === 0) {
      path += `M ${svgX} ${svgY}`;
    } else {
      path += ` L ${svgX} ${svgY}`;
    }
  }

  return path;
}

/**
 * Plot derivative of a function
 */
export function plotDerivative(expression: string, xMin: number = -10, xMax: number = 10) {
  try {
    const derivative = math.derivative(math.parse(expression), 'x');
    return generatePlotData(derivative.toString(), xMin, xMax);
  } catch {
    return [];
  }
}

/**
 * Compare multiple functions on same plot
 */
export function generateMultiPlotData(
  expressions: Array<{ expr: string; label: string; color: string }>,
  xMin: number = -10,
  xMax: number = 10
): PlotData[] {
  return expressions.map((e) => ({
    label: e.label,
    points: generatePlotData(e.expr, xMin, xMax),
    color: e.color,
  }));
}
