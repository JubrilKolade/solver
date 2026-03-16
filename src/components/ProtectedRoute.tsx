import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

/**
 * Wrapper component that protects routes requiring authentication
 * Shows user info or a prompt to sign in/create account
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) {
  const { isLoading, isAnonymous } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required and user is not authenticated
  if (requireAuth && isAnonymous) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature requires you to sign in to your account.
            </p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
              Sign In or Create Account
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
