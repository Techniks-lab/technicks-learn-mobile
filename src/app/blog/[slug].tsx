import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import {
  useBlogPost,
  useBlogComments,
  useToggleLike,
  useCreateComment,
  useDeleteComment,
} from '@/hooks/use-blog';
import { BlogComment } from '@/lib/blog-api';
import { useToast } from '@/providers/toast-provider';
import { useLoading } from '@/providers/loading-provider';
import { formatRelativeTime } from '@/utils/dates';

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const toggleLike = useToggleLike();
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const { data: post, isLoading: postLoading } = useBlogPost(slug ?? '');
  const { data: commentsData, isLoading: commentsLoading } = useBlogComments(
    post?.id ?? '',
    !!post?.id,
  );

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<BlogComment | null>(null);
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const promptSignUp = useCallback(() => {
    Alert.alert(
      'Sign up to interact',
      'Liking and commenting require an account.',
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign Up', onPress: () => router.push('/sign-up') },
      ],
    );
  }, [router]);

  const handleLike = useCallback(() => {
    if (!isAuthenticated || !post) {
      promptSignUp();
      return;
    }
    toggleLike.mutate(post.id, {
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
  }, [isAuthenticated, post, promptSignUp, toggleLike, showToast]);

  const handleSubmitComment = useCallback(async () => {
    if (!isAuthenticated || !post) {
      promptSignUp();
      return;
    }
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      await withLoading(
        () =>
          createComment.mutateAsync({
            postId: post.id,
            body: trimmed,
            parentId: replyingTo?.id,
          }),
        replyingTo ? 'Posting reply…' : 'Posting comment…',
      );
      showToast(replyingTo ? 'Reply posted' : 'Comment added', {
        type: 'success',
      });
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      const unauthorized =
        (error as { response?: { status?: number } })?.response?.status ===
        401;
      showToast(
        unauthorized
          ? 'Session expired. Please sign in again.'
          : 'Could not post the comment. Please try again.',
        { type: 'error' },
      );
    }
  }, [
    isAuthenticated,
    post,
    commentText,
    replyingTo,
    promptSignUp,
    createComment,
    withLoading,
    showToast,
  ]);

  const confirmDeleteComment = useCallback(
    (commentId: string) => {
      if (!post) return;
      Alert.alert(
        'Delete comment?',
        'This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () =>
              deleteComment.mutate(
                { postId: post.id, commentId },
                {
                  onSuccess: () =>
                    showToast('Comment deleted', { type: 'success' }),
                },
              ),
          },
        ],
      );
    },
    [post, deleteComment, showToast],
  );

  if (postLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Post not found.</ThemedText>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link" style={{ marginTop: Spacing.two }}>
            Go back
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const formattedDate = formatRelativeTime(post.createdAt)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#F3F7F5" />
        </Pressable>
        <ThemedText type="title" style={styles.headerTitle}>
          Post
        </ThemedText>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? headerHeight + insets.top : 0
        }
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover */}
          {post.coverImage ? (
            <Link.AppleZoomTarget>
              <Image
                source={{ uri: post.coverImage }}
                style={styles.coverImage}
                contentFit="cover"
                transition={300}
              />
            </Link.AppleZoomTarget>
          ) : null}

          <View style={styles.body}>
            {/* Categories */}
            {post.categories.length > 0 && (
              <View style={styles.categoriesRow}>
                {post.categories.map((cat) => (
                  <View key={cat.id} style={styles.categoryBadge}>
                    <ThemedText type="small" style={styles.categoryText}>
                      {cat.name}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            <ThemedText type="title" style={styles.title}>
              {post.title}
            </ThemedText>

            {/* Author + meta */}
            <View style={styles.metaRow}>
              {post.author.avatarUrl ? (
                <Image
                  source={{ uri: post.author.avatarUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <ThemedText style={styles.avatarInitial}>
                    {(post.author.name ?? '?')[0]?.toUpperCase()}
                  </ThemedText>
                </View>
              )}
              <View>
                <ThemedText type="smallBold">
                  {post.author.name ?? 'Anonymous'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formattedDate}
                </ThemedText>
              </View>
            </View>

            {/* Like bar */}
            <Pressable style={styles.likeBar} onPress={handleLike}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={post.isLiked ? Brand.amber : Brand.mutedGray}
              />
              <ThemedText type="small" themeColor="textSecondary">
                {post.likeCount}
              </ThemedText>
              <View style={styles.likeBarSpacer} />
              <Ionicons name="chatbubble-outline" size={18} color={Brand.mutedGray} />
              <ThemedText type="small" themeColor="textSecondary">
                {post.commentCount}
              </ThemedText>
            </Pressable>

            {/* Content */}
            <ThemedText style={styles.content}>{post.content}</ThemedText>

            {/* Comments section */}
            <View style={styles.commentsSection}>
              <ThemedText type="subtitle" style={styles.commentsTitle}>
                Comments
              </ThemedText>

              {commentsLoading ? (
                <ActivityIndicator style={{ marginVertical: Spacing.three }} />
              ) : (
                (commentsData?.comments ?? []).map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={user?.id ?? null}
                    onReply={(entry) => setReplyingTo(entry)}
                    onDelete={confirmDeleteComment}
                  />
                ))
              )}

              {commentsData?.comments.length === 0 && !commentsLoading && (
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  style={{ marginVertical: Spacing.two }}
                >
                  No comments yet. Be the first!
                </ThemedText>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Comment input bar */}
        <View
          style={[
            styles.inputBar,
            { paddingBottom: keyboardVisible ? 0 : insets.bottom },
          ]}
        >
          {replyingTo && (
            <View style={styles.replyBar}>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.replyBarText}>
                Replying to{' '}
                <ThemedText type="smallBold">
                  {replyingTo.author.name ?? 'Anonymous'}
                </ThemedText>
              </ThemedText>
              <Pressable hitSlop={8} onPress={() => setReplyingTo(null)}>
                <Ionicons name="close" size={18} color={Brand.mutedGray} />
              </Pressable>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={
                replyingTo ? 'Write a reply...' : 'Add a comment...'
              }
              placeholderTextColor={Brand.mutedGray}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Pressable
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || createComment.isPending}
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.pressed,
                (!commentText.trim() || createComment.isPending) &&
                  styles.sendDisabled,
              ]}
            >
              <Ionicons
                name="send"
                size={18}
                color={commentText.trim() ? Brand.emerald : Brand.mutedGray}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onDelete,
}: {
  comment: BlogComment;
  currentUserId: string | null;
  onReply: (comment: BlogComment) => void;
  onDelete: (commentId: string) => void;
}) {
  const formattedDate = formatRelativeTime(comment.createdAt)
  const canDelete = currentUserId != null && comment.author.id === currentUserId;

  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        {comment.author.avatarUrl ? (
          <Image
            source={{ uri: comment.author.avatarUrl }}
            style={styles.commentAvatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.commentAvatar, styles.avatarFallback]}>
            <ThemedText style={styles.commentAvatarInitial}>
              {(comment.author.name ?? '?')[0]?.toUpperCase()}
            </ThemedText>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <ThemedText type="small" style={styles.commentAuthorName}>
            {comment.author.name ?? 'Anonymous'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formattedDate}
          </ThemedText>
        </View>
        <Pressable hitSlop={8} onPress={() => onReply(comment)}>
          <Ionicons name="arrow-undo-outline" size={16} color="#888" />
        </Pressable>
        {canDelete && (
          <Pressable hitSlop={8} onPress={() => onDelete(comment.id)}>
            <Ionicons name="trash-outline" size={16} color={Brand.danger} />
          </Pressable>
        )}
      </View>
      <ThemedText style={styles.commentBody}>{comment.body}</ThemedText>

      {/* Replies */}
      {comment.replies?.map((reply) => {
        const canDeleteReply =
          currentUserId != null && reply.author.id === currentUserId;
        const formattedReplyDate = formatRelativeTime(reply.createdAt)

        return (
          <View key={reply.id} style={styles.replyItem}>
            <View style={styles.commentHeader}>
              {reply.author.avatarUrl ? (
                <Image
                  source={{ uri: reply.author.avatarUrl }}
                  style={styles.replyAvatar}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.replyAvatar, styles.avatarFallback]}>
                  <ThemedText style={styles.commentAvatarInitial}>
                    {(reply.author.name ?? '?')[0]?.toUpperCase()}
                  </ThemedText>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <ThemedText type="small" style={styles.commentAuthorName}>
                  {reply.author.name ?? 'Anonymous'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formattedReplyDate}
                </ThemedText>
              </View>
              <Pressable hitSlop={8} onPress={() => onReply(comment)}>
                <Ionicons name="arrow-undo-outline" size={16} color="#888" />
              </Pressable>
              {canDeleteReply && (
                <Pressable hitSlop={8} onPress={() => onDelete(reply.id)}>
                  <Ionicons name="trash-outline" size={16} color={Brand.danger} />
                </Pressable>
              )}
            </View>
            <ThemedText style={styles.replyBody}>{reply.body}</ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#164143',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#082526',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scrollContent: { paddingBottom: Spacing.three },
  coverImage: { width: '100%', aspectRatio: 16 / 9 },
  body: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.two,
  },
  categoryBadge: {
    backgroundColor: 'rgba(24, 201, 120, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(24, 201, 120, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: Brand.emerald,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: { fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: Spacing.two },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarFallback: {
    backgroundColor: Brand.brightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#061415', fontWeight: '700', fontSize: 14 },
  likeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#164143',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#164143',
    marginBottom: Spacing.three,
  },
  likeBarSpacer: { flex: 1 },
  content: { fontSize: 13, lineHeight: 26, marginBottom: Spacing.five },
  commentsSection: { marginTop: Spacing.two },
  commentsTitle: { marginBottom: Spacing.two },
  commentItem: {
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#164143',
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.one },
  commentAvatar: { width: 28, height: 28, borderRadius: 14 },
  commentAvatarInitial: { color: '#061415', fontWeight: '700', fontSize: 11 },
  commentAuthorName: { fontWeight: '600' },
  commentBody: { fontSize: 14, lineHeight: 20, marginLeft: 36 },
  replyItem: {
    marginLeft: 36,
    paddingVertical: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#164143',
  },
  replyAvatar: { width: 22, height: 22, borderRadius: 11 },
  replyBody: { fontSize: 13, lineHeight: 18, marginLeft: 30 },
  inputBar: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#164143',
    gap: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  replyBarText: {
    flex: 1,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#0E3234',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#F3F7F5',
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
});
