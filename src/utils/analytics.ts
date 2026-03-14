/**
 * Analytics & Insights System
 * Track and analyze user learning patterns
 */

export interface AnalyticsEvent {
  type: 'problem_solved' | 'problem_failed' | 'session_started' | 'session_ended';
  timestamp: number;
  metadata: Record<string, any>;
}

export interface LearningInsight {
  category: string;
  accuracy: number;
  totalAttempts: number;
  averageTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  trend: 'improving' | 'declining' | 'stable';
}

export interface UserAnalytics {
  totalTime: number; // milliseconds
  totalProblems: number;
  totalCorrect: number;
  averageAccuracy: number;
  categoryAnalytics: Record<string, LearningInsight>;
  weeklyTrends: Array<{ date: string; solved: number; correct: number }>;
  dailyActiveStreak: number;
}

/**
 * Track analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  // In production, send to analytics service (Firebase Analytics, Mixpanel, etc.)
  console.log('Analytics:', event);

  try {
    // Store locally first
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000
  } catch (e) {
    console.error('Failed to store analytics:', e);
  }
}

/**
 * Calculate learning insights from history
 */
export function calculateInsights(
  history: Array<{
    category: string;
    correct: boolean;
    timeTaken: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>
): Record<string, LearningInsight> {
  const categoryData: Record<string, {
    attempts: number;
    correct: number;
    totalTime: number;
    recentCorrect: number[];
    difficulty: 'easy' | 'medium' | 'hard';
  }> = {};

  for (const entry of history) {
    if (!categoryData[entry.category]) {
      categoryData[entry.category] = {
        attempts: 0,
        correct: 0,
        totalTime: 0,
        recentCorrect: [],
        difficulty: entry.difficulty || 'medium',
      };
    }

    const data = categoryData[entry.category];
    data.attempts += 1;
    if (entry.correct) {
      data.correct += 1;
    }
    data.totalTime += entry.timeTaken;
    data.recentCorrect.push(entry.correct ? 1 : 0);

    // Keep only last 20
    if (data.recentCorrect.length > 20) {
      data.recentCorrect.shift();
    }
  }

  const insights: Record<string, LearningInsight> = {};

  for (const [category, data] of Object.entries(categoryData)) {
    const accuracy = data.correct / data.attempts;

    // Calculate trend
    const recentAccuracy = data.recentCorrect.reduce((a, b) => a + b) / data.recentCorrect.length;
    const oldAccuracy = data.correct / data.attempts - recentAccuracy;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAccuracy > oldAccuracy + 0.1) trend = 'improving';
    if (recentAccuracy < oldAccuracy - 0.1) trend = 'declining';

    insights[category] = {
      category,
      accuracy,
      totalAttempts: data.attempts,
      averageTime: data.totalTime / data.attempts,
      difficulty: data.difficulty,
      trend,
    };
  }

  return insights;
}

/**
 * Get weekly trends
 */
export function getWeeklyTrends(
  history: Array<{
    timestamp: number;
    correct: boolean;
  }>
): Array<{ date: string; solved: number; correct: number }> {
  const trends: Record<string, { solved: number; correct: number }> = {};

  for (const entry of history) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toISOString().split('T')[0];

    if (!trends[dateStr]) {
      trends[dateStr] = { solved: 0, correct: 0 };
    }

    trends[dateStr].solved += 1;
    if (entry.correct) {
      trends[dateStr].correct += 1;
    }
  }

  return Object.entries(trends)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Detect learning patterns
 */
export function detectPatterns(
  history: Array<{
    category: string;
    correct: boolean;
    timestamp: number;
    timeTaken: number;
  }>
): {
  timeOfDay: string; // Best performing time
  bestCategory: string;
  worstCategory: string;
  averageSessionLength: number;
} {
  // Find best time of day
  const timeStats: Record<number, { correct: number; total: number }> = {};
  for (const entry of history) {
    const hour = new Date(entry.timestamp).getHours();
    if (!timeStats[hour]) {
      timeStats[hour] = { correct: 0, total: 0 };
    }
    timeStats[hour].total += 1;
    if (entry.correct) timeStats[hour].correct += 1;
  }

  const bestHour = Object.entries(timeStats).sort(
    (a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total)
  )[0];

  // Category stats
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  for (const entry of history) {
    if (!categoryStats[entry.category]) {
      categoryStats[entry.category] = { correct: 0, total: 0 };
    }
    categoryStats[entry.category].total += 1;
    if (entry.correct) categoryStats[entry.category].correct += 1;
  }

  const categories = Object.entries(categoryStats)
    .map(([cat, stats]) => ({ cat, accuracy: stats.correct / stats.total }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // Session metrics
  const sessions: number[] = [];
  let sessionTime = 0;
  let lastTime = history[0]?.timestamp || 0;

  for (const entry of history) {
    const timeSinceLastEntry = entry.timestamp - lastTime;

    if (timeSinceLastEntry > 30 * 60 * 1000) {
      // 30 minutes gap = new session
      if (sessionTime > 0) sessions.push(sessionTime);
      sessionTime = entry.timeTaken;
    } else {
      sessionTime += entry.timeTaken;
    }

    lastTime = entry.timestamp;
  }

  const averageSessionLength = sessions.length > 0 ?
    sessions.reduce((a, b) => a + b) / sessions.length :
    0;

  return {
    timeOfDay: bestHour ? `${bestHour[0]}:00` : 'N/A',
    bestCategory: categories[0]?.cat || 'N/A',
    worstCategory: categories[categories.length - 1]?.cat || 'N/A',
    averageSessionLength,
  };
}

/**
 * Get personalized recommendations
 */
export function getRecommendations(
  insights: Record<string, LearningInsight>
): string[] {
  const recommendations: string[] = [];

  for (const [category, insight] of Object.entries(insights)) {
    if (insight.accuracy < 0.6) {
      recommendations.push(`You're struggling with ${category}. Try reviewing the basics.`);
    }

    if (insight.trend === 'declining') {
      recommendations.push(`Your performance in ${category} is declining. Take a break and review.`);
    }

    if (insight.averageTime > 120000) {
      // 2 minutes
      recommendations.push(`${category} problems are taking longer. Practice more for speed.`);
    }
  }

  return recommendations;
}
