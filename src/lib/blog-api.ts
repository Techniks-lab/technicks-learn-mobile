import { blogCategoryController, blogController } from '@/config/sdk';

export interface BlogAuthor {
  id: string;
  name: string | null;
  username?: string | null;
  avatarUrl?: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: BlogPostStatus;
  createdAt: string;
  author: BlogAuthor;
  categories: BlogCategory[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  updatedAt: string;
}

export interface ManagePost extends BlogPostSummary {
  updatedAt: string;
  publishedAt?: string | null;
  readingTime?: number;
}

export interface MyPostsResponse {
  posts: ManagePost[];
}

export interface BlogFeedResponse {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogCommentAuthor {
  id: string;
  name: string | null;
  username?: string | null;
  avatarUrl?: string | null;
}

export interface BlogCommentReply {
  id: string;
  body: string;
  createdAt: string;
  author: BlogCommentAuthor;
}

export interface BlogComment {
  id: string;
  body: string;
  createdAt: string;
  author: BlogCommentAuthor;
  replies: BlogCommentReply[];
}

export interface BlogCommentsResponse {
  comments: BlogComment[];
  total: number;
  page: number;
  limit: number;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryIds?: string[];
}

// The generated blog SDK annotates every response as `void` because the
// OpenAPI spec omits response schemas, so we keep the typed contracts here
// and cast the actual payloads back onto them.
const cast = <T>(data: unknown) => data as T;

export const blogApi = {
  async getFeed(
    page = 1,
    limit = 20,
    category?: string,
    search?: string,
  ): Promise<BlogFeedResponse> {
    const { data } = await blogController.blogControllerFindAllV1(
      page,
      limit,
      category,
      search,
    );
    return cast<BlogFeedResponse>(data);
  },

  async getPost(slug: string): Promise<BlogPostDetail> {
    const { data } = await blogController.blogControllerFindBySlugV1(slug);
    return cast<BlogPostDetail>(data);
  },

  async getMyPosts(): Promise<MyPostsResponse> {
    const { data } = await blogController.blogControllerFindMineV1();
    return cast<MyPostsResponse>(data);
  },

  async createPost(input: CreatePostInput): Promise<BlogPostDetail> {
    const body = { ...input, coverImage: input.coverImage ?? undefined };
    const { data } = await blogController.blogControllerCreateV1(body);
    return cast<BlogPostDetail>(data);
  },

  async updatePost(
    id: string,
    input: Partial<CreatePostInput>,
  ): Promise<BlogPostDetail> {
    const body = { ...input, coverImage: input.coverImage ?? undefined };
    const { data } = await blogController.blogControllerUpdateV1(id, body);
    return cast<BlogPostDetail>(data);
  },

  async deletePost(id: string): Promise<void> {
    await blogController.blogControllerRemoveV1(id);
  },

  async toggleLike(postId: string): Promise<ToggleLikeResponse> {
    const { data } = await blogController.blogControllerToggleLikeV1(postId);
    return cast<ToggleLikeResponse>(data);
  },

  async getComments(
    postId: string,
    page = 1,
    limit = 50,
  ): Promise<BlogCommentsResponse> {
    const { data } = await blogController.blogControllerGetCommentsV1(
      postId,
      page,
      limit,
    );
    return cast<BlogCommentsResponse>(data);
  },

  async createComment(
    postId: string,
    body: string,
    parentId?: string,
  ): Promise<{ id: string; body: string; createdAt: string }> {
    const { data } = await blogController.blogControllerCreateCommentV1(
      postId,
      { body, parentId },
    );
    return cast<{ id: string; body: string; createdAt: string }>(data);
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await blogController.blogControllerRemoveCommentV1(postId, commentId);
  },

  async getCategories(): Promise<BlogCategory[]> {
    const { data } =
      await blogCategoryController.categoryControllerFindAllV1();
    return cast<BlogCategory[]>(data);
  },
};
