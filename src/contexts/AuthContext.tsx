import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, updateProfile as updateUserProfile, type User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: number;
  lastSignIn: number;
}

export interface AuthContextType {
  // Auth state
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;

  // Auth actions
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          
          // Build profile from user object
          const userProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            isAnonymous: currentUser.isAnonymous,
            createdAt: typeof currentUser.metadata?.creationTime === 'string' ? new Date(currentUser.metadata.creationTime).getTime() : Date.now(),
            lastSignIn: typeof currentUser.metadata?.lastSignInTime === 'string' ? new Date(currentUser.metadata.lastSignInTime).getTime() : Date.now(),
          };
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      setError(null);
      if (!user) throw new Error('No user signed in');
      
      // Delete user account
      await user.delete();
      setUser(null);
      setProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      throw err;
    }
  }, [user]);

  const updateProfile = useCallback(async (displayName?: string, photoURL?: string) => {
    try {
      setError(null);
      if (!user) throw new Error('No user signed in');

      const updates: any = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;

      await updateUserProfile(user, updates);
      
      // Refresh user to get updated data
      await user.reload();
      setUser({ ...user });
      
      if (profile) {
        setProfile({
          ...profile,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update profile failed';
      setError(message);
      throw err;
    }
  }, [user, profile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user && !user.isAnonymous,
    isAnonymous: user?.isAnonymous ?? true,
    signOut,
    deleteAccount,
    updateProfile,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
