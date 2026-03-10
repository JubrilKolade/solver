import type { Solution } from '../utils/mathSolver';
import { cn } from '../utils/cn';
import { ImageUpload } from './ImageUpload';
import { SolutionContent, EmptyState } from './SolutionCard';
import type { Tab } from './NavBar';

interface UploadTabProps {
  solution: Solution | null;
  onSolveText: (text: string) => void;
  onTabChange: (tab: Tab) => void;
}

export function UploadTab({ solution, onSolveText, onTabChange }: UploadTabProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Upload Area */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center" style={{ boxShadow: '0 4px 15px var(--accent-glow-strong)' }}>
              <span className="text-xl">📸</span>
            </div>
            <div>
              <h2 className="text-lg font-display" style={{ color: 'var(--text-primary)' }}>Upload Math Problem</h2>
              <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>Upload an image — we'll extract and solve it</p>
            </div>
          </div>

          <ImageUpload
            onTextExtracted={() => {}}
            onSolveText={onSolveText}
          />

          {/* Tips */}
          <div className="mt-5 p-4 rounded-xl border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>💡 Tips for best results</p>
            <ul className="text-xs space-y-1 font-body" style={{ color: 'var(--text-muted)' }}>
              <li>• Ensure text is clear and well-lit</li>
              <li>• For diagrams, use <button onClick={() => onTabChange('geometry')} className="underline" style={{ color: 'var(--accent)' }}>Geometry Tools</button></li>
              <li>• You can edit extracted text before solving</li>
            </ul>
          </div>
        </div>

        {/* Right: Solution */}
        <div className={cn(solution ? 'glass-card-glow' : 'glass-card')} style={{ minHeight: '300px' }}>
          <div className="p-6 sm:p-8">
            {!solution ? (
              <EmptyState
                emoji="📷"
                title="Upload to solve"
                description="Upload an image of your math problem and we'll solve it step by step"
              />
            ) : (
              <SolutionContent sol={solution} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
