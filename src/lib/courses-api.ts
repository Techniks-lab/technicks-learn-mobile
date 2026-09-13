import { coursesController } from '@/config/sdk';

export type CourseStatus = 'DRAFT' | 'PUBLISHED';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  courseCount?: number;
}

export interface CourseEnrollment {
  id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  completedLessonCount?: number;
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  status: CourseStatus;
  sortOrder: number;
  publishedAt: string | null;
  category: CourseCategory | null;
  lessonCount: number;
  completedLessonCount: number;
  isEnrolled: boolean;
  enrollment: CourseEnrollment | null;
}

export interface CourseCatalogResponse {
  courses: CourseSummary[];
}

export interface MyCoursesResponse {
  courses: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    sortOrder: number;
    publishedAt: string | null;
    category: CourseCategory | null;
    enrollment: CourseEnrollment;
  }[];
}

export interface CourseLesson {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isCompleted: boolean;
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  status: CourseStatus;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: CourseCategory | null;
  enrollment: CourseEnrollment | null;
  lessons: CourseLesson[];
}

export interface EnrollResponse {
  enrolled: boolean;
  alreadyEnrolled: boolean;
  enrollment: {
    id: string;
    status: string;
    enrolledAt: string;
    currentStreak: number;
    longestStreak: number;
  };
  course: { id: string; slug: string; title: string };
}

export interface CourseCheckInResponse {
  checkedInToday: boolean;
  streak: number;
  longestStreak: number;
  xpAwarded: number;
  xp: number;
}

export interface UnenrollResponse {
  unenrolled: boolean;
  course: { id: string; slug: string };
}

export interface CategoriesListResponse {
  categories: CourseCategory[];
}

const cast = <T>(data: unknown) => data as T;

export const coursesApi = {
  async getCatalog(params?: {
    search?: string;
    category?: string;
  }): Promise<CourseCatalogResponse> {
    const { data } = await coursesController.coursesControllerFindAllV1(
      params?.search,
      params?.category,
    );
    return cast<CourseCatalogResponse>(data);
  },

  async getMine(): Promise<MyCoursesResponse> {
    const { data } = await coursesController.coursesControllerFindMineV1();
    return cast<MyCoursesResponse>(data);
  },

  async getBySlug(slug: string): Promise<CourseDetail> {
    const { data } = await coursesController.coursesControllerFindBySlugV1(slug);
    return cast<CourseDetail>(data);
  },

  async enroll(slug: string): Promise<EnrollResponse> {
    const { data } = await coursesController.coursesControllerEnrollV1(slug);
    return cast<EnrollResponse>(data);
  },

  async checkIn(slug: string, date?: string): Promise<CourseCheckInResponse> {
    const { data } = await coursesController.coursesControllerCheckInV1(slug, {
      date,
    });
    return cast<CourseCheckInResponse>(data);
  },

  async unenroll(slug: string): Promise<UnenrollResponse> {
    const { data } =
      await coursesController.coursesControllerUnenrollV1(slug);
    return cast<UnenrollResponse>(data);
  },

  async getCategories(): Promise<CategoriesListResponse> {
    const { data } =
      await coursesController.coursesControllerListCategoriesV1();
    return cast<CategoriesListResponse>(data);
  },
};
