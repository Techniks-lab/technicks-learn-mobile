import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TierBadge } from '@/components/learn/tier-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useLeaderboard } from '@/hooks/use-gamification';
import type { LeaderboardEntry } from '@/lib/gamification-api';
import { useTheme } from '@/hooks/use-theme';

const RANK_COLORS = ['#FFD45A', '#C9D2DA', '#D89A6A'] as const;

export default function LeaderboardScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, isRefetching, refetch, isError } = useLeaderboard(
    isAuthenticated,
    30_000,
  );

  const meUserId = user?.id ?? data?.me?.userId ?? '';

  const entries = useMemo(() => data?.entries ?? [], [data]);
  const meEntry = useMemo(() => {
    if (!isAuthenticated || !meUserId) return null;
    return entries.find((e) => e.user.id === meUserId) ?? null;
  }, [entries, meUserId, isAuthenticated]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderHeader = useCallback(() => {
    if (!isAuthenticated) {
      return (
        <View style={styles.signInCard}>
          <Ionicons name="trophy-outline" size={22} color={Brand.amber} />
          <ThemedText type="smallBold">Sign in to join the weekly league</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Earn XP by completing lessons and keeping your streak alive.
          </ThemedText>
          <Pressable
            onPress={() => router.push('/sign-up')}
            style={({ pressed }) => [
              styles.signInButton,
              { backgroundColor: Brand.emerald },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.signInText}>Sign up</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.weekWrap}>
        <ThemedText type="small" themeColor="textSecondary">
          {data?.competition
            ? `This week · ${formatWindow(data.competition.startsAt, data.competition.endsAt)}`
            : 'This week'}
        </ThemedText>
        <ThemedText type="small" themeColor="textFaint">
          {entries.length} {entries.length === 1 ? 'competitor' : 'competitors'}
        </ThemedText>

        {meEntry ? (
          <ThemedView type="backgroundElement" style={styles.meCard}>
            <Avatar
              url={meEntry.user.avatarUrl}
              name={meEntry.user.fullName}
              username={meEntry.user.username}
              size={40}
            />
            <View style={styles.meBody}>
              <ThemedText type="smallBold">
                {displayName(meEntry.user.fullName, meEntry.user.username, 'You')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {meEntry.points} pts
              </ThemedText>
            </View>
            <View style={styles.meRight}>
              <RankBadge rank={meEntry.rank} size="large" />
              <TierBadge tier={meEntry.tier} />
            </View>
          </ThemedView>
        ) : null}
      </View>
    );
  }, [isAuthenticated, data, meEntry, entries.length, router]);

  const renderFooter = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.legend}>
        <LegendRow color={RANK_COLORS[0]} label="Gold · Top 3" />
        <LegendRow color={RANK_COLORS[1]} label="Silver · 4–10" />
        <LegendRow color={RANK_COLORS[2]} label="Bronze · Everyone else" />
      </View>
    );
  }, [isLoading]);

  const renderItem = useCallback(
    ({ item }: { item: LeaderboardEntry }) => {
      const isMe = meUserId !== '' && item.user.id === meUserId;
      return (
        <ThemedView
          type={isMe ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.row}
        >
          <RankBadge rank={item.rank} />
          <Avatar
            url={item.user.avatarUrl}
            name={item.user.fullName}
            username={item.user.username}
            size={36}
          />
          <View style={styles.rowBody}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {displayName(item.user.fullName, item.user.username)}
              {isMe ? '  (you)' : ''}
            </ThemedText>
          </View>
          <View style={styles.rowRight}>
            <TierBadge tier={item.tier} />
            <ThemedText type="smallBold" style={styles.points}>
              {item.points}
            </ThemedText>
          </View>
        </ThemedView>
      );
    },
    [meUserId],
  );

  if (isLoading && !data) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color="#F3F7F5" />
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>
            Leaderboard
          </ThemedText>
        </View>

        {isError && !data ? (
          <View style={styles.centered}>
            <ThemedText themeColor="textSecondary">
              Could not load the leaderboard.
            </ThemedText>
            <Pressable onPress={handleRefresh}>
              <ThemedText type="linkPrimary" style={{ marginTop: Spacing.two }}>
                Try again
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.user.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function Avatar({
  url,
  name,
  username,
  size,
}: {
  url: string | null;
  name: string | null;
  username: string | null;
  size: number;
}) {
  const theme = useTheme();
  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
      />
    );
  }
  const initial = (name ?? username ?? '?')[0]?.toUpperCase() ?? '?';
  return (
    <View
      style={[
        styles.avatarFallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.backgroundSelected,
        },
      ]}
    >
      <ThemedText type="smallBold">{initial}</ThemedText>
    </View>
  );
}

function RankBadge({ rank, size = 'small' }: { rank: number; size?: 'small' | 'large' }) {
  const theme = useTheme();
  const big = size === 'large';
  const isPodium = rank <= 3;
  return (
    <View
      style={[
        styles.rankBadge,
        big && styles.rankBadgeLarge,
        {
          backgroundColor: isPodium
            ? RANK_COLORS[rank - 1]
            : theme.backgroundSelected,
        },
      ]}
    >
      <Text
        style={[
          styles.rankText,
          big && styles.rankTextLarge,
          { color: isPodium ? '#061415' : theme.textSecondary },
        ]}
      >
        {rank}
      </Text>
    </View>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function displayName(fullName: string | null, username: string | null, fallback?: string) {
  return fullName ?? username ?? fallback ?? 'Anonymous';
}

function formatWindow(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.three,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  weekWrap: {
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  signInCard: {
    gap: Spacing.two,
  },
  signInButton: {
    borderRadius: Spacing.two,
    alignItems: 'center',
    paddingVertical: Spacing.three - 2,
    marginTop: Spacing.one,
  },
  signInText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#061415',
  },
  meCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginTop: Spacing.two,
  },
  meBody: {
    flex: 1,
  },
  meRight: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.two,
    padding: Spacing.two + Spacing.one,
    marginBottom: Spacing.two,
  },
  rowBody: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  points: {
    fontVariant: ['tabular-nums'],
    minWidth: 28,
    textAlign: 'right',
  },
  avatar: {
    backgroundColor: '#041011',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeLarge: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  rankTextLarge: {
    fontSize: 16,
  },
  legend: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});