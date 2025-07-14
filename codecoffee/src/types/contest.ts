export interface Contest {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  type: "PUBLIC" | "PRIVATE";
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  isRated: boolean;
  penalty: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string | null;
    avatar: string;
  };
  _count: {
    participations: number;
    problems: number;
  };
}

export type CreateContestDto = {
  title: string;
  description: string;
  type: ContestType;
  startTime: string;
  endTime?: string;
  duration: string;
  maxParticipants: string;
  isRated: boolean;
  penalty: string;
  problemIds: string[];
};

export type ContestType = "PUBLIC" | "PRIVATE" | "COMPANY";
