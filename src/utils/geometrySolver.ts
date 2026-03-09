import type { Solution } from './mathSolver';

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(6)).toString();
}

export interface FormulaInput {
  key: string;
  label: string;
  placeholder: string;
}

export interface GeometryFormula {
  id: string;
  name: string;
  description: string;
  inputs: FormulaInput[];
}

export interface GeometryShape {
  id: string;
  name: string;
  icon: string;
  formulas: GeometryFormula[];
}

export const geometryShapes: GeometryShape[] = [
  {
    id: 'circle',
    name: 'Circle',
    icon: '⭕',
    formulas: [
      {
        id: 'area_from_radius',
        name: 'Area from Radius',
        description: 'A = πr²',
        inputs: [{ key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' }],
      },
      {
        id: 'circumference',
        name: 'Circumference',
        description: 'C = 2πr',
        inputs: [{ key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' }],
      },
      {
        id: 'area_from_diameter',
        name: 'Area from Diameter',
        description: 'A = π(d/2)²',
        inputs: [{ key: 'd', label: 'Diameter (d)', placeholder: 'e.g. 10' }],
      },
      {
        id: 'sector_area',
        name: 'Sector Area',
        description: 'A = (θ/360)πr²',
        inputs: [
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' },
          { key: 'theta', label: 'Central Angle θ (degrees)', placeholder: 'e.g. 90' },
        ],
      },
      {
        id: 'arc_length',
        name: 'Arc Length',
        description: 'L = (θ/360) × 2πr',
        inputs: [
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' },
          { key: 'theta', label: 'Central Angle θ (degrees)', placeholder: 'e.g. 90' },
        ],
      },
      {
        id: 'inscribed_angle',
        name: 'Inscribed Angle Theorem',
        description: 'Inscribed angle = Central angle / 2',
        inputs: [{ key: 'central', label: 'Central Angle (degrees)', placeholder: 'e.g. 120' }],
      },
      {
        id: 'central_from_inscribed',
        name: 'Central Angle from Inscribed',
        description: 'Central angle = 2 × Inscribed angle',
        inputs: [{ key: 'inscribed', label: 'Inscribed Angle (degrees)', placeholder: 'e.g. 35' }],
      },
      {
        id: 'chord_length',
        name: 'Chord Length',
        description: 'c = 2r × sin(θ/2)',
        inputs: [
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' },
          { key: 'theta', label: 'Central Angle θ (degrees)', placeholder: 'e.g. 60' },
        ],
      },
      {
        id: 'tangent_length',
        name: 'Tangent from External Point',
        description: 'T = √(d² - r²)',
        inputs: [
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' },
          { key: 'd', label: 'Distance from Center to Point', placeholder: 'e.g. 13' },
        ],
      },
      {
        id: 'tangent_chord_angle',
        name: 'Tangent-Chord Angle',
        description: 'Angle = Arc / 2',
        inputs: [{ key: 'arc', label: 'Intercepted Arc (degrees)', placeholder: 'e.g. 80' }],
      },
      {
        id: 'two_tangents_angle',
        name: 'Angle Between Two Tangents',
        description: 'Angle = 180° - Central angle',
        inputs: [{ key: 'central', label: 'Central Angle between tangent points (°)', placeholder: 'e.g. 120' }],
      },
      {
        id: 'annulus_area',
        name: 'Annulus Area (Ring)',
        description: 'A = π(R² - r²)',
        inputs: [
          { key: 'R', label: 'Outer Radius (R)', placeholder: 'e.g. 10' },
          { key: 'r', label: 'Inner Radius (r)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'segment_area',
        name: 'Segment Area',
        description: 'A = (r²/2)(θ - sinθ)',
        inputs: [
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 10' },
          { key: 'theta', label: 'Central Angle θ (degrees)', placeholder: 'e.g. 90' },
        ],
      },
    ],
  },
  {
    id: 'triangle',
    name: 'Triangle',
    icon: '△',
    formulas: [
      {
        id: 'area_bh',
        name: 'Area (Base × Height)',
        description: 'A = ½ × b × h',
        inputs: [
          { key: 'b', label: 'Base (b)', placeholder: 'e.g. 10' },
          { key: 'h', label: 'Height (h)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'area_heron',
        name: "Area (Heron's Formula)",
        description: 'A = √[s(s-a)(s-b)(s-c)]',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 3' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 4' },
          { key: 'c', label: 'Side c', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'area_sas',
        name: 'Area (Two Sides + Included Angle)',
        description: 'A = ½ × a × b × sin(C)',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 5' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 7' },
          { key: 'C', label: 'Included Angle C (degrees)', placeholder: 'e.g. 60' },
        ],
      },
      {
        id: 'pythagoras_hyp',
        name: 'Pythagoras (Find Hypotenuse)',
        description: 'c = √(a² + b²)',
        inputs: [
          { key: 'a', label: 'Leg a', placeholder: 'e.g. 3' },
          { key: 'b', label: 'Leg b', placeholder: 'e.g. 4' },
        ],
      },
      {
        id: 'pythagoras_leg',
        name: 'Pythagoras (Find Missing Leg)',
        description: 'a = √(c² - b²)',
        inputs: [
          { key: 'c', label: 'Hypotenuse (c)', placeholder: 'e.g. 13' },
          { key: 'b', label: 'Known Leg (b)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'missing_angle',
        name: 'Find Missing Angle',
        description: 'A + B + C = 180°',
        inputs: [
          { key: 'A', label: 'Angle A (degrees)', placeholder: 'e.g. 60' },
          { key: 'B', label: 'Angle B (degrees)', placeholder: 'e.g. 80' },
        ],
      },
      {
        id: 'sine_rule_side',
        name: 'Sine Rule (Find Side)',
        description: 'a/sin(A) = b/sin(B)',
        inputs: [
          { key: 'a', label: 'Known Side (a)', placeholder: 'e.g. 10' },
          { key: 'A', label: 'Angle opposite a (°)', placeholder: 'e.g. 30' },
          { key: 'B', label: 'Angle opposite unknown (°)', placeholder: 'e.g. 60' },
        ],
      },
      {
        id: 'sine_rule_angle',
        name: 'Sine Rule (Find Angle)',
        description: 'sin(A)/a = sin(B)/b',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 10' },
          { key: 'A', label: 'Angle opposite a (°)', placeholder: 'e.g. 30' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 15' },
        ],
      },
      {
        id: 'cosine_rule_side',
        name: 'Cosine Rule (Find Side)',
        description: 'c² = a² + b² - 2ab·cos(C)',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 5' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 7' },
          { key: 'C', label: 'Included Angle C (°)', placeholder: 'e.g. 60' },
        ],
      },
      {
        id: 'cosine_rule_angle',
        name: 'Cosine Rule (Find Angle)',
        description: 'cos(C) = (a²+b²-c²) / 2ab',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 5' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 7' },
          { key: 'c', label: 'Side c (opposite to angle)', placeholder: 'e.g. 8' },
        ],
      },
      {
        id: 'triangle_perimeter',
        name: 'Perimeter',
        description: 'P = a + b + c',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 3' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 4' },
          { key: 'c', label: 'Side c', placeholder: 'e.g. 5' },
        ],
      },
    ],
  },
  {
    id: 'construction',
    name: 'Construction & Bisectors',
    icon: '📏',
    formulas: [
      {
        id: 'perpendicular_bisector',
        name: 'Perpendicular Bisector (Midpoint)',
        description: 'Find midpoint and perpendicular bisector of a segment',
        inputs: [
          { key: 'x1', label: 'Point A x-coordinate', placeholder: 'e.g. 2' },
          { key: 'y1', label: 'Point A y-coordinate', placeholder: 'e.g. 3' },
          { key: 'x2', label: 'Point B x-coordinate', placeholder: 'e.g. 8' },
          { key: 'y2', label: 'Point B y-coordinate', placeholder: 'e.g. 7' },
        ],
      },
      {
        id: 'angle_bisector',
        name: 'Angle Bisector',
        description: 'Bisect an angle into two equal parts',
        inputs: [{ key: 'angle', label: 'Angle to bisect (degrees)', placeholder: 'e.g. 60' }],
      },
      {
        id: 'angle_bisector_triangle',
        name: 'Angle Bisector Length (Triangle)',
        description: 'Length of angle bisector from vertex to opposite side',
        inputs: [
          { key: 'a', label: 'Side a (adjacent to angle)', placeholder: 'e.g. 5' },
          { key: 'b', label: 'Side b (adjacent to angle)', placeholder: 'e.g. 7' },
          { key: 'c', label: 'Side c (opposite to angle)', placeholder: 'e.g. 8' },
        ],
      },
      {
        id: 'circumscribed_circle',
        name: 'Circumscribed Circle (Circumradius)',
        description: 'R = abc / 4A (radius of circumscribed circle)',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 3' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 4' },
          { key: 'c', label: 'Side c', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'inscribed_circle_triangle',
        name: 'Inscribed Circle (Inradius)',
        description: 'r = A / s (radius of inscribed circle)',
        inputs: [
          { key: 'a', label: 'Side a', placeholder: 'e.g. 3' },
          { key: 'b', label: 'Side b', placeholder: 'e.g. 4' },
          { key: 'c', label: 'Side c', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'divide_segment',
        name: 'Divide Segment in Ratio',
        description: 'Find point dividing AB in ratio m:n',
        inputs: [
          { key: 'x1', label: 'Point A x', placeholder: 'e.g. 1' },
          { key: 'y1', label: 'Point A y', placeholder: 'e.g. 2' },
          { key: 'x2', label: 'Point B x', placeholder: 'e.g. 7' },
          { key: 'y2', label: 'Point B y', placeholder: 'e.g. 5' },
          { key: 'm', label: 'Ratio m', placeholder: 'e.g. 2' },
          { key: 'n', label: 'Ratio n', placeholder: 'e.g. 3' },
        ],
      },
    ],
  },
  {
    id: 'rectangle',
    name: 'Rectangle & Square',
    icon: '▭',
    formulas: [
      {
        id: 'rect_area',
        name: 'Rectangle Area',
        description: 'A = l × w',
        inputs: [
          { key: 'l', label: 'Length (l)', placeholder: 'e.g. 10' },
          { key: 'w', label: 'Width (w)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'rect_perimeter',
        name: 'Rectangle Perimeter',
        description: 'P = 2(l + w)',
        inputs: [
          { key: 'l', label: 'Length (l)', placeholder: 'e.g. 10' },
          { key: 'w', label: 'Width (w)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'rect_diagonal',
        name: 'Rectangle Diagonal',
        description: 'd = √(l² + w²)',
        inputs: [
          { key: 'l', label: 'Length (l)', placeholder: 'e.g. 3' },
          { key: 'w', label: 'Width (w)', placeholder: 'e.g. 4' },
        ],
      },
      {
        id: 'square_area_side',
        name: 'Square Area from Side',
        description: 'A = s²',
        inputs: [{ key: 's', label: 'Side length (s)', placeholder: 'e.g. 5' }],
      },
      {
        id: 'square_diagonal',
        name: 'Square Diagonal',
        description: 'd = s√2',
        inputs: [{ key: 's', label: 'Side length (s)', placeholder: 'e.g. 5' }],
      },
    ],
  },
  {
    id: 'polygon',
    name: 'Regular Polygon',
    icon: '⬡',
    formulas: [
      {
        id: 'interior_angle',
        name: 'Interior Angle',
        description: '(n-2)×180° / n',
        inputs: [{ key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 6' }],
      },
      {
        id: 'sum_interior',
        name: 'Sum of Interior Angles',
        description: '(n-2) × 180°',
        inputs: [{ key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 5' }],
      },
      {
        id: 'exterior_angle',
        name: 'Exterior Angle',
        description: '360° / n',
        inputs: [{ key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 8' }],
      },
      {
        id: 'polygon_area',
        name: 'Area of Regular Polygon',
        description: 'A = (n × s²) / (4 × tan(π/n))',
        inputs: [
          { key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 6' },
          { key: 's', label: 'Side Length (s)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'polygon_perimeter',
        name: 'Perimeter',
        description: 'P = n × s',
        inputs: [
          { key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 6' },
          { key: 's', label: 'Side Length (s)', placeholder: 'e.g. 5' },
        ],
      },
      {
        id: 'apothem',
        name: 'Apothem',
        description: 'a = s / (2 × tan(π/n))',
        inputs: [
          { key: 'n', label: 'Number of Sides (n)', placeholder: 'e.g. 6' },
          { key: 's', label: 'Side Length (s)', placeholder: 'e.g. 5' },
        ],
      },
    ],
  },
  {
    id: 'coordinate',
    name: 'Coordinate Geometry',
    icon: '📍',
    formulas: [
      {
        id: 'distance',
        name: 'Distance Between Two Points',
        description: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
        inputs: [
          { key: 'x1', label: 'x₁', placeholder: 'e.g. 1' },
          { key: 'y1', label: 'y₁', placeholder: 'e.g. 2' },
          { key: 'x2', label: 'x₂', placeholder: 'e.g. 4' },
          { key: 'y2', label: 'y₂', placeholder: 'e.g. 6' },
        ],
      },
      {
        id: 'midpoint',
        name: 'Midpoint',
        description: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
        inputs: [
          { key: 'x1', label: 'x₁', placeholder: 'e.g. 1' },
          { key: 'y1', label: 'y₁', placeholder: 'e.g. 2' },
          { key: 'x2', label: 'x₂', placeholder: 'e.g. 4' },
          { key: 'y2', label: 'y₂', placeholder: 'e.g. 6' },
        ],
      },
      {
        id: 'slope',
        name: 'Slope of a Line',
        description: 'm = (y₂-y₁) / (x₂-x₁)',
        inputs: [
          { key: 'x1', label: 'x₁', placeholder: 'e.g. 1' },
          { key: 'y1', label: 'y₁', placeholder: 'e.g. 2' },
          { key: 'x2', label: 'x₂', placeholder: 'e.g. 4' },
          { key: 'y2', label: 'y₂', placeholder: 'e.g. 6' },
        ],
      },
      {
        id: 'line_equation',
        name: 'Equation of a Line',
        description: 'y = mx + b',
        inputs: [
          { key: 'x1', label: 'x₁', placeholder: 'e.g. 1' },
          { key: 'y1', label: 'y₁', placeholder: 'e.g. 2' },
          { key: 'x2', label: 'x₂', placeholder: 'e.g. 4' },
          { key: 'y2', label: 'y₂', placeholder: 'e.g. 6' },
        ],
      },
      {
        id: 'triangle_area_coords',
        name: 'Triangle Area (Coordinates)',
        description: 'A = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|',
        inputs: [
          { key: 'x1', label: 'x₁', placeholder: 'e.g. 0' },
          { key: 'y1', label: 'y₁', placeholder: 'e.g. 0' },
          { key: 'x2', label: 'x₂', placeholder: 'e.g. 4' },
          { key: 'y2', label: 'y₂', placeholder: 'e.g. 0' },
          { key: 'x3', label: 'x₃', placeholder: 'e.g. 2' },
          { key: 'y3', label: 'y₃', placeholder: 'e.g. 3' },
        ],
      },
      {
        id: 'circle_equation',
        name: 'Circle Equation',
        description: '(x-h)² + (y-k)² = r²',
        inputs: [
          { key: 'h', label: 'Center x (h)', placeholder: 'e.g. 3' },
          { key: 'k', label: 'Center y (k)', placeholder: 'e.g. 4' },
          { key: 'r', label: 'Radius (r)', placeholder: 'e.g. 5' },
        ],
      },
    ],
  },
];

// ──── Solver ────

export function solveGeometry(
  shapeId: string,
  formulaId: string,
  values: Record<string, number>
): Solution {
  const PI = Math.PI;
  const toRad = (deg: number) => (deg * PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / PI;

  const shape = geometryShapes.find((s) => s.id === shapeId);
  const formula = shape?.formulas.find((f) => f.id === formulaId);
  const problemName = formula ? `${shape?.name} — ${formula.name}` : 'Geometry';

  // ─── Circle ────────────────────────
  if (shapeId === 'circle') {
    if (formulaId === 'area_from_radius') {
      const r = values.r;
      const area = PI * r * r;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the formula for the area of a circle', expression: 'A = πr²' },
        { description: 'Substitute the radius', expression: `A = π × ${r}²` },
        { description: 'Calculate r²', expression: `${r}² = ${fmt(r * r)}` },
        { description: 'Multiply by π', expression: `A = π × ${fmt(r * r)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'circumference') {
      const r = values.r;
      const circ = 2 * PI * r;
      return ok(problemName, fmt(circ) + ' units', [
        { description: 'Write the formula for circumference', expression: 'C = 2πr' },
        { description: 'Substitute the radius', expression: `C = 2 × π × ${r}` },
        { description: 'Calculate', expression: `C = ${fmt(circ)}` },
        { description: 'Final answer', expression: `Circumference = ${fmt(circ)} units` },
      ]);
    }
    if (formulaId === 'area_from_diameter') {
      const d = values.d;
      const r = d / 2;
      const area = PI * r * r;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Find the radius from diameter', expression: `r = d/2 = ${d}/2 = ${fmt(r)}` },
        { description: 'Apply the area formula', expression: `A = πr² = π × ${fmt(r)}²` },
        { description: 'Calculate', expression: `A = π × ${fmt(r * r)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'sector_area') {
      const r = values.r;
      const theta = values.theta;
      const area = (theta / 360) * PI * r * r;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the sector area formula', expression: 'A = (θ/360) × πr²' },
        { description: 'Substitute values', expression: `A = (${theta}/360) × π × ${r}²` },
        { description: 'Calculate the fraction of the circle', expression: `θ/360 = ${theta}/360 = ${fmt(theta / 360)}` },
        { description: 'Calculate πr²', expression: `πr² = π × ${fmt(r * r)} = ${fmt(PI * r * r)}` },
        { description: 'Multiply', expression: `A = ${fmt(theta / 360)} × ${fmt(PI * r * r)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Sector area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'arc_length') {
      const r = values.r;
      const theta = values.theta;
      const len = (theta / 360) * 2 * PI * r;
      return ok(problemName, fmt(len) + ' units', [
        { description: 'Write the arc length formula', expression: 'L = (θ/360) × 2πr' },
        { description: 'Substitute values', expression: `L = (${theta}/360) × 2π × ${r}` },
        { description: 'Calculate the fraction', expression: `θ/360 = ${fmt(theta / 360)}` },
        { description: 'Calculate 2πr', expression: `2πr = 2 × π × ${r} = ${fmt(2 * PI * r)}` },
        { description: 'Multiply', expression: `L = ${fmt(theta / 360)} × ${fmt(2 * PI * r)} = ${fmt(len)}` },
        { description: 'Final answer', expression: `Arc length = ${fmt(len)} units` },
      ]);
    }
    if (formulaId === 'inscribed_angle') {
      const central = values.central;
      const inscribed = central / 2;
      return ok(problemName, fmt(inscribed) + '°', [
        { description: 'Apply the Inscribed Angle Theorem', expression: 'An inscribed angle is half the central angle that subtends the same arc' },
        { description: 'Formula', expression: 'Inscribed Angle = Central Angle / 2' },
        { description: 'Substitute', expression: `Inscribed Angle = ${central}° / 2` },
        { description: 'Final answer', expression: `Inscribed Angle = ${fmt(inscribed)}°` },
      ]);
    }
    if (formulaId === 'central_from_inscribed') {
      const inscribed = values.inscribed;
      const central = inscribed * 2;
      return ok(problemName, fmt(central) + '°', [
        { description: 'Apply the Inscribed Angle Theorem (reverse)', expression: 'Central Angle = 2 × Inscribed Angle' },
        { description: 'Substitute', expression: `Central Angle = 2 × ${inscribed}°` },
        { description: 'Final answer', expression: `Central Angle = ${fmt(central)}°` },
      ]);
    }
    if (formulaId === 'chord_length') {
      const r = values.r;
      const theta = values.theta;
      const thetaRad = toRad(theta);
      const chord = 2 * r * Math.sin(thetaRad / 2);
      return ok(problemName, fmt(chord) + ' units', [
        { description: 'Write the chord length formula', expression: 'c = 2r × sin(θ/2)' },
        { description: 'Convert angle to radians', expression: `θ = ${theta}° = ${fmt(thetaRad)} rad` },
        { description: 'Calculate θ/2', expression: `θ/2 = ${fmt(thetaRad / 2)} rad = ${fmt(theta / 2)}°` },
        { description: 'Calculate sin(θ/2)', expression: `sin(${fmt(theta / 2)}°) = ${fmt(Math.sin(thetaRad / 2))}` },
        { description: 'Multiply', expression: `c = 2 × ${r} × ${fmt(Math.sin(thetaRad / 2))} = ${fmt(chord)}` },
        { description: 'Final answer', expression: `Chord length = ${fmt(chord)} units` },
      ]);
    }
    if (formulaId === 'tangent_length') {
      const r = values.r;
      const d = values.d;
      if (d <= r) {
        return err(problemName, 'The external point must be farther from center than the radius (d > r).');
      }
      const tangent = Math.sqrt(d * d - r * r);
      return ok(problemName, fmt(tangent) + ' units', [
        { description: 'A tangent is perpendicular to the radius at the point of tangency', expression: 'This forms a right triangle with legs r and T, and hypotenuse d' },
        { description: 'Apply Pythagorean theorem', expression: 'T² + r² = d²  →  T = √(d² - r²)' },
        { description: 'Substitute values', expression: `T = √(${d}² - ${r}²)` },
        { description: 'Calculate squares', expression: `T = √(${fmt(d * d)} - ${fmt(r * r)}) = √(${fmt(d * d - r * r)})` },
        { description: 'Final answer', expression: `Tangent length = ${fmt(tangent)} units` },
      ]);
    }
    if (formulaId === 'tangent_chord_angle') {
      const arc = values.arc;
      const angle = arc / 2;
      return ok(problemName, fmt(angle) + '°', [
        { description: 'Apply the Tangent-Chord Angle Theorem', expression: 'The angle between a tangent and a chord equals half the intercepted arc' },
        { description: 'Formula', expression: 'Angle = Intercepted Arc / 2' },
        { description: 'Substitute', expression: `Angle = ${arc}° / 2` },
        { description: 'Final answer', expression: `Angle = ${fmt(angle)}°` },
      ]);
    }
    if (formulaId === 'two_tangents_angle') {
      const central = values.central;
      const angle = 180 - central;
      return ok(problemName, fmt(angle) + '°', [
        { description: 'Two tangents from an external point form an angle', expression: 'The angle between two tangents = 180° - central angle between the tangent points' },
        { description: 'Substitute', expression: `Angle = 180° - ${central}°` },
        { description: 'Final answer', expression: `Angle = ${fmt(angle)}°` },
      ]);
    }
    if (formulaId === 'annulus_area') {
      const R = values.R;
      const r = values.r;
      if (R <= r) return err(problemName, 'Outer radius R must be greater than inner radius r.');
      const area = PI * (R * R - r * r);
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the annulus area formula', expression: 'A = π(R² - r²)' },
        { description: 'Calculate R²', expression: `R² = ${R}² = ${fmt(R * R)}` },
        { description: 'Calculate r²', expression: `r² = ${r}² = ${fmt(r * r)}` },
        { description: 'Subtract', expression: `R² - r² = ${fmt(R * R)} - ${fmt(r * r)} = ${fmt(R * R - r * r)}` },
        { description: 'Multiply by π', expression: `A = π × ${fmt(R * R - r * r)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Annulus area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'segment_area') {
      const r = values.r;
      const theta = values.theta;
      const thetaRad = toRad(theta);
      const area = (r * r / 2) * (thetaRad - Math.sin(thetaRad));
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the segment area formula', expression: 'A = (r²/2)(θ - sin θ)  where θ is in radians' },
        { description: 'Convert angle to radians', expression: `θ = ${theta}° = ${fmt(thetaRad)} rad` },
        { description: 'Calculate r²/2', expression: `r²/2 = ${fmt(r * r)} / 2 = ${fmt(r * r / 2)}` },
        { description: 'Calculate (θ - sin θ)', expression: `${fmt(thetaRad)} - sin(${fmt(thetaRad)}) = ${fmt(thetaRad)} - ${fmt(Math.sin(thetaRad))} = ${fmt(thetaRad - Math.sin(thetaRad))}` },
        { description: 'Multiply', expression: `A = ${fmt(r * r / 2)} × ${fmt(thetaRad - Math.sin(thetaRad))} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Segment area = ${fmt(area)} square units` },
      ]);
    }
  }

  // ─── Triangle ──────────────────────
  if (shapeId === 'triangle') {
    if (formulaId === 'area_bh') {
      const b = values.b, h = values.h;
      const area = 0.5 * b * h;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the area formula', expression: 'A = ½ × base × height' },
        { description: 'Substitute', expression: `A = ½ × ${b} × ${h}` },
        { description: 'Calculate', expression: `A = ${fmt(0.5)} × ${fmt(b * h)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'area_heron') {
      const a = values.a, b = values.b, c = values.c;
      const s = (a + b + c) / 2;
      const areaSquared = s * (s - a) * (s - b) * (s - c);
      if (areaSquared < 0) return err(problemName, 'Invalid triangle sides — these sides cannot form a triangle.');
      const area = Math.sqrt(areaSquared);
      return ok(problemName, fmt(area) + ' sq units', [
        { description: "Write Heron's formula", expression: 'A = √[s(s-a)(s-b)(s-c)]  where s = (a+b+c)/2' },
        { description: 'Calculate the semi-perimeter', expression: `s = (${a} + ${b} + ${c}) / 2 = ${fmt(a + b + c)} / 2 = ${fmt(s)}` },
        { description: 'Calculate (s - a)', expression: `s - a = ${fmt(s)} - ${a} = ${fmt(s - a)}` },
        { description: 'Calculate (s - b)', expression: `s - b = ${fmt(s)} - ${b} = ${fmt(s - b)}` },
        { description: 'Calculate (s - c)', expression: `s - c = ${fmt(s)} - ${c} = ${fmt(s - c)}` },
        { description: 'Multiply under the square root', expression: `s(s-a)(s-b)(s-c) = ${fmt(s)} × ${fmt(s - a)} × ${fmt(s - b)} × ${fmt(s - c)} = ${fmt(areaSquared)}` },
        { description: 'Take the square root', expression: `A = √${fmt(areaSquared)} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'area_sas') {
      const a = values.a, b = values.b, C = values.C;
      const cRad = toRad(C);
      const area = 0.5 * a * b * Math.sin(cRad);
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Write the SAS area formula', expression: 'A = ½ × a × b × sin(C)' },
        { description: 'Substitute values', expression: `A = ½ × ${a} × ${b} × sin(${C}°)` },
        { description: 'Calculate sin(C)', expression: `sin(${C}°) = ${fmt(Math.sin(cRad))}` },
        { description: 'Multiply', expression: `A = 0.5 × ${a} × ${b} × ${fmt(Math.sin(cRad))} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'pythagoras_hyp') {
      const a = values.a, b = values.b;
      const c = Math.sqrt(a * a + b * b);
      return ok(problemName, fmt(c) + ' units', [
        { description: 'Write the Pythagorean theorem', expression: 'c² = a² + b²' },
        { description: 'Calculate a²', expression: `a² = ${a}² = ${fmt(a * a)}` },
        { description: 'Calculate b²', expression: `b² = ${b}² = ${fmt(b * b)}` },
        { description: 'Add', expression: `c² = ${fmt(a * a)} + ${fmt(b * b)} = ${fmt(a * a + b * b)}` },
        { description: 'Take square root', expression: `c = √${fmt(a * a + b * b)} = ${fmt(c)}` },
        { description: 'Final answer', expression: `Hypotenuse = ${fmt(c)} units` },
      ]);
    }
    if (formulaId === 'pythagoras_leg') {
      const c = values.c, b = values.b;
      if (c <= b) return err(problemName, 'Hypotenuse must be longer than the known leg.');
      const a = Math.sqrt(c * c - b * b);
      return ok(problemName, fmt(a) + ' units', [
        { description: 'Rearrange Pythagorean theorem', expression: 'a² = c² - b²' },
        { description: 'Calculate c²', expression: `c² = ${c}² = ${fmt(c * c)}` },
        { description: 'Calculate b²', expression: `b² = ${b}² = ${fmt(b * b)}` },
        { description: 'Subtract', expression: `a² = ${fmt(c * c)} - ${fmt(b * b)} = ${fmt(c * c - b * b)}` },
        { description: 'Take square root', expression: `a = √${fmt(c * c - b * b)} = ${fmt(a)}` },
        { description: 'Final answer', expression: `Missing leg = ${fmt(a)} units` },
      ]);
    }
    if (formulaId === 'missing_angle') {
      const A = values.A, B = values.B;
      const C = 180 - A - B;
      if (C <= 0) return err(problemName, 'The given angles already exceed 180°. Check your values.');
      return ok(problemName, fmt(C) + '°', [
        { description: 'Angles in a triangle sum to 180°', expression: 'A + B + C = 180°' },
        { description: 'Substitute known angles', expression: `${A}° + ${B}° + C = 180°` },
        { description: 'Solve for C', expression: `C = 180° - ${A}° - ${B}°` },
        { description: 'Calculate', expression: `C = 180° - ${fmt(A + B)}° = ${fmt(C)}°` },
        { description: 'Final answer', expression: `Missing angle = ${fmt(C)}°` },
      ]);
    }
    if (formulaId === 'sine_rule_side') {
      const a = values.a, A = values.A, B = values.B;
      const aRad = toRad(A), bRad = toRad(B);
      const b = (a * Math.sin(bRad)) / Math.sin(aRad);
      return ok(problemName, fmt(b) + ' units', [
        { description: 'Write the Sine Rule', expression: 'a/sin(A) = b/sin(B)' },
        { description: 'Rearrange to find b', expression: 'b = a × sin(B) / sin(A)' },
        { description: 'Calculate sin values', expression: `sin(${A}°) = ${fmt(Math.sin(aRad))}, sin(${B}°) = ${fmt(Math.sin(bRad))}` },
        { description: 'Substitute', expression: `b = ${a} × ${fmt(Math.sin(bRad))} / ${fmt(Math.sin(aRad))}` },
        { description: 'Calculate', expression: `b = ${fmt(a * Math.sin(bRad))} / ${fmt(Math.sin(aRad))} = ${fmt(b)}` },
        { description: 'Final answer', expression: `Unknown side = ${fmt(b)} units` },
      ]);
    }
    if (formulaId === 'sine_rule_angle') {
      const a = values.a, A = values.A, b = values.b;
      const aRad = toRad(A);
      const sinB = (b * Math.sin(aRad)) / a;
      if (Math.abs(sinB) > 1) return err(problemName, 'No valid triangle exists with these values (sin > 1).');
      const B = toDeg(Math.asin(sinB));
      return ok(problemName, fmt(B) + '°', [
        { description: 'Write the Sine Rule', expression: 'sin(A)/a = sin(B)/b' },
        { description: 'Rearrange to find sin(B)', expression: 'sin(B) = b × sin(A) / a' },
        { description: 'Calculate', expression: `sin(B) = ${b} × sin(${A}°) / ${a} = ${b} × ${fmt(Math.sin(aRad))} / ${a} = ${fmt(sinB)}` },
        { description: 'Find angle B', expression: `B = arcsin(${fmt(sinB)}) = ${fmt(B)}°` },
        { description: 'Note: There may be a second solution at 180° - B', expression: `B₂ = 180° - ${fmt(B)}° = ${fmt(180 - B)}° (check if valid)` },
        { description: 'Final answer', expression: `Angle B = ${fmt(B)}°` },
      ]);
    }
    if (formulaId === 'cosine_rule_side') {
      const a = values.a, b = values.b, C = values.C;
      const cRad = toRad(C);
      const cSquared = a * a + b * b - 2 * a * b * Math.cos(cRad);
      const c = Math.sqrt(cSquared);
      return ok(problemName, fmt(c) + ' units', [
        { description: 'Write the Cosine Rule', expression: 'c² = a² + b² - 2ab·cos(C)' },
        { description: 'Calculate a² + b²', expression: `${a}² + ${b}² = ${fmt(a * a)} + ${fmt(b * b)} = ${fmt(a * a + b * b)}` },
        { description: 'Calculate 2ab·cos(C)', expression: `2 × ${a} × ${b} × cos(${C}°) = ${fmt(2 * a * b)} × ${fmt(Math.cos(cRad))} = ${fmt(2 * a * b * Math.cos(cRad))}` },
        { description: 'Subtract', expression: `c² = ${fmt(a * a + b * b)} - ${fmt(2 * a * b * Math.cos(cRad))} = ${fmt(cSquared)}` },
        { description: 'Take square root', expression: `c = √${fmt(cSquared)} = ${fmt(c)}` },
        { description: 'Final answer', expression: `Side c = ${fmt(c)} units` },
      ]);
    }
    if (formulaId === 'cosine_rule_angle') {
      const a = values.a, b = values.b, c = values.c;
      const cosC = (a * a + b * b - c * c) / (2 * a * b);
      if (Math.abs(cosC) > 1) return err(problemName, 'Invalid triangle — these sides cannot form a triangle.');
      const C = toDeg(Math.acos(cosC));
      return ok(problemName, fmt(C) + '°', [
        { description: 'Write the Cosine Rule (rearranged)', expression: 'cos(C) = (a² + b² - c²) / (2ab)' },
        { description: 'Calculate numerator', expression: `a² + b² - c² = ${fmt(a * a)} + ${fmt(b * b)} - ${fmt(c * c)} = ${fmt(a * a + b * b - c * c)}` },
        { description: 'Calculate denominator', expression: `2ab = 2 × ${a} × ${b} = ${fmt(2 * a * b)}` },
        { description: 'Divide', expression: `cos(C) = ${fmt(a * a + b * b - c * c)} / ${fmt(2 * a * b)} = ${fmt(cosC)}` },
        { description: 'Find angle', expression: `C = arccos(${fmt(cosC)}) = ${fmt(C)}°` },
        { description: 'Final answer', expression: `Angle C = ${fmt(C)}°` },
      ]);
    }
    if (formulaId === 'triangle_perimeter') {
      const a = values.a, b = values.b, c = values.c;
      const p = a + b + c;
      return ok(problemName, fmt(p) + ' units', [
        { description: 'Add all three sides', expression: `P = a + b + c = ${a} + ${b} + ${c}` },
        { description: 'Final answer', expression: `Perimeter = ${fmt(p)} units` },
      ]);
    }
  }

  // ─── Construction & Bisectors ──────
  if (shapeId === 'construction') {
    if (formulaId === 'perpendicular_bisector') {
      const { x1, y1, x2, y2 } = values;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1;
      const steps = [
        { description: 'Find the midpoint of segment AB', expression: `M = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${fmt(mx)}, ${fmt(my)})` },
        { description: 'Find the slope of AB', expression: dx === 0 ? `AB is vertical, slope is undefined` : `m_AB = (${y2}-${y1})/(${x2}-${x1}) = ${fmt(dy)}/${fmt(dx)} = ${fmt(dy / dx)}` },
      ];
      if (dx === 0) {
        steps.push({ description: 'Perpendicular bisector is horizontal through midpoint', expression: `y = ${fmt(my)}` });
        return ok(problemName, `Midpoint: (${fmt(mx)}, ${fmt(my)}), Line: y = ${fmt(my)}`, steps);
      }
      if (dy === 0) {
        steps.push({ description: 'AB is horizontal, so perpendicular bisector is vertical through midpoint', expression: `x = ${fmt(mx)}` });
        return ok(problemName, `Midpoint: (${fmt(mx)}, ${fmt(my)}), Line: x = ${fmt(mx)}`, steps);
      }
      const perpSlope = -dx / dy;
      const bIntercept = my - perpSlope * mx;
      steps.push({ description: 'Perpendicular slope is negative reciprocal', expression: `m_perp = -1/m_AB = ${fmt(perpSlope)}` });
      steps.push({ description: 'Use point-slope form through midpoint', expression: `y - ${fmt(my)} = ${fmt(perpSlope)}(x - ${fmt(mx)})` });
      steps.push({ description: 'Simplify to slope-intercept form', expression: `y = ${fmt(perpSlope)}x + ${fmt(bIntercept)}` });
      return ok(problemName, `Midpoint: (${fmt(mx)}, ${fmt(my)}), y = ${fmt(perpSlope)}x + ${fmt(bIntercept)}`, steps);
    }
    if (formulaId === 'angle_bisector') {
      const angle = values.angle;
      const half = angle / 2;
      return ok(problemName, fmt(half) + '° each', [
        { description: 'An angle bisector divides an angle into two equal parts', expression: `Angle = ${angle}°` },
        { description: 'Each half', expression: `${angle}° / 2 = ${fmt(half)}°` },
        { description: 'Construction method', expression: '1. Place compass at vertex, draw an arc intersecting both sides\n2. From each intersection, draw equal arcs that intersect each other\n3. Draw a line from vertex through the intersection of arcs' },
        { description: 'Final answer', expression: `Each bisected angle = ${fmt(half)}°` },
      ]);
    }
    if (formulaId === 'angle_bisector_triangle') {
      const a = values.a, b = values.b, c = values.c;
      const s = (a + b + c) / 2;
      const t = (2 / (a + b)) * Math.sqrt(a * b * s * (s - c));
      return ok(problemName, fmt(t) + ' units', [
        { description: 'Use the angle bisector length formula', expression: 't = (2ab/(a+b)) × cos(C/2)\nOr equivalently: t = (2/(a+b)) × √[ab·s·(s-c)]' },
        { description: 'Calculate semi-perimeter', expression: `s = (${a}+${b}+${c})/2 = ${fmt(s)}` },
        { description: 'Calculate the product ab·s·(s-c)', expression: `${a} × ${b} × ${fmt(s)} × ${fmt(s - c)} = ${fmt(a * b * s * (s - c))}` },
        { description: 'Take square root', expression: `√${fmt(a * b * s * (s - c))} = ${fmt(Math.sqrt(a * b * s * (s - c)))}` },
        { description: 'Multiply by 2/(a+b)', expression: `t = (2/${fmt(a + b)}) × ${fmt(Math.sqrt(a * b * s * (s - c)))} = ${fmt(t)}` },
        { description: 'Final answer', expression: `Angle bisector length = ${fmt(t)} units` },
      ]);
    }
    if (formulaId === 'circumscribed_circle') {
      const a = values.a, b = values.b, c = values.c;
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const R = (a * b * c) / (4 * area);
      return ok(problemName, fmt(R) + ' units', [
        { description: 'Formula: R = abc / (4 × Area)', expression: 'First find the area using Heron\'s formula' },
        { description: 'Semi-perimeter', expression: `s = (${a}+${b}+${c})/2 = ${fmt(s)}` },
        { description: 'Area by Heron\'s formula', expression: `A = √[${fmt(s)}×${fmt(s - a)}×${fmt(s - b)}×${fmt(s - c)}] = ${fmt(area)}` },
        { description: 'Calculate abc', expression: `abc = ${a} × ${b} × ${c} = ${fmt(a * b * c)}` },
        { description: 'Calculate 4A', expression: `4A = 4 × ${fmt(area)} = ${fmt(4 * area)}` },
        { description: 'Divide', expression: `R = ${fmt(a * b * c)} / ${fmt(4 * area)} = ${fmt(R)}` },
        { description: 'Final answer', expression: `Circumradius R = ${fmt(R)} units` },
      ]);
    }
    if (formulaId === 'inscribed_circle_triangle') {
      const a = values.a, b = values.b, c = values.c;
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const r = area / s;
      return ok(problemName, fmt(r) + ' units', [
        { description: 'Formula: r = Area / s (semi-perimeter)', expression: 'First find the area using Heron\'s formula' },
        { description: 'Semi-perimeter', expression: `s = (${a}+${b}+${c})/2 = ${fmt(s)}` },
        { description: 'Area by Heron\'s formula', expression: `A = √[${fmt(s)}×${fmt(s - a)}×${fmt(s - b)}×${fmt(s - c)}] = ${fmt(area)}` },
        { description: 'Divide area by semi-perimeter', expression: `r = ${fmt(area)} / ${fmt(s)} = ${fmt(r)}` },
        { description: 'Final answer', expression: `Inradius r = ${fmt(r)} units` },
      ]);
    }
    if (formulaId === 'divide_segment') {
      const { x1, y1, x2, y2, m, n } = values;
      const px = (m * x2 + n * x1) / (m + n);
      const py = (m * y2 + n * y1) / (m + n);
      return ok(problemName, `(${fmt(px)}, ${fmt(py)})`, [
        { description: 'Use the Section Formula for internal division', expression: 'P = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))' },
        { description: 'Substitute values', expression: `P = ((${m}×${x2} + ${n}×${x1})/(${m}+${n}), (${m}×${y2} + ${n}×${y1})/(${m}+${n}))` },
        { description: 'Calculate x-coordinate', expression: `Px = (${fmt(m * x2)} + ${fmt(n * x1)}) / ${fmt(m + n)} = ${fmt(m * x2 + n * x1)} / ${fmt(m + n)} = ${fmt(px)}` },
        { description: 'Calculate y-coordinate', expression: `Py = (${fmt(m * y2)} + ${fmt(n * y1)}) / ${fmt(m + n)} = ${fmt(m * y2 + n * y1)} / ${fmt(m + n)} = ${fmt(py)}` },
        { description: 'Final answer', expression: `Point P = (${fmt(px)}, ${fmt(py)})` },
      ]);
    }
  }

  // ─── Rectangle & Square ────────────
  if (shapeId === 'rectangle') {
    if (formulaId === 'rect_area') {
      const l = values.l, w = values.w;
      const area = l * w;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Area formula', expression: 'A = length × width' },
        { description: 'Substitute', expression: `A = ${l} × ${w} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'rect_perimeter') {
      const l = values.l, w = values.w;
      const p = 2 * (l + w);
      return ok(problemName, fmt(p) + ' units', [
        { description: 'Perimeter formula', expression: 'P = 2(l + w)' },
        { description: 'Substitute', expression: `P = 2(${l} + ${w}) = 2 × ${fmt(l + w)} = ${fmt(p)}` },
        { description: 'Final answer', expression: `Perimeter = ${fmt(p)} units` },
      ]);
    }
    if (formulaId === 'rect_diagonal') {
      const l = values.l, w = values.w;
      const d = Math.sqrt(l * l + w * w);
      return ok(problemName, fmt(d) + ' units', [
        { description: 'Use Pythagorean theorem for diagonal', expression: 'd = √(l² + w²)' },
        { description: 'Calculate', expression: `d = √(${l}² + ${w}²) = √(${fmt(l * l)} + ${fmt(w * w)}) = √${fmt(l * l + w * w)} = ${fmt(d)}` },
        { description: 'Final answer', expression: `Diagonal = ${fmt(d)} units` },
      ]);
    }
    if (formulaId === 'square_area_side') {
      const s = values.s;
      const area = s * s;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Area of a square', expression: 'A = s²' },
        { description: 'Substitute', expression: `A = ${s}² = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'square_diagonal') {
      const s = values.s;
      const d = s * Math.sqrt(2);
      return ok(problemName, fmt(d) + ' units', [
        { description: 'Diagonal of a square', expression: 'd = s × √2' },
        { description: 'Substitute', expression: `d = ${s} × √2 = ${s} × ${fmt(Math.sqrt(2))} = ${fmt(d)}` },
        { description: 'Final answer', expression: `Diagonal = ${fmt(d)} units` },
      ]);
    }
  }

  // ─── Regular Polygon ───────────────
  if (shapeId === 'polygon') {
    if (formulaId === 'interior_angle') {
      const n = values.n;
      const angle = ((n - 2) * 180) / n;
      return ok(problemName, fmt(angle) + '°', [
        { description: 'Formula for interior angle of a regular polygon', expression: 'Interior Angle = (n-2) × 180° / n' },
        { description: 'Substitute n', expression: `= (${n}-2) × 180° / ${n}` },
        { description: 'Calculate (n-2)', expression: `= ${fmt(n - 2)} × 180° / ${n}` },
        { description: 'Multiply', expression: `= ${fmt((n - 2) * 180)}° / ${n}` },
        { description: 'Divide', expression: `= ${fmt(angle)}°` },
        { description: 'Final answer', expression: `Each interior angle = ${fmt(angle)}°` },
      ]);
    }
    if (formulaId === 'sum_interior') {
      const n = values.n;
      const sum = (n - 2) * 180;
      return ok(problemName, fmt(sum) + '°', [
        { description: 'Formula for sum of interior angles', expression: 'Sum = (n-2) × 180°' },
        { description: 'Substitute', expression: `Sum = (${n}-2) × 180° = ${fmt(n - 2)} × 180°` },
        { description: 'Calculate', expression: `Sum = ${fmt(sum)}°` },
        { description: 'Final answer', expression: `Sum of interior angles = ${fmt(sum)}°` },
      ]);
    }
    if (formulaId === 'exterior_angle') {
      const n = values.n;
      const angle = 360 / n;
      return ok(problemName, fmt(angle) + '°', [
        { description: 'Exterior angles of any polygon sum to 360°', expression: 'Exterior Angle = 360° / n' },
        { description: 'Substitute', expression: `= 360° / ${n}` },
        { description: 'Final answer', expression: `Each exterior angle = ${fmt(angle)}°` },
      ]);
    }
    if (formulaId === 'polygon_area') {
      const n = values.n, s = values.s;
      const area = (n * s * s) / (4 * Math.tan(PI / n));
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Area formula for regular polygon', expression: 'A = (n × s²) / (4 × tan(π/n))' },
        { description: 'Calculate s²', expression: `s² = ${s}² = ${fmt(s * s)}` },
        { description: 'Calculate tan(π/n)', expression: `tan(π/${n}) = tan(${fmt(PI / n)}) = ${fmt(Math.tan(PI / n))}` },
        { description: 'Calculate numerator', expression: `n × s² = ${n} × ${fmt(s * s)} = ${fmt(n * s * s)}` },
        { description: 'Calculate denominator', expression: `4 × tan(π/n) = 4 × ${fmt(Math.tan(PI / n))} = ${fmt(4 * Math.tan(PI / n))}` },
        { description: 'Divide', expression: `A = ${fmt(n * s * s)} / ${fmt(4 * Math.tan(PI / n))} = ${fmt(area)}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'polygon_perimeter') {
      const n = values.n, s = values.s;
      const p = n * s;
      return ok(problemName, fmt(p) + ' units', [
        { description: 'Perimeter of a regular polygon', expression: 'P = n × s' },
        { description: 'Substitute', expression: `P = ${n} × ${s} = ${fmt(p)}` },
        { description: 'Final answer', expression: `Perimeter = ${fmt(p)} units` },
      ]);
    }
    if (formulaId === 'apothem') {
      const n = values.n, s = values.s;
      const a = s / (2 * Math.tan(PI / n));
      return ok(problemName, fmt(a) + ' units', [
        { description: 'Apothem formula', expression: 'a = s / (2 × tan(π/n))' },
        { description: 'Calculate tan(π/n)', expression: `tan(π/${n}) = ${fmt(Math.tan(PI / n))}` },
        { description: 'Calculate denominator', expression: `2 × ${fmt(Math.tan(PI / n))} = ${fmt(2 * Math.tan(PI / n))}` },
        { description: 'Divide', expression: `a = ${s} / ${fmt(2 * Math.tan(PI / n))} = ${fmt(a)}` },
        { description: 'Final answer', expression: `Apothem = ${fmt(a)} units` },
      ]);
    }
  }

  // ─── Coordinate Geometry ───────────
  if (shapeId === 'coordinate') {
    if (formulaId === 'distance') {
      const { x1, y1, x2, y2 } = values;
      const dx = x2 - x1, dy = y2 - y1;
      const d = Math.sqrt(dx * dx + dy * dy);
      return ok(problemName, fmt(d) + ' units', [
        { description: 'Use the distance formula', expression: 'd = √[(x₂-x₁)² + (y₂-y₁)²]' },
        { description: 'Calculate differences', expression: `x₂-x₁ = ${x2}-${x1} = ${fmt(dx)}, y₂-y₁ = ${y2}-${y1} = ${fmt(dy)}` },
        { description: 'Square the differences', expression: `(${fmt(dx)})² = ${fmt(dx * dx)}, (${fmt(dy)})² = ${fmt(dy * dy)}` },
        { description: 'Add and take square root', expression: `d = √(${fmt(dx * dx)} + ${fmt(dy * dy)}) = √${fmt(dx * dx + dy * dy)} = ${fmt(d)}` },
        { description: 'Final answer', expression: `Distance = ${fmt(d)} units` },
      ]);
    }
    if (formulaId === 'midpoint') {
      const { x1, y1, x2, y2 } = values;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return ok(problemName, `(${fmt(mx)}, ${fmt(my)})`, [
        { description: 'Use the midpoint formula', expression: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)' },
        { description: 'Calculate x-coordinate', expression: `Mx = (${x1}+${x2})/2 = ${fmt(x1 + x2)}/2 = ${fmt(mx)}` },
        { description: 'Calculate y-coordinate', expression: `My = (${y1}+${y2})/2 = ${fmt(y1 + y2)}/2 = ${fmt(my)}` },
        { description: 'Final answer', expression: `Midpoint = (${fmt(mx)}, ${fmt(my)})` },
      ]);
    }
    if (formulaId === 'slope') {
      const { x1, y1, x2, y2 } = values;
      if (x2 === x1) {
        return ok(problemName, 'Undefined (vertical line)', [
          { description: 'Slope formula', expression: 'm = (y₂-y₁) / (x₂-x₁)' },
          { description: 'The denominator is zero', expression: `x₂-x₁ = ${x2}-${x1} = 0` },
          { description: 'A vertical line has undefined slope', expression: `The line is x = ${x1}` },
        ]);
      }
      const m = (y2 - y1) / (x2 - x1);
      return ok(problemName, fmt(m), [
        { description: 'Use the slope formula', expression: 'm = (y₂-y₁) / (x₂-x₁)' },
        { description: 'Substitute', expression: `m = (${y2}-${y1}) / (${x2}-${x1})` },
        { description: 'Calculate', expression: `m = ${fmt(y2 - y1)} / ${fmt(x2 - x1)} = ${fmt(m)}` },
        { description: 'Final answer', expression: `Slope = ${fmt(m)}` },
      ]);
    }
    if (formulaId === 'line_equation') {
      const { x1, y1, x2, y2 } = values;
      if (x2 === x1) {
        return ok(problemName, `x = ${x1}`, [
          { description: 'The points have the same x-coordinate', expression: 'This is a vertical line' },
          { description: 'Final answer', expression: `x = ${x1}` },
        ]);
      }
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      return ok(problemName, `y = ${fmt(m)}x + ${fmt(b)}`, [
        { description: 'Find the slope', expression: `m = (${y2}-${y1})/(${x2}-${x1}) = ${fmt(m)}` },
        { description: 'Use point-slope form', expression: `y - ${y1} = ${fmt(m)}(x - ${x1})` },
        { description: 'Expand', expression: `y = ${fmt(m)}x - ${fmt(m * x1)} + ${y1}` },
        { description: 'Simplify', expression: `y = ${fmt(m)}x + ${fmt(b)}` },
        { description: 'Final answer', expression: `y = ${fmt(m)}x + ${fmt(b)}` },
      ]);
    }
    if (formulaId === 'triangle_area_coords') {
      const { x1, y1, x2, y2, x3, y3 } = values;
      const area = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
      return ok(problemName, fmt(area) + ' sq units', [
        { description: 'Use the coordinate area formula', expression: 'A = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|' },
        { description: 'Substitute', expression: `A = ½|${x1}(${y2}-${y3}) + ${x2}(${y3}-${y1}) + ${x3}(${y1}-${y2})|` },
        { description: 'Calculate each term', expression: `= ½|${x1}×${fmt(y2 - y3)} + ${x2}×${fmt(y3 - y1)} + ${x3}×${fmt(y1 - y2)}|` },
        { description: 'Multiply', expression: `= ½|${fmt(x1 * (y2 - y3))} + ${fmt(x2 * (y3 - y1))} + ${fmt(x3 * (y1 - y2))}|` },
        { description: 'Sum and take absolute value', expression: `= ½ × |${fmt(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))}| = ½ × ${fmt(Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)))}` },
        { description: 'Final answer', expression: `Area = ${fmt(area)} square units` },
      ]);
    }
    if (formulaId === 'circle_equation') {
      const h = values.h, k = values.k, r = values.r;
      return ok(problemName, `(x-${fmt(h)})² + (y-${fmt(k)})² = ${fmt(r * r)}`, [
        { description: 'Standard form of circle equation', expression: '(x-h)² + (y-k)² = r²' },
        { description: 'Substitute center and radius', expression: `Center = (${fmt(h)}, ${fmt(k)}), Radius = ${r}` },
        { description: 'Calculate r²', expression: `r² = ${r}² = ${fmt(r * r)}` },
        { description: 'Write the equation', expression: `(x-${fmt(h)})² + (y-${fmt(k)})² = ${fmt(r * r)}` },
        { description: 'Expanded form', expression: `x² + y² - ${fmt(2 * h)}x - ${fmt(2 * k)}y + ${fmt(h * h + k * k - r * r)} = 0` },
      ]);
    }
  }

  return err(problemName, 'This geometry formula is not yet implemented. Please try a different one.');
}

function ok(category: string, result: string, steps: { description: string; expression: string }[]): Solution {
  return { problem: category, category: 'Geometry', result, steps, success: true };
}

function err(category: string, error: string): Solution {
  return { problem: category, category: 'Geometry', result: '', steps: [], success: false, error };
}
