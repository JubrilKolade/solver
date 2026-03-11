import { useState } from 'react';
import { cn } from '../utils/cn';
import { geometryShapes, solveGeometry, type GeometryShape, type GeometryFormula } from '../utils/geometrySolver';
import type { Solution } from '../utils/mathSolver';

interface GeometryToolsProps {
  onSolution: (solution: Solution) => void;
  imageUrl?: string | null;
}

export function GeometryTools({ onSolution, imageUrl }: GeometryToolsProps) {
  const [selectedShape, setSelectedShape] = useState<GeometryShape | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<GeometryFormula | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showImage, setShowImage] = useState(true);

  const handleShapeSelect = (shape: GeometryShape) => {
    setSelectedShape(shape);
    setSelectedFormula(null);
    setValues({});
  };

  const handleFormulaSelect = (formula: GeometryFormula) => {
    setSelectedFormula(formula);
    setValues({});
  };

  const handleValueChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSolve = () => {
    if (!selectedShape || !selectedFormula) return;
    const numValues: Record<string, number> = {};
    for (const input of selectedFormula.inputs) {
      const val = parseFloat(values[input.key] || '');
      if (isNaN(val)) return;
      numValues[input.key] = val;
    }
    const solution = solveGeometry(selectedShape.id, selectedFormula.id, numValues);
    onSolution(solution);
  };

  const allFilled = selectedFormula?.inputs.every(
    (input) => values[input.key] && !isNaN(parseFloat(values[input.key]))
  );

  return (
    <div className="space-y-5">
      {/* Reference Image */}
      {imageUrl && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
          <button
            onClick={() => setShowImage(!showImage)}
            className="w-full flex items-center justify-between px-5 py-3 transition-all"
          >
            <div className="flex items-center gap-2">
              <span>📷</span>
              <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>Reference Image</span>
            </div>
            <svg className={cn("w-4 h-4 transition-transform", showImage && "rotate-180")} style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showImage && (
            <div className="p-4 border-t flex justify-center" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
              <img src={imageUrl} alt="Reference" className="max-h-[200px] rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}

      {/* Step 1: Shape Selection */}
      <div>
        <h3 className="text-sm font-display uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>1</span>
          Select Shape
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {geometryShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleShapeSelect(shape)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200"
              style={{
                background: selectedShape?.id === shape.id ? 'var(--accent-glow)' : 'var(--bg-subtle)',
                borderColor: selectedShape?.id === shape.id ? 'var(--accent)' : 'var(--border-color)',
                color: selectedShape?.id === shape.id ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: selectedShape?.id === shape.id ? '0 0 20px var(--glow-color)' : 'none',
              }}
            >
              <span className="text-2xl">{shape.icon}</span>
              <span className="text-sm font-medium font-body">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Formula Selection */}
      {selectedShape && (
        <div className="animate-fade-in-up">
          <h3 className="text-sm font-display uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>2</span>
            Select Formula / Theorem
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {selectedShape.formulas.map((formula) => (
              <button
                key={formula.id}
                onClick={() => handleFormulaSelect(formula)}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group"
                style={{
                  background: selectedFormula?.id === formula.id ? 'var(--accent-glow)' : 'var(--bg-subtle)',
                  borderColor: selectedFormula?.id === formula.id ? 'var(--accent)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm font-body" style={{ color: selectedFormula?.id === formula.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {formula.name}
                    </div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{formula.description}</div>
                  </div>
                  <svg className="w-4 h-4 transition-all" style={{ color: selectedFormula?.id === formula.id ? 'var(--accent)' : 'var(--text-faint)' }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Input Values */}
      {selectedFormula && (
        <div className="animate-fade-in-up">
          <h3 className="text-sm font-display uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>3</span>
            Enter Values
          </h3>
          <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
            {/* Selected formula info */}
            <div className="rounded-xl px-4 py-3 border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
              <p className="text-sm font-display" style={{ color: 'var(--accent)' }}>{selectedFormula.name}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{selectedFormula.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {selectedFormula.inputs.map((input) => (
                <div key={input.key}>
                  <label className="block text-xs font-medium mb-1.5 font-body" style={{ color: 'var(--text-muted)' }}>{input.label}</label>
                  <input
                    type="number"
                    step="any"
                    value={values[input.key] || ''}
                    onChange={(e) => handleValueChange(input.key, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm font-body transition-all focus:outline-none"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1.5px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 15px var(--glow-color)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && allFilled) handleSolve(); }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSolve}
              disabled={!allFilled}
              className={cn(
                'w-full py-3.5 rounded-xl font-display transition-all flex items-center justify-center gap-2',
                !allFilled && 'opacity-40 cursor-not-allowed',
                allFilled && 'hover:scale-[1.01] active:scale-[0.99]'
              )}
              style={{
                background: allFilled ? 'var(--accent)' : 'var(--text-faint)',
                color: allFilled ? 'var(--bg-primary)' : 'var(--text-muted)',
                boxShadow: allFilled ? '0 4px 20px var(--accent-glow-strong)' : 'none',
              }}
            >
              ✨ Calculate Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
