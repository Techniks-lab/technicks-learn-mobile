import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TierBadge, TIER_META } from '@/components/learn/tier-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth, type AuthUser } from '@/hooks/use-auth';
import { useMyPosts } from '@/hooks/use-blog';
import { useMyCourses } from '@/hooks/use-courses';
import { useGamificationMe, useLeaderboard } from '@/hooks/use-gamification';
import { useTheme } from '@/hooks/use-theme';
import type { ManagePost } from '@/lib/blog-api';
import { useLoading } from '@/providers/loading-provider';
import { useToast } from '@/providers/toast-provider';

type ProfileTab = 'about' | 'posts' | 'courses';

export default function ProfileScreen() {
  const { status, isAuthenticated } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {status === 'loading' ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" />
          </View>
        ) : isAuthenticated ? (
          <SignedInProfile />
        ) : (
          <SignedOutLogin />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function SignedOutLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      await withLoading(async () => {
        await login({ email: email.trim(), password });
        showToast("Welcome back! You're signed in.", { type: 'success' });
      }, 'Signing in…');
      setPassword('');
    } catch (e: any) {
      const message =
        e?.response?.data?.message ??
        e?.message ??
        'Something went wrong. Try again.';
      setError(Array.isArray(message) ? message.join('\n') : String(message));
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.contentPad}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Profile</ThemedText>
          <ThemedText themeColor="textSecondary">
            Log in or create an account
          </ThemedText>
        </View>

        {error && (
          <ThemedText type="small" style={styles.errorText}>
            {error}
          </ThemedText>
        )}

        <ThemedView type="backgroundElement" style={styles.loginCard}>
          <View style={styles.loginFields}>
            <ThemedText type="smallBold" style={styles.loginLabel}>
              Email
            </ThemedText>
            <ThemedView type="background" style={styles.loginInput}>
              <Ionicons name="mail-outline" size={18} color="#91B0C5" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#687F8A"
                style={[styles.loginInputText, { color: '#F3F7F5' }]}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </ThemedView>

            <ThemedText type="smallBold" style={styles.loginLabel}>
              Password
            </ThemedText>
            <ThemedView type="background" style={styles.loginInput}>
              <Ionicons name="lock-closed-outline" size={18} color="#91B0C5" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#687F8A"
                style={[styles.loginInputText, { color: '#F3F7F5' }]}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </ThemedView>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={submit}
          >
            <Text style={styles.primaryButtonText}>Log in</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/sign-up')}>
            <ThemedText type="small" style={styles.switchText}>
              New here? Create an account
            </ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </ScrollView>
  );
}

