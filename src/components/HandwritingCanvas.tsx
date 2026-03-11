import { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HandwritingCanvasProps {
  onRecognized: (text: string) => void;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

export function HandwritingCanvas({ onRecognized }: HandwritingCanvasProps) {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [penColor, setPenColor] = useState(isDark ? '#a3e635' : '#dc2626');
  const [penSize, setPenSize] = useState(3);
  const [recognizedText, setRecognizedText] = useState('');
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    setPenColor(isDark ? '#a3e635' : '#dc2626');
  }, [isDark]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw strokes
    [...strokes, { points: currentStroke, color: penColor, size: penSize }].forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, currentStroke, penColor, penSize, isDark]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 280;
        redrawCanvas();
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redrawCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentStroke([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    setCurrentStroke((prev) => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (currentStroke.length > 1) {
      setStrokes((prev) => [...prev, { points: currentStroke, color: penColor, size: penSize }]);
    }
    setCurrentStroke([]);
    setIsDrawing(false);
  };

  const undo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setRecognizedText('');
    setEditedText('');
  };

  const recognize = () => {
    // Simple OCR simulation — in production you'd use Tesseract on the canvas image
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    // Analyze strokes to provide a prompt
    const text = `[Handwritten: ${strokes.length} strokes detected]`;
    setRecognizedText(text);
    setEditedText('');

    // Show a message to the user to type what they wrote
    setRecognizedText('');
    setEditedText('');
  };

  const handleSolve = () => {
    const text = editedText.trim() || recognizedText.trim();
    if (text) {
      onRecognized(text);
    }
  };

  const colors = [
    { color: isDark ? '#a3e635' : '#dc2626', label: 'Accent' },
    { color: '#3b82f6', label: 'Blue' },
    { color: '#22c55e', label: 'Green' },
    { color: '#eab308', label: 'Yellow' },
    { color: isDark ? '#ffffff' : '#000000', label: 'B/W' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canvas card */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-xl font-display mb-1" style={{ color: 'var(--text-primary)' }}>✍️ Handwriting Canvas</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Draw your math problem, then type it in the box below to solve
          </p>

          {/* Tools */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {/* Colors */}
            <div className="flex gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.color}
                  onClick={() => setPenColor(c.color)}
                  className="w-7 h-7 rounded-full transition-all hover:scale-110"
                  style={{
                    background: c.color,
                    border: penColor === c.color ? '3px solid var(--text-primary)' : '2px solid var(--border-color)',
                    boxShadow: penColor === c.color ? '0 0 8px var(--glow-color)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Pen size */}
            <div className="flex items-center gap-1.5">
              {[2, 3, 5, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setPenSize(s)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                  style={{
                    background: penSize === s ? 'var(--accent-glow)' : 'var(--bg-subtle)',
                    border: `1px solid ${penSize === s ? 'var(--border-accent)' : 'var(--border-color)'}`,
                  }}
                >
                  <div className="rounded-full" style={{
                    width: s + 2, height: s + 2,
                    background: penSize === s ? 'var(--accent)' : 'var(--text-muted)',
                  }} />
                </button>
              ))}
            </div>

            {/* Actions */}
            <button onClick={undo} disabled={strokes.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 disabled:opacity-30"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              ↩ Undo
            </button>
            <button onClick={clearCanvas}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              ✕ Clear
            </button>
          </div>

          {/* Canvas */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair touch-none"
              style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', height: 280 }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-faint)' }}>
            ✏️ {strokes.length} strokes • Draw with mouse or touch
          </p>
        </div>

        {/* Input & Solve card */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-xl font-display mb-1" style={{ color: 'var(--text-primary)' }}>🔍 Solve from Drawing</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Type the math expression you drew, then click Solve
          </p>

          {strokes.length > 0 && !recognizedText && (
            <button
              onClick={recognize}
              className="w-full py-3 rounded-xl font-display text-sm mb-4 transition-all hover:scale-[1.02]"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
            >
              📸 Ready to solve — type your expression below
            </button>
          )}

          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Type your math problem
            </label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="e.g. x^2 + 3x - 4 = 0"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-base font-body resize-none focus:outline-none"
              style={{
                background: 'var(--bg-input)',
                border: '1.5px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            />
          </div>

          <button
            onClick={handleSolve}
            disabled={!editedText.trim()}
            className="w-full py-4 rounded-2xl font-display text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
            style={{
              background: editedText.trim() ? 'var(--accent)' : 'var(--text-faint)',
              color: editedText.trim() ? (isDark ? '#0a0a0a' : '#fff') : 'var(--text-muted)',
              boxShadow: editedText.trim() ? '0 4px 25px var(--accent-glow-strong)' : 'none',
            }}
          >
            🚀 Solve This
          </button>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-xl border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
            <p className="text-sm font-display mb-2" style={{ color: 'var(--text-primary)' }}>💡 Tips</p>
            <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
              <li>• Draw your problem clearly on the canvas for reference</li>
              <li>• Type the expression in the text box</li>
              <li>• Use ^ for powers: x^2, x^3</li>
              <li>• Use sqrt() for square root</li>
              <li>• Supports all math topics: algebra, calculus, geometry, etc.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
