export interface Account {
    provider: string;
    type: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string | null;
    avatar: string;
    bio: string | null;
    rating: number;
    points: number;
    streak: number;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    lastSolved: string | null;
    provider: string;
    providerId: string;
    accounts: Account[];
    solvedProblems?: number;
    rank?: number;
}

export interface DashboardStats {
    username: string;
    email: string;
    avatar: string;
    joinDate: string;
    rank: number;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptanceRate: number;
    maxStreak: number;
    currentStreak: number;
    contestRating: number;
    contestsParticipated: number;
    globalRanking: number;
}

export type StatsCardsStats = Pick<
    DashboardStats,
    | 'totalSolved'
    | 'easySolved'
    | 'mediumSolved'
    | 'hardSolved'
    | 'totalSubmissions'
    | 'acceptanceRate'
    | 'maxStreak'
    | 'currentStreak'>