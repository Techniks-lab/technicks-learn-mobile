import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useDeletePost, useMyPosts, useUpdatePost } from '@/hooks/use-blog';
import { useTheme } from '@/hooks/use-theme';
import { parseServerDate } from '@/utils/dates';
import { ManagePost } from '@/lib/blog-api';
import { useToast } from '@/providers/toast-provider';

type StatusFilter = 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Drafts' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'ARCHIVED', label: 'Archived' },
];

const STATUS_META = {
  DRAFT: { color: Brand.amber, label: 'Draft' },
  PUBLISHED: { color: Brand.emerald, label: 'Published' },
  ARCHIVED: { color: Brand.blueGray, label: 'Archived' },
} as const;

function formatDate(dateStr: string): string {
  return parseServerDate(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ManageBlogsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const { data, isLoading } = useMyPosts(isAuthenticated);
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const posts = useMemo(() => {
    if (!data) return [];
    if (filter === 'ALL') return data.posts;
    return data.posts.filter((p) => p.status === filter);
  }, [data, filter]);

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.centered} edges={['bottom']}>
          <Ionicons name="newspaper-outline" size={40} color={theme.textSecondary} />
          <ThemedText type="subtitle" style={styles.centerText}>
            Sign in to manage blogs
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Create, edit and publish posts from your account.
          </ThemedText>
          <Pressable
            style={[styles.submitButton, { backgroundColor: Brand.emerald }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <ThemedText style={styles.submitButtonText}>Go to profile</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handlePublish = async (post: ManagePost) => {
    if (post.status === 'PUBLISHED') return;
    try {
      await updatePost.mutateAsync({
        id: post.id,
        input: { status: 'PUBLISHED' },
      });
      showToast('Post published.', { type: 'success' });
    } catch (e: any) {
      showToast(
        e?.response?.data?.message ?? 'Failed to publish the post.',
        { type: 'error' },
      );
    }
  };

  const confirmDelete = async (post: ManagePost) => {
    try {
      await deletePost.mutateAsync(post.id);
      showToast('Post deleted.', { type: 'success' });
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? 'Failed to delete the post.', {
        type: 'error',
      });
    }
  };

  const handleDelete = (post: ManagePost) => {
    Alert.alert(
      'Delete post',
      `Delete "${post.title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(post),
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.headerRow}>
          <View style={styles.flexSpacer}>
            <ThemedText type="subtitle">My blogs</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Create, edit and publish your posts
            </ThemedText>
          </View>
          <Pressable
            style={styles.newButton}
            onPress={() => router.push('/manage/blogs/new')}
          >
            <Ionicons name="add" size={18} color="#061415" />
            <ThemedText style={styles.newButtonText}>New</ThemedText>
          </Pressable>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filters}
              contentContainerStyle={styles.filtersContent}
            >
              {FILTERS.map((entry) => {
                const active = filter === entry.key;
                return (
                  <Pressable
                    key={entry.key}
                    onPress={() => setFilter(entry.key)}
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
                      {entry.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator
                size="large"
                color={Brand.emerald}
                style={styles.spinner}
              />
            ) : (
              <View style={styles.empty}>
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color={theme.textSecondary}
                />
                <ThemedText themeColor="textSecondary" style={styles.centerText}>
                  No posts here yet.
                </ThemedText>
              </View>
            )
          }
          renderItem={({ item }) => (
            <PostRow
              post={item}
              onPublish={() => handlePublish(item)}
              onEdit={() =>
                router.push({
                  pathname: '/manage/blogs/[id]',
                  params: { id: item.id, slug: item.slug },
                })
              }
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function PostRow({
  post,
  onPublish,
  onEdit,
  onDelete,
}: {
  post: ManagePost;
  onPublish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const meta = STATUS_META[post.status];

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
        <ThemedText type="small" style={[styles.statusLabel, { color: meta.color }]}>
          {meta.label}
        </ThemedText>
        <View style={styles.flexSpacer} />
        <ThemedText type="small" themeColor="textFaint">
          {formatDate(post.updatedAt)}
        </ThemedText>
      </View>

      <Pressable
        disabled={post.status !== 'PUBLISHED'}
        onPress={() =>
          router.push({ pathname: '/blog/[slug]', params: { slug: post.slug } })
        }
      >
        <ThemedText type="smallBold" style={styles.cardTitle} numberOfLines={2}>
          {post.title}
        </ThemedText>
      </Pressable>

      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
        {post.status === 'PUBLISHED'
          ? 'Live on the feed'
          : 'Only you can see this'}{' '}
        · {post.likeCount} likes · {post.commentCount} comments
      </ThemedText>

      <View style={styles.cardActions}>
        {post.status !== 'PUBLISHED' && (
          <ActionButton
            icon="cloud-upload-outline"
            label="Publish"
            color={Brand.emerald}
            onPress={onPublish}
          />
        )}
        <ActionButton
          icon="create-outline"
          label="Edit"
          color={theme.textSecondary}
          onPress={onEdit}
        />
        <ActionButton
          icon="trash-outline"
          label="Delete"
          color={Brand.danger}
          onPress={onDelete}
        />
      </View>
    </ThemedView>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor: theme.background, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={14} color={color} />
      <ThemedText type="small" style={[styles.actionLabel, { color }]}>
        {label}
      </ThemedText>
    </Pressable>
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
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  flexSpacer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.emerald,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newButtonText: {
    color: '#061415',
    fontSize: 15,
    fontWeight: '700',
  },
  filters: {
    flexGrow: 0,
  },
  filtersContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  spinner: {
    marginTop: Spacing.six,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.six,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#123C3E',
    padding: Spacing.three,
    marginBottom: Spacing.two + Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  submitButton: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitButtonText: {
    color: '#061415',
    fontSize: 16,
    fontWeight: '700',
  },
});