export type UserAccountType = 'Individual' | 'Organization Member';
export type UserStatus = 'Active' | 'Suspended' | 'Pending' | 'Deactivated';
export type OrganizationStatus = 'Active' | 'Suspended' | 'Trial' | 'Pending Renewal';
export type CareerStatus = 'Active' | 'Draft' | 'Archived';
export type ClassStatus = 'Published' | 'Draft' | 'Archived';
export type SimulationStatus = 'Published' | 'Draft' | 'Archived';
export type SkillDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  accountType: UserAccountType;
  organizationId?: string;
  organizationName?: string;
  careerId: string;
  careerName: string;
  progressPercentage: number;
  completedClassesCount: number;
  completedSimulationsCount: number;
  status: UserStatus;
  joinedAt: string;
  lastActiveAt: string;
  notes?: string;
}

export interface OrganizationParticipant {
  id: string;
  name: string;
  email: string;
  career: string;
  progress: number;
  status: UserStatus;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  adminName: string;
  adminEmail: string;
  totalParticipants: number;
  activeParticipants: number;
  totalSeats: number;
  allocatedSeats: number;
  activityScore: number; // 0 - 100
  status: OrganizationStatus;
  subscriptionTier: 'Enterprise Pro' | 'Growth' | 'Pilot Team' | 'Standard';
  renewalDate: string;
  createdAt: string;
  completedSimulations: number;
  completedClasses: number;
  industry?: string;
}

export interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  status: CareerStatus;
  iconName: string;
  relatedClassIds: string[];
  relatedSimulationIds: string[];
  enrolledUsersCount: number;
  avgCompletionDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  durationMinutes: number;
  summary: string;
  content: string;
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ClassModule {
  id: string;
  title: string;
  careerId: string;
  careerName: string;
  description: string;
  level: SkillDifficulty;
  estimatedHours: number;
  status: ClassStatus;
  enrolledCount: number;
  completedCount: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluatedSkill {
  id: string;
  name: string;
  criteria: string;
  weight: number; // e.g. 20 for 20%
}

export interface AISimulation {
  id: string;
  title: string;
  description: string;
  careerId: string;
  careerName: string;
  difficulty: SkillDifficulty;
  status: SimulationStatus;
  
  // AI Character
  character: {
    name: string;
    role: string;
    avatar: string;
    initialMessage: string;
    tone: string;
  };

  // Scenario
  scenario: {
    situation: string;
    objective: string;
    expectedBehavior: string;
  };

  // Evaluation
  evaluatedSkills: EvaluatedSkill[];

  // Metrics
  completionsCount: number;
  avgScore: number; // 0 - 100
  avgDurationMinutes: number;
  updatedAt: string;
}

export interface RubricEvaluationItem {
  criteria: string;
  score: number;
  maxScore: number;
  weightPercentage: number;
  feedback: string;
}

export interface SimulationDialogueTurn {
  speaker: 'ai' | 'user';
  name: string;
  message: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'satisfied';
}

export interface SimulationRun {
  id: string;
  simulationId: string;
  simulationTitle: string;
  careerId: string;
  careerName: string;
  difficulty: SkillDifficulty;
  
  // Learner info
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  accountType?: string;
  organizationId?: string;
  organizationName?: string;

  // Performance
  score: number;
  grade: 'Distinction' | 'Pass' | 'Needs Retake';
  durationMinutes: number;
  completedAt: string;

  // AI Feedback details
  aiFeedback: {
    overallSummary: string;
    strengths: string[];
    improvementAreas: string[];
    coachRecommendation: string;
    rubricBreakdown: RubricEvaluationItem[];
    dialogueHighlights?: SimulationDialogueTurn[];
  };
}

export interface ActivityLog {
  id: string;
  type: 'user_registration' | 'new_organization' | 'simulation_completed' | 'class_completed' | 'career_updated' | 'security_alert';
  title: string;
  description: string;
  timestamp: string;
  meta?: {
    userId?: string;
    userName?: string;
    orgId?: string;
    orgName?: string;
    careerName?: string;
    itemTitle?: string;
    score?: number;
  };
}

export interface PlatformOverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  totalSimulations: number;
  simulationsCompletedCount: number;
  classesCompletedCount: number;
  totalClasses: number;
  avgSimulationScore: number;
  userGrowthPercentage: number;
  simulationGrowthPercentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  users: number;
  simulations: number;
  classes: number;
}

export interface SkillScoreDistribution {
  skill: string;
  avgScore: number;
  attemptsCount: number;
}
