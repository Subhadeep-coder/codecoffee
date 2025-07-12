export type Contest = {
  title: string;
  description: string;
  type: ContestType;
  startTime: string;
  endTime: string;
  duration: string;
  maxParticipants: string;
  isRated: boolean;
  penalty: string;
  problemIds: string[];
};

export type ContestType = "PUBLIC" | "PRIVATE" | "COMPANY";
