import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlogCard } from '@/components/blog/blog-card';
import { BlogCardSkeleton } from '@/components/blog/blog-card-skeleton';
import { BlogCardData } from '@/components/blog/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/providers/toast-provider';
import {
  useBlogCategories,
  useBlogFeed,
  useToggleLike,
} from '@/hooks/use-blog';

export default function FeedScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toggleLike = useToggleLike();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useBlogCategories();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useBlogFeed({ category: selectedCategory ?? undefined });

  const posts = useMemo(() => {
    return data?.pages.flatMap((p) => p.posts) ?? [];
  }, [data]);

  const openPost = useCallback(
    (slug: string) =>
      router.push({ pathname: '/blog/[slug]', params: { slug } }),
    [router],
  );

  const promptSignUp = useCallback(() => {
    if (isAuthenticated) return;
    Alert.alert(
      'Sign up to interact',
      'Anyone can read the feed, but liking and commenting require an account.',
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign Up', onPress: () => router.push('/sign-up') },
      ],
    );
  }, [isAuthenticated, router]);

  const handleCreatePost = useCallback(() => {
    if (!isAuthenticated) {
      promptSignUp();
      return;
    }
    router.push('/manage/blogs/new');
  }, [isAuthenticated, promptSignUp, router]);

  const handleLike = useCallback(
    (postId: string) => {
      if (!isAuthenticated) {
        promptSignUp();
        return;
      }
      toggleLike.mutate(postId, {
        onError: (error) => {
          const unauthorized =
            (error as { response?: { status?: number } })?.response?.status ===
            401;
          showToast(
            unauthorized
              ? 'Session expired. Please sign in again.'
              : 'Could not like the post. Please try again.',
            { type: 'error' },
          );
        },
      });
    },
    [isAuthenticated, promptSignUp, toggleLike, showToast],
  );

  const handleComment = useCallback(
    (postId: string, slug: string) => {
      if (!isAuthenticated) {
        promptSignUp();
        return;
      }
      openPost(slug);
    },
    [isAuthenticated, promptSignUp, openPost],
  );

  const renderItem = useCallback(
    ({ item }: { item: BlogCardData }) => (
      <BlogCard
        post={item}
        onPress={() => openPost(item.slug)}
        onLikePress={(id) => handleLike(id)}
        onCommentPress={(id) => handleComment(id, item.slug)}
      />
    ),
    [openPost, handleLike, handleComment],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <FeedHeader
            onSearch={() => router.push('/search')}
            onCreate={handleCreatePost}
          />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FeedHeader
          onSearch={() => router.push('/search')}
          onCreate={handleCreatePost}
        />

        {!isAuthenticated && (
          <Pressable onPress={() => router.push('/sign-up')}>
            <ThemedView type="backgroundElement" style={styles.signUpBanner}>
              <ThemedText type="small">
                Read freely — <ThemedText type="link">sign up</ThemedText> to
                like &amp; comment
              </ThemedText>
            </ThemedView>
          </Pressable>
        )}

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footerLoader} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ThemedText themeColor="textSecondary">
                No posts yet. Check back soon!
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  header: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  wordmarkAccent: {
    color: Brand.emerald,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: -Spacing.three,
    marginTop: Spacing.one,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpBanner: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
  },
  filterWrap: {
    marginBottom: Spacing.three,
    marginHorizontal: -Spacing.three,
  },
  filterContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  listContent: {
    paddingBottom: Spacing.three,
  },
  footerLoader: {
    paddingVertical: Spacing.three,
  },
  emptyState: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
});

function FeedHeader({
  onSearch,
  onCreate,
}: {
  onSearch: () => void;
  onCreate: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={[styles.wordmark, { color: theme.text }]}>
          Technicks <Text style={styles.wordmarkAccent}>Learn</Text>
        </Text>

        <View style={styles.headerActions}>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Create a post"
            onPress={onCreate}
            style={[
              styles.iconButton,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <Ionicons name="add" size={24} color={theme.text} />
          </Pressable>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Search posts"
            onPress={onSearch}
            style={[
              styles.iconButton,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <Ionicons name="search" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <ThemedText themeColor="textSecondary">
        Latest posts from the community
      </ThemedText>

      <View style={[styles.headerDivider, { backgroundColor: theme.backgroundSelected }]} />
    </View>
  );
}

function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: { id: string; name: string; slug: string }[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      style={styles.filterWrap}
      contentContainerStyle={styles.filterContent}
      showsHorizontalScrollIndicator={false}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[
          styles.filterChip,
          {
            backgroundColor:
              selected === null ? Brand.emerald : theme.backgroundElement,
            borderColor:
              selected === null ? Brand.emerald : theme.backgroundSelected,
          },
        ]}
      >
        <ThemedText
          type="small"
          style={{
            color: selected === null ? '#061415' : theme.textSecondary,
            fontWeight: '600',
          }}
        >
          All
        </ThemedText>
      </Pressable>

      {categories.map((cat) => {
        const active = selected === cat.slug;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(active ? null : cat.slug)}
            style={[
              styles.filterChip,
              {
                backgroundColor: active
                  ? Brand.emerald
                  : theme.backgroundElement,
                borderColor: active
                  ? Brand.emerald
                  : theme.backgroundSelected,
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{
                color: active ? '#061415' : theme.textSecondary,
                fontWeight: '600',
              }}
            >
              {cat.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
