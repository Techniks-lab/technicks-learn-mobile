import { useQuery } from '@tanstack/react-query';
import {
  gamificationApi,
  type GamificationMe,
  type LeaderboardResponse,
} from '@/lib/gamification-api';

const GAMIFICATION_ME_KEY = ['gamification', 'me'] as const;
const LEADERBOARD_KEY = ['gamification', 'leaderboard'] as const;

export { GAMIFICATION_ME_KEY, LEADERBOARD_KEY };

export function useGamificationMe(enabled = true) {
  return useQuery<GamificationMe>({
    queryKey: GAMIFICATION_ME_KEY,
    queryFn: () => gamificationApi.getMe(),
    enabled,
    staleTime: 5_000,
  });
}

export function useLeaderboard(enabled = true, refetchInterval = 30_000) {
  return useQuery<LeaderboardResponse>({
    queryKey: LEADERBOARD_KEY,
    queryFn: () => gamificationApi.getLeaderboard(),
    enabled,
    refetchInterval,
    staleTime: 10_000,
  });
}