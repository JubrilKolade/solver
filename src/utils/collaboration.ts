/**
 * Collaboration & Real-time Features
 * Enable multiplayer solving, shared sessions, and real-time updates
 */

export interface CollaborativeSession {
  id: string;
  createdBy: string;
  participants: string[];
  problem: string;
  solutions: Record<string, string>; // userId -> solution
  sharedNotes: string;
  createdAt: number;
  expiresAt: number;
}

export interface RealtimeUpdate {
  type: 'solution_update' | 'note_update' | 'user_joined' | 'user_left';
  userId: string;
  timestamp: number;
  data: any;
}

export interface TeachingSession {
  id: string;
  tutorId: string;
  studentId: string;
  topic: string;
  currentProblem?: string;
  chat: Array<{
    userId: string;
    message: string;
    timestamp: number;
  }>;
  status: 'active' | 'paused' | 'ended';
}

/**
 * Create collaborative session
 */
export function createCollaborativeSession(
  creatorId: string,
  problem: string,
  durationMinutes: number = 60
): CollaborativeSession {
  const now = Date.now();
  return {
    id: generateSessionId(),
    createdBy: creatorId,
    participants: [creatorId],
    problem,
    solutions: {},
    sharedNotes: '',
    createdAt: now,
    expiresAt: now + durationMinutes * 60 * 1000,
  };
}

/**
 * Share solution with collaborators
 */
export function updateSessionSolution(
  session: CollaborativeSession,
  userId: string,
  solution: string
): CollaborativeSession {
  return {
    ...session,
    solutions: {
      ...session.solutions,
      [userId]: solution,
    },
  };
}

/**
 * Compare solutions from different users
 */
export function compareSolutions(
  solutions: Record<string, string>
): {
  userId: string;
  solution: string;
  uniqueMethods: number;
}[] {
  return Object.entries(solutions).map(([userId, solution]) => ({
    userId,
    solution,
    uniqueMethods: solution.split('\n').filter((line) => line.trim()).length,
  }));
}

/**
 * Merge solutions into collaborative notes
 */
export function mergeIntoNotes(
  currentNotes: string,
  newContent: string,
  contributor: string
): string {
  const timestamp = new Date().toLocaleTimeString();
  const contribution = `\n\n--- Added by ${contributor} at ${timestamp} ---\n${newContent}`;
  return currentNotes + contribution;
}

/**
 * Create teaching session
 */
export function createTeachingSession(
  tutorId: string,
  studentId: string,
  topic: string
): TeachingSession {
  return {
    id: generateSessionId(),
    tutorId,
    studentId,
    topic,
    chat: [],
    status: 'active',
  };
}

/**
 * Add message to teaching session chat
 */
export function addChatMessage(
  session: TeachingSession,
  userId: string,
  message: string
): TeachingSession {
  return {
    ...session,
    chat: [
      ...session.chat,
      {
        userId,
        message,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Generate shareable session link
 */
export function generateShareLink(sessionId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mathsolver.com';
  return `${baseUrl}/session/${sessionId}`;
}

/**
 * Check session validity
 */
export function isSessionValid(session: CollaborativeSession | TeachingSession): boolean {
  if ('expiresAt' in session) {
    return session.expiresAt > Date.now();
  }
  // Teaching sessions don't expire unless ended
  return (session as TeachingSession).status !== 'ended';
}

/**
 * Get session stats
 */
export function getSessionStats(session: CollaborativeSession): {
  totalParticipants: number;
  solutionCount: number;
  averageSolutionLength: number;
  uniqueApproaches: number;
} {
  const solutions = Object.values(session.solutions);
  return {
    totalParticipants: session.participants.length,
    solutionCount: solutions.length,
    averageSolutionLength: solutions.length > 0 ?
      solutions.reduce((sum, s) => sum + s.length, 0) / solutions.length :
      0,
    uniqueApproaches: new Set(solutions).size,
  };
}

/**
 * Detect plagiarism/similarity in solutions
 */
export function detectSimilarSolutions(
  solutions: Record<string, string>,
  threshold: number = 0.8
): Array<[string, string]> {
  const similarPairs: Array<[string, string]> = [];
  const entries = Object.entries(solutions);

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const similarity = calculateSimilarity(entries[i][1], entries[j][1]);
      if (similarity >= threshold) {
        similarPairs.push([entries[i][0], entries[j][0]]);
      }
    }
  }

  return similarPairs;
}

/**
 * Calculate string similarity (Jaccard index)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split(/\s+/));
  const set2 = new Set(str2.split(/\s+/));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Create collaborative problem set
 */
export interface CollaborativeProblemSet {
  id: string;
  title: string;
  creator: string;
  problems: Array<{
    id: string;
    question: string;
    hints: string[];
    solutions: Record<string, string>; // userId -> solution
  }>;
  participants: Array<{
    userId: string;
    role: 'owner' | 'contributor' | 'viewer';
  }>;
  createdAt: number;
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
