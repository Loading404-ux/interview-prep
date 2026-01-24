type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: any
  token?: string | null
  isMultipart?: boolean
}

type Difficulty = "Easy" | "Medium" | "Hard";
// interface Problem {
//   id: number;
//   title: string;
//   difficulty: Difficulty;
//   topics: string[];
//   company: string;
//   acceptance: number;
//   solved: boolean;
// }
interface CodingProblem {
  id: string
  title: string
  difficulty: Difficulty
  topics: string[]
  company?: string
}
interface CodingProblemDetail {
  id: string
  title: string
  problem: string
  hint: string
  examples: { input: any; output: any }[]
  constraints: {
    time_complexity: string
    space_complexity: string
  }
  topics: string[]
}

interface CodingSolution {
  id: string
  solution: string
  explanation?: string
  upvotes: number
  createdAt: string
}


interface Discussion {
  id: string
  questionId: string
  content: string
  upvotes: number
  replyCount: number
  createdAt: string
}

interface Reply {
  id: string
  content: string
  upvotes: number
  createdAt: string
}

interface DashboardProfile {
  id: string
  name: string
  email: string
  university?: string
  avatar?: string
  targetCompanies: string[]
  memberSince: string
}

interface CodingProgress {
  totalSubmissions: number
  acceptedSubmissions: number
  accuracy: number
}

interface HrProgress {
  totalSessions: number
  avgConfidence: number
}

interface AptitudeProgress {
  totalAttempts: number
  accuracy: number
}

interface StreakProgress {
  current: number
  longest: number
}

interface DashboardProgress {
  coding: CodingProgress
  hr: HrProgress
  aptitude: AptitudeProgress
  streak: StreakProgress
}

interface Contribution {
  date: string
  contributionCount: number
}

interface Achievement {
  key: string
  unlockedAt: string
}

interface DashboardResponse {
  profile: DashboardProfile
  progress: DashboardProgress
  streak: StreakProgress
  contributions: Contribution[]
  achievements: Achievement[]
}


interface HrQuestion {
  id: string
  question: string
  preferred_answer?: string
}

interface HrSession {
  sessionId: string
  questions: HrQuestion[]
}

interface HrFeedback {
  clarity: number
  structure: number
  confidence: number
  improvementTips: string[]
  generatedPreferredAnswer: string
}


interface AptitudeQuestion {
  id: string
  text: string
  options: string[]
}

interface AptitudeSession {
  sessionId: string
  questions: AptitudeQuestion[]
}

interface AptitudeAnswerResult {
  correct: boolean
  correctAnswer: number
  explanation?: string
}

// types/activity.ts
type ActivityType = "coding" | "hr" | "aptitude";

interface ActivityDTO {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string; // ISO string from backend
  result?: string;
}
 interface UserProfile {
  id: string
  name: string
  email: string
  college?: string
  targetCompanies: string[]
  joinedAt: string
}

 interface UserMetrics {
  coding: { solved: number; total: number }
  hr: { completed: number; total: number }
  aptitude: { completed: number; total: number }
}

 interface ContributionDay {
  date: string
  count: number
}