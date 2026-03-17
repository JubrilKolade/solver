import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Settings } from 'lucide-react';

export function AuthStatus() {
  const { user, profile, isAnonymous, error, clearError, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setShowMenu(false);
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  const displayName = profile?.displayName || user.email || 'Guest';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      {error && (
        <div className="absolute right-0 top-8 bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2 whitespace-nowrap">
          {error}
          <button
            onClick={clearError}
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        title={isAnonymous ? 'Anonymous User' : displayName}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden sm:block text-sm">
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-gray-500">{isAnonymous ? 'Anonymous' : 'Logged in'}</div>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-sm">{displayName}</div>
            <div className="text-xs text-gray-500">{user.email || 'No email'}</div>
          </div>

          {!isAnonymous && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          )}

          {!isAnonymous && (
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded flex items-center gap-2 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          )}

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 py-1 text-xs text-gray-500">
              {isAnonymous ? '📱 Guest mode' : '✓ Account'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
