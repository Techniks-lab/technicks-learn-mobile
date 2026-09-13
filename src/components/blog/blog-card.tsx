import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { Brand } from '@/constants/theme';
import { formatRelativeTime } from '@/utils/dates';
import { BlogCardData } from './types';

interface BlogCardProps {
  post: BlogCardData;
  onPress?: (post: BlogCardData) => void;
  onAuthorPress?: (authorId: string) => void;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onPress,
  onAuthorPress,
  onLikePress,
  onCommentPress,
  variant = 'default',
}) => {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Theme-aware palette — maps your tokens to the card's needs
  const palette = {
    cardBg: theme.backgroundElement,
    border: theme.backgroundSelected,
    title: theme.text,
    body: theme.textSecondary,
    meta: theme.textSecondary,
    authorName: theme.text,
    divider: theme.backgroundSelected,
    placeholderBg: theme.backgroundSelected,
    placeholderIcon: theme.textSecondary,
  };

  // Nested actions (author/like/comment) live inside the card Pressable.
  // On react-native-web the press event bubbles to the card, so track whether
  // an inner action fired and swallow the resulting card press to avoid
  // navigating away when tapping like/comment/author.
  const actionTriggered = React.useRef(false);
  const guardAction = (e: any) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    actionTriggered.current = true;
    setTimeout(() => {
      actionTriggered.current = false;
    }, 0);
  };

  const handlePress = () => {
    if (actionTriggered.current) {
      actionTriggered.current = false;
      return;
    }
    onPress?.(post);
  };
  const handleAuthorPress = (e: any) => {
    guardAction(e);
    onAuthorPress?.(post.author.id);
  };
  const handleLikePress = (e: any) => {
    guardAction(e);
    onLikePress?.(post.id);
  };
  const handleCommentPress = (e: any) => {
    guardAction(e);
    onCommentPress?.(post.id);
  };

  const primaryCategory = post.categories[0];

  // ---------- COMPACT VARIANT ----------
  if (variant === 'compact') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.compactCard,
          { backgroundColor: palette.cardBg },
          pressed && styles.pressed,
        ]}
      >
        {post.coverImage ? (
          <Image
            source={{ uri: post.coverImage }}
            style={styles.compactImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={[
              styles.compactImage,
              styles.placeholder,
              { backgroundColor: palette.placeholderBg },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={palette.placeholderIcon}
            />
          </View>
        )}
        <View style={styles.compactContent}>
          <Text
            style={[styles.compactTitle, { color: palette.title }]}
            numberOfLines={2}
          >
            {post.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: palette.meta }]}>
              {formatRelativeTime(post.publishedAt ?? post.createdAt)}
            </Text>
            {post.readingTime ? (
              <>
                <Text style={[styles.dot, { color: palette.meta }]}>·</Text>
                <Text style={[styles.metaText, { color: palette.meta }]}>
                  {post.readingTime} min
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  }

  // ---------- FEATURED VARIANT ----------
  if (variant === 'featured') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.featuredCard,
          { backgroundColor: palette.cardBg },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.featuredImageWrapper}>
          {post.coverImage ? (
            <Image
              source={{ uri: post.coverImage }}
              style={styles.featuredImage}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View
              style={[
                styles.featuredImage,
                styles.placeholder,
                { backgroundColor: palette.placeholderBg },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={48}
                color={palette.placeholderIcon}
              />
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.95)']}
            style={styles.featuredGradient}
          />
          {primaryCategory && (
            <View
              style={[
                styles.categoryBadgeFeatured,
                {
                  backgroundColor: isDark
                    ? 'rgba(24, 201, 120, 0.15)'
                    : 'rgba(24, 201, 120, 0.2)',
                  borderColor: Brand.emerald,
                },
              ]}
            >
              <Text style={styles.categoryBadgeText}>
                {primaryCategory.name.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.featuredContent}>
          <Text
            style={[styles.featuredTitle, { color: palette.title }]}
            numberOfLines={3}
          >
            {post.title}
          </Text>

          {post.excerpt && (
            <Text
              style={[styles.featuredExcerpt, { color: palette.body }]}
              numberOfLines={2}
            >
              {post.excerpt}
            </Text>
          )}

          <View style={[styles.footer, { borderTopColor: palette.divider }]}>
            <Pressable onPress={handleAuthorPress} style={styles.authorRow}>
              <AuthorAvatar author={post.author} size={28} />
              <Text
                style={[styles.authorName, { color: palette.authorName }]}
                numberOfLines={1}
              >
                {post.author.name ?? 'Anonymous'}
              </Text>
            </Pressable>

            <View style={styles.statsRow}>
              <StatButton
                icon={post.isLiked ? 'heart' : 'heart-outline'}
                count={post.likeCount ?? 0}
                onPress={(e) => handleLikePress(e)}
                active={post.isLiked}
                idleColor={palette.meta}
              />
              <StatButton
                icon="chatbubble-outline"
                count={post.commentCount ?? 0}
                onPress={(e) => handleCommentPress(e)}
                idleColor={palette.meta}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  // ---------- DEFAULT VARIANT (Reddit-style post) ----------
  const category = primaryCategory ? primaryCategory.name : 'Learn';
  const username = post.author.username || post.author.name || 'Anonymous';

  return (
    <Pressable
      onPress={handlePress}
style={({ pressed }) => [
          styles.card,
          { backgroundColor: palette.cardBg },
          pressed && styles.pressed,
        ]}
      >
      {/* Header: subreddit · posted by u/user · time */}
      <View style={styles.headerRow}>
        <Text style={styles.categoryText} numberOfLines={1}>
          {category}
        </Text>
        {post.status === 'DRAFT' && (
          <View style={styles.draftBadge}>
            <Text style={styles.draftBadgeText}>DRAFT</Text>
          </View>
        )}
        <Text style={[styles.headerMeta, { color: palette.meta }]} numberOfLines={1}>
          {'\u00A0·\u00A0'}Posted by{' '}
          <Text
            style={[styles.headerAuthor, { color: palette.authorName }]}
            onPress={handleAuthorPress}
            suppressHighlighting
          >
            u/{username}
          </Text>
          {'\u00A0·\u00A0'}
          {formatRelativeTime(post.publishedAt ?? post.createdAt)}
        </Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: palette.title }]} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Body: excerpt + thumbnail */}
      {(post.excerpt || post.coverImage) && (
        <View style={styles.bodyRow}>
          {post.excerpt ? (
            <Text
              style={[styles.excerpt, { color: palette.body }]}
              numberOfLines={3}
            >
              {post.excerpt}
            </Text>
          ) : null}

          {post.coverImage ? (
            <Link
              href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
              asChild
            >
              <Link.AppleZoom>
                <Image
                  source={{ uri: post.coverImage }}
                  style={styles.thumbnail}
                  contentFit="cover"
                  transition={250}
                />
              </Link.AppleZoom>
            </Link>
          ) : null}
        </View>
      )}

      {/* Footer: like + comments */}
      <View style={[styles.footer, { borderTopColor: palette.divider }]}>
        <View style={styles.statsRow}>
          <StatButton
            icon={post.isLiked ? 'heart' : 'heart-outline'}
            count={post.likeCount ?? 0}
            onPress={(e) => handleLikePress(e)}
            active={post.isLiked}
            idleColor={palette.meta}
          />
          <StatButton
            icon="chatbubble-outline"
            count={post.commentCount ?? 0}
            onPress={(e) => handleCommentPress(e)}
            idleColor={palette.meta}
          />
        </View>

        {post.readingTime ? (
          <Text style={[styles.footerMeta, { color: palette.meta }]}>
            {post.readingTime} min read
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

// ---------------- Sub-components ----------------

const AuthorAvatar: React.FC<{
  author: BlogCardData['author'];
  size?: number;
}> = ({ author, size = 32 }) => {
  if (author.avatarUrl) {
    return (
      <Image
        source={{ uri: author.avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }
  const initials = (author.name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatarFallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.avatarFallbackText, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
};

const StatButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  onPress?: (e: any) => void;
  active?: boolean;
  idleColor: string;
}> = ({ icon, count, onPress, active, idleColor }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    hitSlop={8}
    style={styles.statButton}
  >
    <Ionicons
      name={icon}
      size={16}
      color={active ? Brand.amber : idleColor}
    />
    {count > 0 && (
      <Text
        style={[
          styles.statText,
          { color: active ? Brand.amber : idleColor },
        ]}
      >
        {formatCount(count)}
      </Text>
    )}
  </Pressable>
);

// ---------------- Helpers ----------------

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// ---------------- Styles (structure only, colors applied inline) ----------------

const styles = StyleSheet.create({
  // Base
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Default variant (Reddit-style)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    color: Brand.emerald,
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  draftBadge: {
    backgroundColor: Brand.amber,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  draftBadgeText: {
    color: '#061415',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerMeta: {
    fontSize: 12.5,
    flexShrink: 1,
  },
  headerAuthor: {
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  excerpt: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: 'rgba(18,60,62,0.4)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Compact variant
  compactCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    padding: 10,
    gap: 12,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  compactContent: {
    flex: 1,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    marginHorizontal: 6,
  },

  // Featured variant
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featuredImageWrapper: {
    width: '100%',
    height: 260,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFill,
  },
  featuredContent: {
    padding: 20,
    marginTop: -40,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  featuredExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryBadgeFeatured: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Brand.emerald,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  avatarFallback: {
    backgroundColor: Brand.brightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#061415',
    fontWeight: '700',
  },
});