function SignedInProfile() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();
  const theme = useTheme();

  const [tab, setTab] = useState<ProfileTab>('about');

  const { data: me } = useGamificationMe(isAuthenticated);
  const { data: leaderboard } = useLeaderboard(isAuthenticated);
  const { data: coursesData } = useMyCourses(isAuthenticated);

  const streak = useMemo(() => {
    const courses = coursesData?.courses ?? [];
    return courses.reduce(
      (max, c) => Math.max(max, c.enrollment.currentStreak),
      0,
    );
  }, [coursesData]);

  if (!user) return null;

  const tier = leaderboard?.me?.tier ?? null;
  const tierMeta = tier ? TIER_META[tier] : null;

  const initials = (user.fullName ?? user.email ?? '?')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () =>
    withLoading(async () => {
      await logout();
      showToast('Signed out.', { type: 'info' });
    }, 'Signing out…');

  const handleLogoutConfirm = () =>
    Alert.alert(
      'Log out?',
      'You will need to sign in again to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: handleLogout },
      ],
    );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[Brand.brightGreen, '#123C3E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Pressable
          style={styles.bannerIcon}
          onPress={() => router.push('/manage/blogs')}
          hitSlop={10}
        >
          <Ionicons name="settings-outline" size={22} color="#061415" />
        </Pressable>
      </LinearGradient>

      <View style={[styles.avatarWrap, { borderColor: theme.background }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.contentPad}>
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <ThemedText type="subtitle">
              {user.fullName ?? (user.username ? `u/${user.username}` : 'No name set')}
            </ThemedText>
            {user.isVerified ? (
              <Ionicons name="checkmark-circle" size={18} color={Brand.emerald} />
            ) : null}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            u/{user.username ?? 'username not set'}
          </ThemedText>
          {tier ? (
            <View style={styles.tierRow}>
              <TierBadge tier={tier} />
              {leaderboard?.me?.rank ? (
                <ThemedText type="small" themeColor="textFaint">
                  #{leaderboard.me.rank} this week
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </View>

        {!user.isVerified ? (
          <Pressable style={styles.alertRow} onPress={() => router.push('/verify-otp')}>
            <Ionicons name="mail-unread-outline" size={18} color={Brand.amber} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.alertText}>
              Verify your email to unlock the full app
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#687F8A" />
          </Pressable>
        ) : user.username === null ? (
          <Pressable style={styles.alertRow} onPress={() => router.push('/set-username')}>
            <Ionicons name="person-add-outline" size={18} color={Brand.emerald} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.alertText}>
              Choose a username so others can find you
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#687F8A" />
          </Pressable>
        ) : null}

        <View style={[styles.statsRow, { backgroundColor: theme.backgroundElement }]}>
          <StatCell value={me?.xp ?? 0} label="XP" />
          <StatCell
            value={tierMeta?.label ?? '—'}
            label="Tier"
            color={tierMeta?.color}
          />
          <StatCell
            value={leaderboard?.me?.rank ? `#${leaderboard.me.rank}` : '—'}
            label="Rank"
          />
          <StatCell value={streak} label="Streak" />
        </View>

        <View style={styles.tabBar}>
          {(
            [
              { key: 'about', label: 'About' },
              { key: 'posts', label: 'Posts' },
              { key: 'courses', label: 'Courses' },
            ] as const
          ).map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[
                  styles.tab,
                  active && { borderBottomColor: Brand.emerald },
                ]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { color: active ? theme.text : theme.textSecondary },
                    active && styles.tabLabelActive,
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'about' && <AboutTab user={user} onLogout={handleLogoutConfirm} />}
        {tab === 'posts' && <PostsTab />}
        {tab === 'courses' && <CoursesTab />}
      </View>
    </ScrollView>
  );
}

function StatCell({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color?: string;
}) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, color ? { color } : undefined]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AboutTab({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.tabContent}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <Row
          icon="mail-outline"
          label="Email"
          value={user.email}
        />
        <View style={[styles.rowDivider, { backgroundColor: theme.backgroundSelected }]} />
        <Row
          icon="shield-checkmark-outline"
          label="Account status"
          value={user.isVerified ? 'Verified' : 'Unverified'}
          valueColor={user.isVerified ? Brand.emerald : Brand.amber}
        />
      </ThemedView>

      <Pressable
        style={[styles.card, styles.menuRow, { backgroundColor: theme.backgroundElement }]}
        onPress={() => router.push('/edit-profile')}
      >
        <Ionicons name="person-outline" size={20} color={Brand.emerald} />
        <ThemedText type="smallBold" style={styles.menuText}>
          Edit profile
        </ThemedText>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </Pressable>

      <Pressable
        style={[styles.card, styles.menuRow, { backgroundColor: theme.backgroundElement }]}
        onPress={() => router.push('/manage/blogs')}
      >
        <Ionicons name="create-outline" size={20} color={Brand.emerald} />
        <ThemedText type="smallBold" style={styles.menuText}>
          Manage blogs
        </ThemedText>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </Pressable>

      <Pressable
        style={[
          styles.card,
          styles.menuRow,
          { backgroundColor: theme.backgroundElement },
        ]}
        onPress={onLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={Brand.danger} />
        <ThemedText type="smallBold" style={styles.logoutText}>
          Log out
        </ThemedText>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={theme.textSecondary} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

function PostsTab() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useMyPosts(isAuthenticated);

  const posts = data?.posts ?? [];

  if (isLoading) {
    return <TabSkeleton />;
  }

  return (
    <View style={styles.tabContent}>
      <Pressable
        style={[styles.newPostRow, { backgroundColor: theme.backgroundElement }]}
        onPress={() => router.push('/manage/blogs/new')}
      >
        <Ionicons name="add-circle-outline" size={20} color={Brand.emerald} />
        <ThemedText type="smallBold" style={styles.menuText}>
          Write a post
        </ThemedText>
      </Pressable>

      {posts.length === 0 ? (
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            No posts yet. Share your first learnings with the community.
          </ThemedText>
        </ThemedView>
      ) : (
        posts.map((post) => <PostRow key={post.id} post={post} />)
      )}
    </View>
  );
}

function PostRow({ post }: { post: ManagePost }) {
  const theme = useTheme();
  const router = useRouter();
  const published = post.status === 'PUBLISHED';

  return (
    <Pressable
      style={[styles.card, styles.postRow, { backgroundColor: theme.backgroundElement }]}
      onPress={() =>
        router.push({ pathname: '/blog/[slug]', params: { slug: post.slug } })
      }
    >
      <View style={styles.postTop}>
        <ThemedText type="smallBold" style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </ThemedText>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: published ? 'rgba(24, 201, 120, 0.14)' : 'rgba(245, 184, 46, 0.14)' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: published ? Brand.emerald : Brand.amber },
            ]}
          >
            {published ? 'PUBLISHED' : post.status}
          </Text>
        </View>
      </View>

      {post.excerpt ? (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          numberOfLines={2}
          style={styles.postExcerpt}
        >
          {post.excerpt}
        </ThemedText>
      ) : null}

      <View style={styles.postMeta}>
        <View style={styles.postVote}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={14}
            color={post.isLiked ? Brand.emerald : theme.textSecondary}
          />
          <ThemedText type="small" themeColor="textSecondary">
            {post.likeCount}
          </ThemedText>
        </View>
        <View style={styles.postVote}>
          <Ionicons name="chatbubble-outline" size={13} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            {post.commentCount}
          </ThemedText>
        </View>
        <ThemedText type="small" themeColor="textFaint" style={styles.postDate}>
          {relativeTime(post.createdAt)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

function CoursesTab() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useMyCourses(isAuthenticated);

  const courses = data?.courses ?? [];

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (courses.length === 0) {
    return (
      <View style={styles.tabContent}>
        <Pressable style={styles.browseCourses} onPress={() => router.push('/learn')}>
          <ThemedText type="small" themeColor="textSecondary">
            No courses yet — browse the catalog
          </ThemedText>
          <Ionicons name="arrow-forward" size={16} color={Brand.emerald} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {courses.map((course) => {
        const lessons = course.enrollment.completedLessonCount ?? 0;
        return (
          <Pressable
            key={course.id}
            style={[styles.card, styles.myCourseRow, { backgroundColor: theme.backgroundElement }]}
            onPress={() =>
              router.push({
                pathname: '/learn/course/[slug]',
                params: { slug: course.slug },
              })
            }
          >
            <View style={styles.myCourseBody}>
              <ThemedText type="smallBold">{course.title}</ThemedText>
              <View style={styles.myCourseMeta}>
                <View style={styles.postVote}>
                  <Ionicons name="flame" size={13} color={Brand.amber} />
                  <ThemedText type="small" themeColor="textSecondary">
                    {course.enrollment.currentStreak} day streak
                  </ThemedText>
                </View>
                {course.category ? (
                  <ThemedText type="small" themeColor="textFaint">
                    · {course.category.name}
                  </ThemedText>
                ) : null}
              </View>
              <ThemedText type="small" themeColor="textFaint">
                {lessons} lesson{lessons === 1 ? '' : 's'} complete
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Brand.emerald} />
          </Pressable>
        );
      })}
    </View>
  );
}

function TabSkeleton() {
  const theme = useTheme();
  return (
    <View style={styles.tabContent}>
      {[0, 1].map((i) => (
        <ThemedView key={i} type="backgroundElement" style={styles.card}>
          <ActivityIndicator color={theme.textSecondary} />
        </ThemedView>
      ))}
    </View>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.six,
  },
  contentPad: {
    paddingHorizontal: Spacing.half,
  },
  header: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  errorText: {
    color: Brand.danger,
    marginBottom: Spacing.two,
  },
  loginCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },
  loginFields: {
    gap: Spacing.two,
  },
  loginLabel: {
    marginTop: Spacing.one,
  },
  loginInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
  },
  loginInputText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.three,
  },
  primaryButton: {
    backgroundColor: Brand.emerald,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  primaryButtonText: {
    color: '#061415',
    fontSize: 16,
    fontWeight: '700',
  },
  switchText: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  banner: {
    height: 132,
    marginHorizontal: -Spacing.three,
    borderTopLeftRadius: Spacing.three,
    borderTopRightRadius: Spacing.three,
    overflow: 'hidden',
  },
  bannerIcon: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(6, 20, 21, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    backgroundColor: Brand.brightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    marginLeft: Spacing.four,
  },
  avatarText: {
    color: '#061415',
    fontSize: 28,
    fontWeight: '800',
  },
  identity: {
    marginTop: Spacing.two,
    gap: Spacing.half,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Brand.amber,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    marginTop: Spacing.three,
  },
  alertText: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    marginTop: Spacing.three,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F3F7F5',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#687F8A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: Spacing.four,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two + Spacing.one,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  tabContent: {
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowLabel: {
    flex: 1,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F3F7F5',
  },
  rowDivider: {
    height: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  menuText: {
    flex: 1,
  },
  logoutText: {
    flex: 1,
    color: Brand.danger,
  },
  newPostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
  postRow: {
    paddingVertical: Spacing.two + Spacing.one,
  },
  postTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  postTitle: {
    flex: 1,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  postExcerpt: {
    marginTop: Spacing.one,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  postVote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  postDate: {
    flex: 1,
    textAlign: 'right',
  },
  browseCourses: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Brand.emerald,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  myCourseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myCourseBody: {
    gap: Spacing.half,
    flexShrink: 1,
  },
  myCourseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});