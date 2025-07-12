export interface ContestSubmissionDto {
  problemId: string;
  code: string;
  language: string;
}

export interface ContestRankingItem {
  userId: string;
  username: string;
  firstName: string;
  lastName?: string | null;
  avatar?: string | null;
  score: number;
  penalty: number;
  rank: number;
  ratingChange: number;
  submissions: {
    problemId: string;
    attempts: number;
    solved: boolean;
    penalty: number;
    solvedAt?: Date;
  }[];
}
