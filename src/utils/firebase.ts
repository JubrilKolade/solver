import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  getAuth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type AuthError,
  
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Auth
export const auth = getAuth(app);

// ─── Anonymous Authentication ───────────────────────────────────────
export const signInAnonymousUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous auth failed:', error);
    return null;
  }
};

// ─── Email/Password Authentication ──────────────────────────────────
export interface AuthResponse {
  user: User | null;
  error: string | null;
}

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResponse> => {
  try {
    // Create user account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(result.user, {
        displayName,
      });
    }
    
    return { user: result.user, error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    console.error('Sign up error:', error);
    return { user: null, error: message };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    console.error('Sign in error:', error);
    return { user: null, error: message };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<{ error: string | null }> => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    console.error('Sign out error:', error);
    return { error: message };
  }
};

/**
 * Send password reset email
 */
export const sendResetEmail = async (email: string): Promise<{ error: string | null }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    console.error('Password reset error:', error);
    return { error: message };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  user: User,
  displayName?: string,
  photoURL?: string
): Promise<{ error: string | null }> => {
  try {
    const updates: any = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    
    if (Object.keys(updates).length > 0) {
      await updateProfile(user, updates);
    }
    
    return { error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    console.error('Profile update error:', error);
    return { error: message };
  }
};

// ─── Error Handling ─────────────────────────────────────────────────
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && 'code' in error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/email-already-in-use':
        return 'Email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Please try again later';
      case 'auth/operation-not-allowed':
        return 'This authentication method is not enabled';
      case 'auth/invalid-api-key':
        return 'Invalid Firebase configuration';
      default:
        return error.message || 'Authentication error occurred';
    }
  }
  return error instanceof Error ? error.message : 'Unknown authentication error';
}

export default app;
