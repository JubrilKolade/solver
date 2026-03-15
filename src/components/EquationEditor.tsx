import { useState, useCallback } from 'react';

/**
 * Equation Editor Component
 * Visual tool for building mathematical expressions
 */

interface EquationEditorProps {
  onEquationChange: (equation: string) => void;
  initialEquation?: string;
}

export function EquationEditor({ onEquationChange, initialEquation = '' }: EquationEditorProps) {
  const [equation, setEquation] = useState(initialEquation);

  const handleAddSymbol = useCallback(
    (symbol: string) => {
      const newEquation = equation + symbol;
      setEquation(newEquation);
      onEquationChange(newEquation);
    },
    [equation, onEquationChange]
  );

  const handleClear = () => {
    setEquation('');
    onEquationChange('');
  };

  const handleBackspace = () => {
    const newEquation = equation.slice(0, -1);
    setEquation(newEquation);
    onEquationChange(newEquation);
  };

  const symbols = [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log(' },
    { label: 'ln', value: 'ln(' },
    { label: 'sqrt', value: 'sqrt(' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: '^', value: '^' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '÷', value: '/' },
    { label: '×', value: '*' },
    { label: '−', value: '-' },
    { label: '+', value: '+' },
    { label: '=', value: '=' },
  ];

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>ƒ(x)</span>
        <span className="text-sm text-gray-400">Visual Equation Editor</span>
      </h3>

      {/* Display */}
      <div className="bg-white/3 rounded-lg p-4 mb-4 min-h-12 font-mono text-indigo-300 text-lg break-words">
        {equation || 'Type or click symbols...'}
      </div>

      {/* Number Pad */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Numbers</p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => handleAddSymbol(num.toString())}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Variables */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Variables</p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {['x', 'y', 'z', 'a', 'b'].map((var_) => (
            <button
              key={var_}
              onClick={() => handleAddSymbol(var_)}
              className="px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm font-medium transition-colors"
            >
              {var_}
            </button>
          ))}
        </div>
      </div>

      {/* Functions & Operators */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Functions & Operators</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {symbols.map((sym) => (
            <button
              key={sym.value}
              onClick={() => handleAddSymbol(sym.value)}
              className="px-2 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
              title={sym.value}
            >
              {sym.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Or type directly:</p>
        <input
          type="text"
          value={equation}
          onChange={(e) => {
            setEquation(e.target.value);
            onEquationChange(e.target.value);
          }}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:border-indigo-500/50 outline-none"
          placeholder="e.g., 2*x + 3"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleBackspace}
          className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors"
        >
          ← Backspace
        </button>
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-medium transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
