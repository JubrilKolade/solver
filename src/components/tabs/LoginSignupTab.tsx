import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm, type AuthMode } from '../AuthForm';
import { ArrowRight, CheckCircle, Lock, Zap } from 'lucide-react';

export function LoginSignupTab() {
  const { isAnonymous, isAuthenticated, user } = useAuth();
  const [showForm, setShowForm] = useState(!isAuthenticated);

  // If already authenticated, show success
  if (isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">You're Signed In! 🎉</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome back, <span className="font-semibold">{user?.displayName || user?.email || 'User'}</span>
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700 dark:text-green-400">
              Your stats and progress are now synced across all your devices.
            </p>
          </div>

          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
          >
            Back to Solver <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Show form for anonymous or form toggling
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {showForm ? (
          <div>
            <AuthForm 
              mode="signup"
              onSuccess={() => setShowForm(false)}
            />
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Already have an account?
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
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
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Don't have an account?
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Anonymous Mode Info */}
        {isAnonymous && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Guest Mode Active</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  You can use Solver in guest mode, but creating an account lets you:
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-8">
              <li className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Sync progress across devices
              </li>
              <li className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Save your statistics & achievements
              </li>
              <li className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Collaborate with others
              </li>
              <li className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Access premium features
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
