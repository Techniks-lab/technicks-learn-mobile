import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  learnApi,
  type LessonsResponse,
  type LessonDetail,
  type CompleteLessonResponse,
} from '@/lib/learn-api';

const LESSONS_KEY = ['learn', 'lessons'] as const;
const LESSON_KEY = ['learn', 'lesson'] as const;
const GAMIFICATION_ME_KEY = ['gamification', 'me'] as const;
const LEADERBOARD_KEY = ['gamification', 'leaderboard'] as const;

export function useLessons(enabled = true) {
  return useQuery<LessonsResponse>({
    queryKey: LESSONS_KEY,
    queryFn: () => learnApi.getLessons(),
    enabled,
  });
}

export function useLesson(slug: string, enabled = true) {
  return useQuery<LessonDetail>({
    queryKey: [...LESSON_KEY, slug],
    queryFn: () => learnApi.getLesson(slug),
    enabled,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation<CompleteLessonResponse, Error, string>({
    mutationFn: (slug) => learnApi.completeLesson(slug),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: LESSONS_KEY });
      void queryClient.invalidateQueries({ queryKey: LESSON_KEY });
      void queryClient.invalidateQueries({ queryKey: GAMIFICATION_ME_KEY });
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY });
      void queryClient.invalidateQueries({ queryKey: ['courses', 'catalog'] });
      void queryClient.invalidateQueries({ queryKey: ['courses', 'mine'] });
      void queryClient.invalidateQueries({ queryKey: ['courses', 'detail'] });
    },
  });
}