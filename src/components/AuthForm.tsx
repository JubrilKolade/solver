import { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import {
  signUpWithEmail,
  signInWithEmail,
  sendResetEmail,
} from '../utils/firebase';

export type AuthMode = 'login' | 'signup' | 'reset';

interface AuthFormProps {
  mode?: AuthMode;
  onSuccess?: () => void;
  onModeChange?: (mode: AuthMode) => void;
}

export function AuthForm({
  mode = 'login',
  onSuccess,
  onModeChange,
}: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changeMode = (newMode: AuthMode) => {
    setCurrentMode(newMode);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    onModeChange?.(newMode);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmail(email, password, displayName);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Account created! Redirecting...');
        setTimeout(() => {
          setEmail('');
          setPassword('');
          setDisplayName('');
          onSuccess?.();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Logged in! Redirecting...');
        setTimeout(() => {
          setEmail('');
          setPassword('');
          onSuccess?.();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendResetEmail(email);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setEmail('');
          changeMode('login');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    switch (currentMode) {
      case 'signup':
        return handleSignUp(e);
      case 'reset':
        return handleResetPassword(e);
      default:
        return handleSignIn(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-6 sm:p-8">
      <h2 className="text-2xl font-display mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
        {currentMode === 'login' && 'Sign In'}
        {currentMode === 'signup' && 'Create Account'}
        {currentMode === 'reset' && 'Reset Password'}
      </h2>

      {error && (
        <div className="mb-4 p-3 border rounded-lg flex gap-2" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 border rounded-lg" style={{ background: 'var(--success-glow)', borderColor: 'rgba(34,197,94,0.3)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {currentMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {(currentMode === 'login' || currentMode === 'signup') && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        {(currentMode === 'login' || currentMode === 'signup') && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {currentMode === 'login' ? 'Password' : 'Password (6+ characters)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        {currentMode === 'reset' && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 text-white font-medium rounded-xl transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--accent)' }}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </form>

      {currentMode === 'login' && (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => changeMode('reset')}
            className="w-full text-sm hover:underline transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            Forgot password?
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t font-medium space-y-2" style={{ borderColor: 'var(--border-color)' }}>
        {currentMode === 'login' && (
          <button
            onClick={() => changeMode('signup')}
            className="w-full text-sm hover:underline transition-colors block text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Don't have an account? <span style={{ color: 'var(--text-primary)' }}>Sign up</span>
          </button>
        )}

        {currentMode === 'signup' && (
          <button
            onClick={() => changeMode('login')}
            className="w-full text-sm hover:underline transition-colors block text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Already have an account? <span style={{ color: 'var(--text-primary)' }}>Sign in</span>
          </button>
        )}

        {currentMode === 'reset' && (
          <button
            onClick={() => changeMode('login')}
            className="w-full text-sm hover:underline transition-colors block text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Back to <span style={{ color: 'var(--text-primary)' }}>Sign in</span>
          </button>
        )}
      </div>
    </div>
  );
}
