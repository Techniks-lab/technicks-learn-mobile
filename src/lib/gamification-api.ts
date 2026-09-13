import { gamificationController } from '@/config/sdk';

export type CompetitionTier = 'GOLD' | 'SILVER' | 'BRONZE';

export interface GamificationMe {
  xp: number;
}

export interface LeaderboardUser {
  id: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  xp: number;
}

export interface LeaderboardEntry {
  rank: number;
  points: number;
  tier: CompetitionTier;
  user: LeaderboardUser;
}

export interface LeaderboardMe {
  rank: number;
  tier: CompetitionTier;
  points: number;
  userId: string;
}

export interface LeaderboardResponse {
  competition: { startsAt: string; endsAt: string };
  entries: LeaderboardEntry[];
  me: LeaderboardMe | null;
  total: number;
}

const cast = <T>(data: unknown) => data as T;

export const gamificationApi = {
  async getMe(): Promise<GamificationMe> {
    const { data } = await gamificationController.gamificationControllerGetMeV1();
    return cast<GamificationMe>(data);
  },

  async getLeaderboard(limit = 50, offset = 0): Promise<LeaderboardResponse> {
    const { data } =
      await gamificationController.gamificationControllerLeaderboardV1(
        limit,
        offset,
      );
    return cast<LeaderboardResponse>(data);
  },
};