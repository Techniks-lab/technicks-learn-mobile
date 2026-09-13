import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import {
  blogApi,
  BlogFeedResponse,
  BlogPostDetail,
  BlogPostSummary,
  BlogCommentsResponse,
  ToggleLikeResponse,
  CreatePostInput,
  MyPostsResponse,
} from '@/lib/blog-api';

const FEED_KEY = ['blog', 'feed'] as const;
const POST_KEY = ['blog', 'post'] as const;
const COMMENTS_KEY = ['blog', 'comments'] as const;
const CATEGORIES_KEY = ['blog', 'categories'] as const;
const MY_POSTS_KEY = ['blog', 'my-posts'] as const;

export function useBlogFeed(options?: {
  category?: string;
  search?: string;
  enabled?: boolean;
}) {
  return useInfiniteQuery<BlogFeedResponse>({
    queryKey: [...FEED_KEY, options?.category, options?.search],
    queryFn: ({ pageParam = 1 }) =>
      blogApi.getFeed(pageParam as number, 20, options?.category, options?.search),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: options?.enabled ?? true,
  });
}

export function useBlogPost(slug: string, enabled = true) {
  return useQuery<BlogPostDetail>({
    queryKey: [...POST_KEY, slug],
    queryFn: () => blogApi.getPost(slug),
    enabled,
  });
}

export function useBlogComments(postId: string, enabled = true) {
  return useQuery<BlogCommentsResponse>({
    queryKey: [...COMMENTS_KEY, postId],
    queryFn: () => blogApi.getComments(postId),
    enabled,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => blogApi.getCategories(),
    staleTime: 5 * 60_000,
  });
}

export function useMyPosts(enabled = true) {
  return useQuery<MyPostsResponse>({
    queryKey: MY_POSTS_KEY,
    queryFn: () => blogApi.getMyPosts(),
    enabled,
  });
}

interface ToggleLikeContext {
  previous: [QueryKey, unknown | undefined][];
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  const togglePostInFeed = (
    postId: string,
    mutate: (p: BlogPostSummary) => BlogPostSummary,
  ) => {
    queryClient.setQueriesData<InfiniteData<BlogFeedResponse>>(
      { queryKey: FEED_KEY },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId ? mutate(p) : p,
            ),
          })),
        };
      },
    );
  };

  return useMutation<ToggleLikeResponse, Error, string, ToggleLikeContext>({
    mutationFn: (postId) => blogApi.toggleLike(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: FEED_KEY });
      await queryClient.cancelQueries({ queryKey: POST_KEY });
      const previous = [
        ...queryClient.getQueriesData({ queryKey: FEED_KEY }),
        ...queryClient.getQueriesData({ queryKey: POST_KEY }),
      ];

      // Optimistic update on feed
      togglePostInFeed(postId, (p) => ({
        ...p,
        isLiked: !p.isLiked,
        likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
      }));

      // Optimistic update on post detail
      queryClient.setQueriesData<BlogPostDetail>(
        { queryKey: POST_KEY },
        (old) => {
          if (!old || old.id !== postId) return old;
          return {
            ...old,
            isLiked: !old.isLiked,
            likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
          };
        },
      );

      return { previous } satisfies ToggleLikeContext;
    },
    onSuccess: (_data, postId) => {
      // Authoritative: apply the server's actual toggle result to both caches
      togglePostInFeed(postId, (p) => ({
        ...p,
        isLiked: _data.liked,
        likeCount: _data.likeCount,
      }));
      queryClient.setQueriesData<BlogPostDetail>(
        { queryKey: POST_KEY },
        (old) => {
          if (!old || old.id !== postId) return old;
          return {
            ...old,
            isLiked: _data.liked,
            likeCount: _data.likeCount,
          };
        },
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({ queryKey: POST_KEY });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      body,
      parentId,
    }: {
      postId: string;
      body: string;
      parentId?: string;
    }) => blogApi.createComment(postId, body, parentId),
    onSettled: (_data, _err, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [...COMMENTS_KEY, variables.postId],
      });
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      blogApi.deleteComment(postId, commentId),
    onSettled: (_data, _err, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [...COMMENTS_KEY, variables.postId],
      });
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostDetail, Error, CreatePostInput>({
    mutationFn: (input) => blogApi.createPost(input),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<
    BlogPostDetail,
    Error,
    { id: string; input: Partial<CreatePostInput> }
  >({
    mutationFn: ({ id, input }) => blogApi.updatePost(id, input),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({ queryKey: POST_KEY });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => blogApi.deletePost(id),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
    },
  });
}
