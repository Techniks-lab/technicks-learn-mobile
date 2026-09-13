import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlogCard } from '@/components/blog/blog-card';
import { BlogCardData } from '@/components/blog/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useBlogFeed, useToggleLike } from '@/hooks/use-blog';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/providers/toast-provider';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const toggleLike = useToggleLike();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const activeQuery = debounced.length > 0;

  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useBlogFeed({ search: debounced, enabled: activeQuery });

  const results = useMemo(
    () => data?.pages.flatMap((p) => p.posts) ?? [],
    [data],
  );

  const openPost = useCallback(
    (slug: string) =>
      router.push({ pathname: '/blog/[slug]', params: { slug } }),
    [router],
  );

  const promptSignUp = useCallback(() => {
    Alert.alert(
      'Sign up to interact',
      'Anyone can read the feed, but liking and commenting require an account.',
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign Up', onPress: () => router.push('/sign-up') },
      ],
    );
  }, [router]);

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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.searchBar}>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </Pressable>

          <View style={[styles.inputWrap, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search posts…"
              placeholderTextColor={theme.textFaint}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              style={[styles.input, { color: theme.text }]}
            />
            {query.length > 0 && (
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setQuery('')}
              >
                <Ionicons name="close-circle" size={18} color={theme.textFaint} />
              </Pressable>
            )}
          </View>
        </View>

        {!activeQuery ? (
          <View style={styles.centerState}>
            <Ionicons name="search" size={40} color={theme.textSecondary} />
            <ThemedText type="smallBold">Search posts</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
              Find posts by title, content or author.
            </ThemedText>
          </View>
        ) : isPending ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={theme.textSecondary} />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator style={styles.footerLoader} />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.centerState}>
                <ThemedText type="smallBold">No posts found</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  Nothing matches “{debounced}”.
                </ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  hint: {
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: Spacing.three,
  },
  footerLoader: {
    paddingVertical: Spacing.three,
  },
});