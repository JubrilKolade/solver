/**
 * Curriculum & Spaced Repetition System
 * Structured learning paths and adaptive scheduling
 */

export interface Problem {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown
  problems: Problem[];
  prerequisites: string[];
  estimatedTime: number; // minutes
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  estimatedTime: number; // hours
  icon: string;
}

export interface StudySession {
  problemId: string;
  correct: boolean;
  timestamp: number;
  timeTaken: number; // milliseconds
}

export interface SpacedRepetitionCard {
  problemId: string;
  interval: number; // days
  lastReview: number; // timestamp
  nextReview: number; // timestamp
  ease: number; // 1.3 - 2.5
  repetitions: number;
}

/**
 * Predefined curricula
 */
export const CURRICULA: Course[] = [
  {
    id: 'algebra-fundamentals',
    title: 'Algebra Fundamentals',
    description: 'Master the basics of algebraic equations and expressions',
    level: 'beginner',
    icon: '🔤',
    lessons: [
      {
        id: 'intro-to-algebra',
        title: 'Introduction to Algebra',
        description: 'Learn the fundamentals of algebraic notation and operations',
        content: '# Algebra Basics\n\nAlgebra uses variables to represent unknown numbers...',
        problems: [],
        prerequisites: [],
        estimatedTime: 30,
      },
      {
        id: 'linear-equations',
        title: 'Solving Linear Equations',
        description: 'Learn to solve equations with one variable',
        content: '# Linear Equations\n\nA linear equation is an equation of the form ax + b = c...',
        problems: [],
        prerequisites: ['intro-to-algebra'],
        estimatedTime: 45,
      },
    ],
    estimatedTime: 8,
  },
  {
    id: 'calculus-essentials',
    title: 'Calculus Essentials',
    description: 'Introduction to derivatives and integrals',
    level: 'advanced',
    icon: '∫',
    lessons: [],
    estimatedTime: 20,
  },
];

/**
 * SM-2 Algorithm for spaced repetition
 * Optimal review intervals
 */
export function calculateNextReview(card: SpacedRepetitionCard, isCorrect: boolean) {
  let ease = card.ease;
  let interval = card.interval;
  let repetitions = card.repetitions;

  // Adjust ease factor based on answer quality (0-5)
  const quality = isCorrect ? 5 : 0;
  ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (quality < 3) {
    // Incorrect - reset
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * ease);
    }
  }

  const now = Date.now();
  const nextReview = now + interval * 24 * 60 * 60 * 1000; // Convert days to ms

  return {
    ease,
    interval,
    repetitions,
    lastReview: now,
    nextReview,
  };
}

/**
 * Create new spaced repetition card
 */
export function createNewCard(problemId: string): SpacedRepetitionCard {
  const now = Date.now();
  return {
    problemId,
    interval: 1,
    lastReview: now,
    nextReview: now + 24 * 60 * 60 * 1000, // Tomorrow
    ease: 2.5, // Default ease
    repetitions: 0,
  };
}

/**
 * Get problems due for review
 */
export function getProblemsDue(cards: SpacedRepetitionCard[]): string[] {
  const now = Date.now();
  return cards
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview)
    .map((card) => card.problemId);
}

/**
 * Get study stats
 */
export function getStudyStats(sessions: StudySession[]): {
  totalSessions: number;
  accuracy: number;
  averageTime: number;
  recentStreak: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recentSessions = sessions.filter((s) => s.timestamp >= today.getTime());
  const totalCorrect = recentSessions.filter((s) => s.correct).length;
  const totalSessions = recentSessions.length;

  let recentStreak = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const daySessions = sessions.filter(
      (s) => new Date(s.timestamp).toDateString() === checkDate.toDateString()
    );

    if (daySessions.length === 0) break;
    recentStreak++;
  }

  return {
    totalSessions,
    accuracy: totalSessions > 0 ? totalCorrect / totalSessions : 0,
    averageTime: totalSessions > 0 ? recentSessions.reduce((sum, s) => sum + s.timeTaken, 0) / totalSessions : 0,
    recentStreak,
  };
}

/**
 * Get weak topics from study history
 */
export function getWeakTopics(sessions: StudySession[], problems: Problem[]): string[] {
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const session of sessions) {
    const problem = problems.find((p) => p.id === session.problemId);
    if (!problem) continue;

    if (!topicStats[problem.category]) {
      topicStats[problem.category] = { correct: 0, total: 0 };
    }

    topicStats[problem.category].total += 1;
    if (session.correct) {
      topicStats[problem.category].correct += 1;
    }
  }

  // Topics with < 70% accuracy
  return Object.entries(topicStats)
    .filter(([, stats]) => stats.correct / stats.total < 0.7)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .map(([topic]) => topic);
}

/**
 * Recommend next lesson
 */
export function recommendNextLesson(
  completedLessons: string[],
  course: Course
): Lesson | null {
  for (const lesson of course.lessons) {
    // Check if all prerequisites are met
    const preqsMet = lesson.prerequisites.every((preq) => completedLessons.includes(preq));

    // Check if not yet completed
    const notCompleted = !completedLessons.includes(lesson.id);

    if (preqsMet && notCompleted) {
      return lesson;
    }
  }

  return null;
}

/**
 * Calculate course progress
 */
export function calculateCourseProgress(
  course: Course,
  completedLessons: string[]
): number {
  if (course.lessons.length === 0) return 0;
  return (completedLessons.filter((id) => course.lessons.some((l) => l.id === id)).length /
    course.lessons.length) *
    100;
}
