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
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
        <div className="text-center max-w-md glass-card p-10">
          <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>Sign In Required</h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Please sign in or create an account to access settings.
          </p>
          <a
            href="#/auth"
            className="inline-block px-8 py-3 text-white font-medium rounded-xl transition-transform hover:scale-105 shadow-lg"
            style={{ background: 'var(--accent)' }}
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-display mb-8" style={{ color: 'var(--text-primary)' }}>Account Settings</h1>

      {error && (
        <div className="mb-6 p-4 border rounded-xl flex gap-3 animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>
            <button
              onClick={clearError}
              className="text-xs hover:underline mt-1 transition"
              style={{ color: '#fca5a5' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border rounded-xl flex gap-3 animate-fade-in" style={{ background: 'var(--success-glow)', borderColor: 'rgba(34,197,94,0.3)' }}>
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>{success}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="glass-card p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-display mb-6" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Email Display */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
            <div className="flex items-center gap-3 p-3 border rounded-xl" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              <Mail className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{user?.email || 'No email set'}</span>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Primary contact for account recovery</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Bio (Optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={160}
              rows={3}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
              disabled={isLoading}
            />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{bio.length}/160 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-white font-medium rounded-xl transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'var(--accent)' }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="glass-card p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-display mb-6" style={{ color: 'var(--text-primary)' }}>Preferences</h2>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-xl transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-color)' }}
            onClick={toggleTheme}>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Toggle dark theme</p>
            </div>
            <div className="w-12 h-6 rounded-full relative transition" style={{ background: isDark ? 'var(--accent)' : 'var(--border-color)' }}>
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-[2px]'}`}
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border rounded-xl cursor-not-allowed opacity-60"
            style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Notifications</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Coming soon</p>
            </div>
            <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Session Section */}
      <div className="glass-card p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-display mb-6" style={{ color: 'var(--text-primary)' }}>Session</h2>

        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="w-full py-3 px-4 border font-medium rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
          Sign out from this device. You'll need to sign in again on next visit.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 sm:p-8 mb-6 border-b-0" style={{ borderColor: 'var(--border-accent)', background: 'var(--accent-glow)' }}>
        <h2 className="text-xl font-display font-bold mb-4" style={{ color: 'var(--accent)' }}>Danger Zone</h2>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 px-4 font-medium rounded-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-white shadow-lg"
            style={{ background: 'var(--accent)' }}
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl border flex flex-col gap-2" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
              <p className="font-bold uppercase tracking-wider text-sm" style={{ color: '#ef4444' }}>This action cannot be undone.</p>
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                Deleting your account will:
              </p>
              <ul className="text-sm list-disc list-inside mt-2 space-y-1" style={{ color: 'rgba(239,68,68,0.8)' }}>
                <li>Permanently delete your account</li>
                <li>Remove all your data and statistics</li>
                <li>Cancel any active sessions</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border font-medium rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 py-3 px-4 text-white font-medium rounded-xl transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                style={{ background: 'var(--accent)' }}
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
