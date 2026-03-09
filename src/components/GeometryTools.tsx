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
    <div className="space-y-6">
      {/* Reference Image */}
      {imageUrl && (
        <div className="bg-white/3 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setShowImage(!showImage)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-all"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm text-gray-300">Reference Image</span>
            </div>
            <svg className={cn("w-4 h-4 text-gray-500 transition-transform", showImage && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showImage && (
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center">
              <img src={imageUrl} alt="Reference" className="max-h-[200px] rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}

      {/* Step 1: Shape Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          Select Shape
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {geometryShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleShapeSelect(shape)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200',
                selectedShape?.id === shape.id
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-white/3 border-white/10 text-gray-400 hover:text-white hover:bg-white/6 hover:border-white/20'
              )}
            >
              <span className="text-2xl">{shape.icon}</span>
              <span className="text-sm font-medium">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Formula Selection */}
      {selectedShape && (
        <div className="animate-fade-in-up">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            Select Formula / Theorem
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {selectedShape.formulas.map((formula) => (
              <button
                key={formula.id}
                onClick={() => handleFormulaSelect(formula)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group',
                  selectedFormula?.id === formula.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/15'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{formula.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">{formula.description}</div>
                  </div>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-all',
                      selectedFormula?.id === formula.id ? 'text-indigo-400' : 'text-gray-600 group-hover:text-gray-400'
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
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
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            Enter Values
          </h3>
          <div className="bg-white/3 rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="bg-indigo-500/10 rounded-xl px-4 py-3 border border-indigo-500/20">
              <p className="text-sm text-indigo-300 font-medium">{selectedFormula.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">{selectedFormula.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {selectedFormula.inputs.map((input) => (
                <div key={input.key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{input.label}</label>
                  <input
                    type="number"
                    step="any"
                    value={values[input.key] || ''}
                    onChange={(e) => handleValueChange(input.key, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && allFilled) handleSolve();
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSolve}
              disabled={!allFilled}
              className={cn(
                'w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                allFilled
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Calculate Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
