import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from '../AuthForm';
import { ArrowRight, CheckCircle, Lock, Zap } from 'lucide-react';

export function LoginSignupTab() {
  const { isAnonymous, isAuthenticated, user } = useAuth();
  const [showForm, setShowForm] = useState(!isAuthenticated);

  // If already authenticated, show success
  if (isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
        <div className="max-w-md w-full text-center glass-card p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--success-glow)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)' }} />
          </div>

          <h2 className="text-3xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>You're Signed In! 🎉</h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Welcome back, <span className="font-semibold text-[color:var(--text-primary)]">{user?.displayName || user?.email || 'User'}</span>
          </p>

          <div className="border rounded-lg p-4 mb-6" style={{ background: 'var(--success-glow)', borderColor: 'var(--success)' }}>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Your stats and progress are now synced across all your devices.
            </p>
          </div>

          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-transform hover:scale-105"
            style={{ background: 'var(--success)' }}
          >
            Back to Solver <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Show form for anonymous or form toggling
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in-up">
      <div className="w-full max-w-md">
        {showForm ? (
          <div>
            <AuthForm
              mode="signup"
              onSuccess={() => setShowForm(false)}
            />

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm text-center mb-4" style={{ color: 'var(--text-muted)' }}>
                Already have an account?
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="w-full py-2 px-4 border font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Sign In Instead
              </button>
            </div>
          </div>
        ) : (
          <div>
            <AuthForm
              mode="login"
              onSuccess={() => setShowForm(true)}
            />

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm text-center mb-4" style={{ color: 'var(--text-muted)' }}>
                Don't have an account?
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-2 px-4 text-white font-medium rounded-lg transition-transform hover:scale-[1.02] shadow-lg"
                style={{ background: 'var(--accent)' }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Anonymous Mode Info */}
        {isAnonymous && (
          <div className="mt-8 p-6 border rounded-2xl glass-card-static" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <p className="font-display font-medium" style={{ color: 'var(--text-primary)' }}>Guest Mode Active</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  You can use Solver in guest mode, but creating an account lets you:
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-8 mt-4">
              <li className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Sync progress across devices
              </li>
              <li className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Save your statistics & achievements
              </li>
              <li className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Collaborate with others
              </li>
              <li className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Access premium features
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
