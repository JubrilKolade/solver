/**
 * Achievement & Gamification System
 * Track user achievements, badges, and progress
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockCondition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  totalXP: number;
  topicStats: Record<string, { solved: number; correct: number }>;
  weeklyActivity: number[];
  badges: string[];
  level: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalXP: number;
  totalSolved: number;
  currentStreak: number;
  avatar?: string;
  rank?: number;
}

/**
 * Calculate XP from solving a problem
 */
export function calculateXP(
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  isCorrect: boolean = true
): number {
  const baseXP = {
    easy: 10,
    medium: 25,
    hard: 50,
  };

  const xp = baseXP[difficulty];
  return isCorrect ? xp : Math.floor(xp * 0.5);
}

/**
 * Calculate user level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 500 - currentXP;
}

/**
 * Predefined achievements
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_solve',
    name: 'First Step',
    description: 'Solve your first problem',
    icon: '🎯',
    points: 10,
    rarity: 'common',
    unlockCondition: (stats) => stats.totalSolved >= 1,
  },
  {
    id: 'ten_solver',
    name: 'Problem Solver',
    description: 'Solve 10 problems',
    icon: '🔟',
    points: 25,
    rarity: 'common',
    unlockCondition: (stats) => stats.totalSolved >= 10,
  },
  {
    id: 'hundred_solver',
    name: 'Math Master',
    description: 'Solve 100 problems',
    icon: '💯',
    points: 100,
    rarity: 'uncommon',
    unlockCondition: (stats) => stats.totalSolved >= 100,
  },
  {
    id: 'thousand_solver',
    name: 'Legendary Solver',
    description: 'Solve 1000 problems',
    icon: '👑',
    points: 500,
    rarity: 'legendary',
    unlockCondition: (stats) => stats.totalSolved >= 1000,
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Solve 10 problems correctly in one day',
    icon: '✨',
    points: 50,
    rarity: 'uncommon',
    unlockCondition: (stats) => stats.weeklyActivity.some((d) => d >= 10),
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Solve at least one problem every day for a week',
    icon: '⚔️',
    points: 75,
    rarity: 'uncommon',
    unlockCondition: (stats) => stats.weeklyActivity.every((d) => d > 0),
  },
  {
    id: 'streak_five',
    name: '5-Day Streak',
    description: 'Maintain a 5-day solving streak',
    icon: '🔥',
    points: 25,
    rarity: 'common',
    unlockCondition: (stats) => stats.currentStreak >= 5,
  },
  {
    id: 'streak_thirty',
    name: '30-Day Streak',
    description: 'Maintain a 30-day solving streak',
    icon: '🌟',
    points: 250,
    rarity: 'epic',
    unlockCondition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'topic_master_algebra',
    name: 'Algebra Master',
    description: 'Solve 50 algebra problems',
    icon: '🔤',
    points: 100,
    rarity: 'rare',
    unlockCondition: (stats) => (stats.topicStats.algebra?.solved ?? 0) >= 50,
  },
  {
    id: 'topic_master_calculus',
    name: 'Calculus Champion',
    description: 'Solve 30 calculus problems',
    icon: '∫',
    points: 150,
    rarity: 'rare',
    unlockCondition: (stats) => (stats.topicStats.calculus?.solved ?? 0) >= 30,
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Solve 5 problems in under 1 minute each',
    icon: '⚡',
    points: 75,
    rarity: 'uncommon',
    unlockCondition: () => true, // Would need time tracking in actual implementation
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Get a problem correct after 3 wrong attempts',
    icon: '💪',
    points: 40,
    rarity: 'uncommon',
    unlockCondition: () => true, // Would need attempt tracking
  },
];

/**
 * Get unlocked achievements for user
 */
export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => {
    const isUnlocked = stats.badges.includes(achievement.id);
    const shouldUnlock = achievement.unlockCondition(stats);
    return isUnlocked || shouldUnlock;
  });
}

/**
 * Get new achievements unlocked
 */
export function getNewAchievements(
  oldStats: UserStats,
  newStats: UserStats
): Achievement[] {
  const oldUnlocked = getUnlockedAchievements(oldStats);
  const newUnlocked = getUnlockedAchievements(newStats);
  
  return newUnlocked.filter(
    (achievement) => !oldUnlocked.find((a) => a.id === achievement.id)
  );
}

/**
 * Sort leaderboard entries
 */
export function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
    .sort((a, b) => {
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      return b.currentStreak - a.currentStreak;
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/**
 * Get user rank on leaderboard
 */
export function getUserRank(
  userId: string,
  leaderboard: LeaderboardEntry[]
): number | null {
  const sorted = sortLeaderboard(leaderboard);
  return sorted.find((entry) => entry.userId === userId)?.rank ?? null;
}

/**
 * Get rarity color style
 */
export function getRarityColor(rarity: Achievement['rarity']): string {
  const colors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  };
  return colors[rarity];
}

/**
 * Get rarity background
 */
export function getRarityBg(rarity: Achievement['rarity']): string {
  const backgrounds = {
    common: 'bg-gray-500/20',
    uncommon: 'bg-green-500/20',
    rare: 'bg-blue-500/20',
    epic: 'bg-purple-500/20',
    legendary: 'bg-yellow-500/20',
  };
  return backgrounds[rarity];
}
