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
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currentMode === 'login' && 'Sign In'}
        {currentMode === 'signup' && 'Create Account'}
        {currentMode === 'reset' && 'Reset Password'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {currentMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {(currentMode === 'login' || currentMode === 'signup') && (
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        {(currentMode === 'login' || currentMode === 'signup') && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {currentMode === 'login' ? 'Password' : 'Password (6+ characters)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        {currentMode === 'reset' && (
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </form>

      {currentMode === 'login' && (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => changeMode('reset')}
            className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {currentMode === 'login' && (
          <button
            onClick={() => changeMode('signup')}
            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Don't have an account? <span className="font-medium">Sign up</span>
          </button>
        )}

        {currentMode === 'signup' && (
          <button
            onClick={() => changeMode('login')}
            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Already have an account? <span className="font-medium">Sign in</span>
          </button>
        )}

        {currentMode === 'reset' && (
          <button
            onClick={() => changeMode('login')}
            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Back to <span className="font-medium">Sign in</span>
          </button>
        )}
      </div>
    </div>
  );
}
