import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TierBadge } from '@/components/learn/tier-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BottomTabInset,
  Brand,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import {
  useCourseCatalog,
  useCourseCategories,
} from '@/hooks/use-courses';
import { useGamificationMe, useLeaderboard } from '@/hooks/use-gamification';
import type { CourseSummary } from '@/lib/courses-api';
import { useTheme } from '@/hooks/use-theme';

export default function LearnScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const { data: me } = useGamificationMe(isAuthenticated);
  const { data: catalogData, isLoading: catalogLoading } = useCourseCatalog();
  const { data: categoriesData } = useCourseCategories();
  const { data: leaderboard } = useLeaderboard(isAuthenticated, 30_000);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = categoriesData?.categories ?? [];

  const courses = useMemo(() => {
    const all = catalogData?.courses ?? [];
    const query = search.trim().toLowerCase();
    return all.filter((course) => {
      const matchesCategory =
        !selectedCategory || course.category?.slug === selectedCategory;
      const matchesSearch =
        query.length === 0 ||
        course.title.toLowerCase().includes(query) ||
        (course.description ?? '').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [catalogData, search, selectedCategory]);

  const handleOpenCourse = useCallback(
    (slug: string) => {
      router.push({
        pathname: '/learn/course/[slug]',
        params: { slug },
      });
    },
    [router],
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <ThemedText type="subtitle">Learn</ThemedText>
                <ThemedText themeColor="textSecondary">
                  Courses with streaks &amp; weekly leagues
                </ThemedText>
              </View>

              <View style={styles.xpRow}>
                <View style={styles.xpPill}>
                  <Ionicons name="flash" size={14} color={Brand.emerald} />
                  <Text style={[styles.xpText, { color: Brand.emerald }]}>
                    {me?.xp ?? 0} XP
                  </Text>
                </View>
                <ThemedText type="small" themeColor="textFaint">
                  {courses.length} course{courses.length === 1 ? '' : 's'}
                </ThemedText>
              </View>

              <View style={styles.searchRow}>
                <Ionicons
                  name="search"
                  size={16}
                  color={theme.textSecondary}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search courses"
                  placeholderTextColor={theme.textFaint}
                  style={[styles.searchInput, { color: theme.text }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                />
                {search.length > 0 ? (
                  <Pressable onPress={() => setSearch('')} hitSlop={8}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                ) : null}
              </View>

              {categories.length > 0 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={[
                    { id: 'all', name: 'All', slug: null },
                    ...categories,
                  ]}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.chipsRow}
                  renderItem={({ item }) => {
                    const active = selectedCategory === item.slug;
                    return (
                      <Pressable
                        onPress={() => setSelectedCategory(item.slug)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: active
                              ? Brand.emerald
                              : theme.backgroundElement,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: active ? '#061415' : theme.textSecondary },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              ) : null}

              <View style={styles.sectionHeader}>
                <ThemedText type="smallBold">All courses</ThemedText>
              </View>

              {catalogLoading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <ThemedView
                      key={i}
                      type="backgroundElement"
                      style={styles.courseCard}
                    >
                      <ActivityIndicator color={theme.textSecondary} />
                    </ThemedView>
                  ))}
                </>
              ) : null}
            </>
          }
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => handleOpenCourse(item.slug)}
            />
          )}
          ListEmptyComponent={
            catalogLoading ? null : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search"
                  size={28}
                  color={theme.textFaint}
                />
                <ThemedText type="small" themeColor="textSecondary">
                  No courses match your search
                </ThemedText>
              </View>
            )
          }
          ListFooterComponent={
            <Pressable
              onPress={() =>
                isAuthenticated
                  ? router.push('/learn/leaderboard')
                  : AlertSignIn(router)
              }
              style={({ pressed }) => [
                styles.leaderboardEntry,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.leaderboardLeft}>
                <Ionicons name="trophy" size={20} color={Brand.amber} />
                <View>
                  <ThemedText type="smallBold">Weekly Leaderboard</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {leaderboard?.me
                      ? `You're #${leaderboard.me.rank} · ${leaderboard.me.points} pts`
                      : isAuthenticated
                        ? 'No points yet — earn XP to climb'
                        : 'Sign in to join the league'}
                  </ThemedText>
                </View>
              </View>
              {leaderboard?.me ? (
                <TierBadge tier={leaderboard.me.tier} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
              )}
            </Pressable>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function CourseCard({
  course,
  onPress,
}: {
  course: CourseSummary;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.courseCard,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}
    >
      {course.coverImage ? (
        <Image
          source={{ uri: course.coverImage }}
          style={styles.cover}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Ionicons name="school" size={28} color={Brand.brightGreen} />
        </View>
      )}
      <View style={styles.courseBody}>
        <View style={styles.courseTitleRow}>
          <ThemedText type="smallBold" style={styles.courseTitle}>
            {course.title}
          </ThemedText>
          {course.isEnrolled ? (
            <View style={styles.enrolledBadge}>
              <Ionicons name="checkmark" size={11} color="#061415" />
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          ) : null}
        </View>
        {course.description ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            numberOfLines={2}
            style={styles.courseDescription}
          >
            {course.description}
          </ThemedText>
        ) : null}
        <ThemedText type="small" themeColor="textFaint">
          {course.category ? `${course.category.name} · ` : ''}
          {course.lessonCount} lesson{course.lessonCount === 1 ? '' : 's'}
          {course.isEnrolled && course.completedLessonCount > 0
            ? ` · ${course.completedLessonCount} complete`
            : ''}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

function AlertSignIn(router: ReturnType<typeof useRouter>) {
  Alert.alert(
    'Sign up to earn XP',
    'Streaks, XP, and leaderboards require an account.',
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'Sign Up', onPress: () => router.push('/sign-up') },
    ],
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
    paddingBottom: BottomTabInset + Spacing.three,
  },
  listContent: { paddingBottom: Spacing.four },
  header: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    backgroundColor: 'rgba(24, 201, 120, 0.12)',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 3,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#123C3E',
    backgroundColor: '#082526',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    minHeight: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.two,
  },
  chipsRow: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
    marginBottom: Spacing.three,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
    backgroundColor: '#041011',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123C3E',
  },
  courseBody: {
    flex: 1,
    gap: Spacing.half,
  },
  courseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  courseTitle: {
    flexShrink: 1,
  },
  courseDescription: {
    flexShrink: 1,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Brand.emerald,
    borderRadius: 999,
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: 2,
  },
  enrolledText: {
    color: '#061415',
    fontSize: 11,
    fontWeight: '800',
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});