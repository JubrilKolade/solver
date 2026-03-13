import type { Solution } from '../../utils/mathSolver';
import { cn } from '../../utils/cn';
import { GeometryTools } from '../GeometryTools';
import { SolutionContent, EmptyState } from '../SolutionCard';

interface GeometryTabProps {
  solution: Solution | null;
  onSolution: (sol: Solution) => void;
  uploadedImageUrl: string | null;
}

export function GeometryTab({ solution, onSolution, uploadedImageUrl }: GeometryTabProps) {
  const isGeometrySolution = solution && solution.category === 'Geometry';

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Geometry Tools */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center" style={{ boxShadow: '0 4px 15px var(--accent-glow-strong)' }}>
              <span className="text-xl">📐</span>
            </div>
            <div>
              <h2 className="text-lg font-display" style={{ color: 'var(--text-primary)' }}>Geometry Tools</h2>
              <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>Select shape → formula → values</p>
            </div>
          </div>

          <GeometryTools
            onSolution={onSolution}
            imageUrl={uploadedImageUrl}
          />
        </div>

        {/* Right: Solution */}
        <div className={cn(isGeometrySolution ? 'glass-card-glow' : 'glass-card')} style={{ minHeight: '300px' }}>
          <div className="p-6 sm:p-8">
            {!isGeometrySolution ? (
              <EmptyState
                emoji="📏"
                title="Geometry solution"
                description="Choose a shape and formula, enter your values, then calculate"
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
