import { learnController } from '@/config/sdk';

export type LessonBlockKind = 'HEADING' | 'TEXT' | 'IMAGE' | 'VIDEO';

export interface LessonBlock {
  id: string;
  blockIndex: number;
  kind: LessonBlockKind;
  text?: string | null;
  url?: string | null;
  caption?: string | null;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  blockCount: number;
  isCompleted: boolean;
}

export interface LessonDetail extends LessonSummary {
  status: 'DRAFT' | 'PUBLISHED';
  blocks: LessonBlock[];
}

export interface CompleteLessonResponse {
  completed: boolean;
  xpAwarded: number;
  xp: number;
}

export interface LessonsResponse {
  lessons: LessonSummary[];
}

const cast = <T>(data: unknown) => data as T;

export const learnApi = {
  async getLessons(): Promise<LessonsResponse> {
    const { data } = await learnController.learnControllerFindAllV1();
    return cast<LessonsResponse>(data);
  },

  async getLesson(slug: string): Promise<LessonDetail> {
    const { data } = await learnController.learnControllerFindBySlugV1(slug);
    return cast<LessonDetail>(data);
  },

  async completeLesson(slug: string): Promise<CompleteLessonResponse> {
    const { data } = await learnController.learnControllerCompleteV1(slug);
    return cast<CompleteLessonResponse>(data);
  },
};