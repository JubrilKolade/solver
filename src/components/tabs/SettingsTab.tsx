import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import * as fb from '../../services/firebaseService';
import { AlertCircle, CheckCircle, Mail, User, LogOut, Trash2, Bell, Lock } from 'lucide-react';

export function SettingsTab() {
  const { user, profile, error, clearError, updateProfile, signOut, deleteAccount } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    async function loadProfile() {
      const data = await fb.getUserProfile();
      if (data?.displayName) setDisplayName(data.displayName);
      if (data?.bio) setBio(data.bio);
    }
    loadProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    clearError();
    setIsLoading(true);

    try {
      // Update Firebase auth profile
      await updateProfile(displayName);
      
      // Save extended profile data
      await fb.saveUserProfile({
        displayName,
        bio,
        email: user?.email || null,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      
      // Delete user data from database
      await fb.deleteUserData();
      
      // Delete Firebase account
      await deleteAccount();
      
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || profile?.isAnonymous) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in or create an account to access settings.
          </p>
          <a
            href="#/auth"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={clearError}
              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Email Display */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{user?.email || 'No email set'}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Primary contact for account recovery</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{bio.length}/160 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Preferences</h2>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer" onClick={toggleTheme}>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 dark:bg-blue-600 rounded-full relative transition">
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : ''}`}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-400 cursor-not-allowed">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
            <Bell className="w-5 h-5 opacity-50" />
          </div>
        </div>
      </div>

      {/* Session Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Session</h2>

        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Sign out from this device. You'll need to sign in again on next visit.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <h2 className="text-xl font-bold text-red-900 dark:text-red-300 mb-4">Danger Zone</h2>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-800">
              <p className="font-medium text-red-900 dark:text-red-300 mb-2">This action cannot be undone.</p>
              <p className="text-sm text-red-800 dark:text-red-400">
                Deleting your account will:
              </p>
              <ul className="text-sm text-red-800 dark:text-red-400 list-disc list-inside mt-2 space-y-1">
                <li>Permanently delete your account</li>
                <li>Remove all your data and statistics</li>
                <li>Cancel any active sessions</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
