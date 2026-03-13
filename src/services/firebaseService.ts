import { database, auth, signInAnonymousUser } from '../utils/firebase';
import { ref, set, get, push, remove, onValue, off } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

// ─── Types ────────────────────────────────────────────────────────────
export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  totalXP: number;
  topicStats: Record<string, { solved: number; correct: number }>;
  weeklyActivity: number[];
  recentProblems: { problem: string; time: number; correct: boolean }[];
  badges: string[];
}

export interface HistoryItem {
  id?: string;
  problem: string;
  result: string;
  category: string;
  steps: { description: string; expression: string }[];
  timestamp: number;
}

export interface BookmarkItem {
  id?: string;
  problem: string;
  result: string;
  category: string;
  time: number;
}

export const defaultStats: UserStats = {
  totalSolved: 0,
  totalCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalXP: 0,
  topicStats: {},
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  recentProblems: [],
  badges: [],
};

// ─── User ID management ──────────────────────────────────────────────
let currentUserId: string | null = null;
let authReady = false;
const authReadyCallbacks: ((uid: string | null) => void)[] = [];

// Initialize auth listener
onAuthStateChanged(auth, (user) => {
  currentUserId = user?.uid || null;
  authReady = true;
  authReadyCallbacks.forEach(cb => cb(currentUserId));
  authReadyCallbacks.length = 0;
});

async function ensureAuth(): Promise<string | null> {
  if (authReady && currentUserId) return currentUserId;
  
  if (!authReady) {
    return new Promise((resolve) => {
      authReadyCallbacks.push((uid) => {
        if (uid) {
          resolve(uid);
        } else {
          signInAnonymousUser().then(user => {
            currentUserId = user?.uid || null;
            resolve(currentUserId);
          });
        }
      });
    });
  }
  
  const user = await signInAnonymousUser();
  currentUserId = user?.uid || null;
  return currentUserId;
}

function userRef(path: string) {
  return ref(database, `users/${currentUserId}/${path}`);
}

// ─── Stats ───────────────────────────────────────────────────────────
export async function getUserStats(): Promise<UserStats> {
  const uid = await ensureAuth();
  if (!uid) return defaultStats;
  
  try {
    const snapshot = await get(userRef('stats'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return { ...defaultStats, ...data };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return defaultStats;
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    await set(userRef('stats'), {
      totalSolved: stats.totalSolved,
      totalCorrect: stats.totalCorrect,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
      totalXP: stats.totalXP,
      topicStats: stats.topicStats,
      weeklyActivity: stats.weeklyActivity,
      recentProblems: stats.recentProblems.slice(0, 20),
      badges: stats.badges,
    });
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export async function resetUserStats(): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    await set(userRef('stats'), defaultStats);
    await remove(userRef('history'));
    await remove(userRef('bookmarks'));
    await remove(userRef('daily'));
  } catch (e) {
    console.error('Failed to reset stats:', e);
  }
}

// ─── History ─────────────────────────────────────────────────────────
export async function saveToHistory(item: HistoryItem): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    const histRef = ref(database, `users/${uid}/history`);
    await push(histRef, {
      problem: item.problem,
      result: item.result,
      category: item.category,
      steps: item.steps,
      timestamp: item.timestamp || Date.now(),
    });
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
  const uid = await ensureAuth();
  if (!uid) return [];
  
  try {
    const snapshot = await get(userRef('history'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const items: HistoryItem[] = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        problem: val.problem,
        result: val.result,
        category: val.category,
        steps: val.steps || [],
        timestamp: val.timestamp,
      }));
      return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
    }
  } catch (e) {
    console.error('Failed to load history:', e);
  }
  return [];
}

export async function clearHistory(): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    await remove(userRef('history'));
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// ─── Bookmarks ───────────────────────────────────────────────────────
export async function saveBookmark(item: BookmarkItem): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    const bmRef = ref(database, `users/${uid}/bookmarks`);
    await push(bmRef, {
      problem: item.problem,
      result: item.result,
      category: item.category,
      time: item.time || Date.now(),
    });
  } catch (e) {
    console.error('Failed to save bookmark:', e);
  }
}

export async function getBookmarks(): Promise<BookmarkItem[]> {
  const uid = await ensureAuth();
  if (!uid) return [];
  
  try {
    const snapshot = await get(userRef('bookmarks'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        problem: val.problem,
        result: val.result,
        category: val.category,
        time: val.time,
      }));
    }
  } catch (e) {
    console.error('Failed to load bookmarks:', e);
  }
  return [];
}

export async function deleteBookmark(id: string): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    await remove(ref(database, `users/${uid}/bookmarks/${id}`));
  } catch (e) {
    console.error('Failed to delete bookmark:', e);
  }
}

// ─── Daily Challenge ─────────────────────────────────────────────────
export async function getDailyStatus(): Promise<{ completed: boolean; streak: number }> {
  const uid = await ensureAuth();
  if (!uid) return { completed: false, streak: 0 };
  
  try {
    const snapshot = await get(userRef('daily'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const today = new Date();
      const todayKey = `${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
      return {
        completed: data.lastDate === todayKey,
        streak: data.streak || 0,
      };
    }
  } catch (e) {
    console.error('Failed to load daily status:', e);
  }
  return { completed: false, streak: 0 };
}

export async function saveDailyCompletion(streak: number): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    const today = new Date();
    const todayKey = `${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
    await set(userRef('daily'), {
      lastDate: todayKey,
      streak: streak,
    });
  } catch (e) {
    console.error('Failed to save daily completion:', e);
  }
}

// ─── Real-time listeners ─────────────────────────────────────────────
export function onStatsChange(callback: (stats: UserStats) => void): () => void {
  if (!currentUserId) return () => {};
  
  const statsRef = userRef('stats');
  const handler = onValue(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ ...defaultStats, ...snapshot.val() });
    }
  });
  
  // Return unsubscribe function
  return () => off(statsRef, 'value', handler);
}

// ─── Weekly Activity ─────────────────────────────────────────────────
export async function updateWeeklyActivity(): Promise<void> {
  const uid = await ensureAuth();
  if (!uid) return;
  
  try {
    const stats = await getUserStats();
    const day = new Date().getDay();
    const adjustedDay = day === 0 ? 6 : day - 1;
    const weekly = [...(stats.weeklyActivity || [0, 0, 0, 0, 0, 0, 0])];
    weekly[adjustedDay] = (weekly[adjustedDay] || 0) + 1;
    await set(userRef('stats/weeklyActivity'), weekly);
  } catch (e) {
    console.error('Failed to update weekly activity:', e);
  }
}
