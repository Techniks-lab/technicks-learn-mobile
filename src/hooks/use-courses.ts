import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  coursesApi,
  type CourseCatalogResponse,
  type CourseDetail,
  type MyCoursesResponse,
  type EnrollResponse,
  type CourseCheckInResponse,
  type UnenrollResponse,
  type CategoriesListResponse,
} from '@/lib/courses-api';

const CATALOG_KEY = ['courses', 'catalog'] as const;
const MINE_KEY = ['courses', 'mine'] as const;
const DETAIL_KEY = ['courses', 'detail'] as const;
const CATEGORIES_KEY = ['courses', 'categories'] as const;
const GAMIFICATION_ME_KEY = ['gamification', 'me'] as const;
const LEADERBOARD_KEY = ['gamification', 'leaderboard'] as const;

export function useCourseCategories() {
  return useQuery<CategoriesListResponse>({
    queryKey: CATEGORIES_KEY,
    queryFn: () => coursesApi.getCategories(),
    staleTime: 60_000,
  });
}

export function useCourseCatalog(params?: { search?: string; category?: string }) {
  return useQuery<CourseCatalogResponse>({
    queryKey: [...CATALOG_KEY, params?.search ?? '', params?.category ?? ''],
    queryFn: () => coursesApi.getCatalog(params),
    staleTime: 15_000,
  });
}

export function useMyCourses(enabled = true) {
  return useQuery<MyCoursesResponse>({
    queryKey: MINE_KEY,
    queryFn: () => coursesApi.getMine(),
    enabled,
    staleTime: 15_000,
  });
}

export function useCourseDetail(slug: string, enabled = true) {
  return useQuery<CourseDetail>({
    queryKey: [...DETAIL_KEY, slug],
    queryFn: () => coursesApi.getBySlug(slug),
    enabled,
    staleTime: 15_000,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation<EnrollResponse, Error, string>({
    mutationFn: (slug) => coursesApi.enroll(slug),
    onSettled: (_data, _err, slug) => {
      void queryClient.invalidateQueries({ queryKey: CATALOG_KEY });
      void queryClient.invalidateQueries({ queryKey: MINE_KEY });
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_KEY, slug] });
      void queryClient.invalidateQueries({ queryKey: GAMIFICATION_ME_KEY });
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY });
    },
  });
}

export function useUnenroll() {
  const queryClient = useQueryClient();

  return useMutation<UnenrollResponse, Error, string>({
    mutationFn: (slug) => coursesApi.unenroll(slug),
    onSettled: (_data, _err, slug) => {
      void queryClient.invalidateQueries({ queryKey: CATALOG_KEY });
      void queryClient.invalidateQueries({ queryKey: MINE_KEY });
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_KEY, slug] });
      void queryClient.invalidateQueries({ queryKey: GAMIFICATION_ME_KEY });
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY });
    },
  });
}

export function useCourseCheckIn() {
  const queryClient = useQueryClient();

  return useMutation<CourseCheckInResponse, Error, string>({
    mutationFn: (slug) => coursesApi.checkIn(slug),
    onSettled: (_data, _err, slug) => {
      void queryClient.invalidateQueries({ queryKey: CATALOG_KEY });
      void queryClient.invalidateQueries({ queryKey: MINE_KEY });
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_KEY, slug] });
      void queryClient.invalidateQueries({ queryKey: GAMIFICATION_ME_KEY });
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY });
    },
  });
}