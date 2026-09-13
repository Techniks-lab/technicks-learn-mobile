import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import {
  useCourseCheckIn,
  useCourseDetail,
  useEnroll,
  useUnenroll,
} from '@/hooks/use-courses';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/providers/toast-provider';

export default function CourseScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const { data: course, isLoading } = useCourseDetail(slug ?? '');
  const enroll = useEnroll();
  const checkIn = useCourseCheckIn();
  const unenroll = useUnenroll();

  const handleEnroll = useCallback(() => {
    if (!slug) return;
    if (!isAuthenticated) {
      Alert.alert(
        'Sign up to earn XP',
        'Enrolling and earning XP require an account.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/sign-up') },
        ],
      );
      return;
    }
    enroll.mutate(slug, {
      onSuccess: () => showToast('Enrolled! Check in daily to grow your streak.', {
        type: 'success',
      }),
      onError: (error) => {
        const unauthorized =
          (error as { response?: { status?: number } })?.response?.status === 401;
        showToast(
          unauthorized
            ? 'Session expired. Please sign in again.'
            : 'Could not enroll. Please try again.',
          { type: 'error' },
        );
      },
    });
  }, [slug, isAuthenticated, router, enroll, showToast]);

  const handleCheckIn = useCallback(() => {
    if (!slug) return;
    if (!isAuthenticated) {
      Alert.alert(
        'Sign up to earn XP',
        'Streaks and XP require an account.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/sign-up') },
        ],
      );
      return;
    }
    checkIn.mutate(slug, {
      onSuccess: (res) => {
        if (res.xpAwarded > 0) {
          showToast(`Checked in! +${res.xpAwarded} XP`, { type: 'success' });
        } else {
          showToast('Already checked in today', { type: 'info' });
        }
      },
      onError: (error) => {
        const unauthorized =
          (error as { response?: { status?: number } })?.response?.status === 401;
        showToast(
          unauthorized
            ? 'Session expired. Please sign in again.'
            : 'Could not check in. Please try again.',
          { type: 'error' },
        );
      },
    });
  }, [slug, isAuthenticated, router, checkIn, showToast]);

  const handleUnenroll = useCallback(() => {
    if (!slug) return;
    Alert.alert(
      'Unenroll from this course?',
      'Your progress and streak will reset. You can re-enroll anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unenroll',
          style: 'destructive',
          onPress: () =>
            unenroll.mutate(slug, {
              onSuccess: (res) => {
                if (!res.unenrolled) {
                  showToast('You are not enrolled in this course.', {
                    type: 'info',
                  });
                  return;
                }
                showToast('Unenrolled from the course.', { type: 'info' });
                router.back();
              },
              onError: (error) => {
                const unauthorized =
                  (error as { response?: { status?: number } })?.response
                    ?.status === 401;
                showToast(
                  unauthorized
                    ? 'Session expired. Please sign in again.'
                    : 'Could not unenroll. Please try again.',
                  { type: 'error' },
                );
              },
            }),
        },
      ],
    );
  }, [slug, unenroll, showToast, router]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!course) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Course not found.</ThemedText>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link" style={{ marginTop: Spacing.two }}>
            Go back
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const enrollment = course.enrollment;
  const checkedInToday =
    enrollment?.lastCheckInDate === toDateKey(new Date());

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color="#F3F7F5" />
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>
            Course
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
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
              <Ionicons name="school" size={40} color={Brand.brightGreen} />
            </View>
          )}

          <ThemedText type="subtitle" style={styles.title}>
            {course.title}
          </ThemedText>
          {course.description ? (
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {course.description}
            </ThemedText>
          ) : null}

          <View style={styles.metaRow}>
            <ThemedText type="small" themeColor="textFaint">
              {course.lessons.length} lesson{course.lessons.length === 1 ? '' : 's'}
            </ThemedText>
            {enrollment ? (
              <ThemedText type="small" themeColor="textFaint">
                {enrollment.currentStreak} day streak
              </ThemedText>
            ) : null}
          </View>

          {enrollment ? (
            <>
              <StreakCard
                streak={enrollment.currentStreak}
                checkedInToday={checkedInToday}
                checkingIn={checkIn.isPending}
                onCheckIn={handleCheckIn}
              />
              <Pressable
                onPress={handleUnenroll}
                disabled={unenroll.isPending}
                style={styles.unenrollLink}
              >
                {unenroll.isPending ? (
                  <ActivityIndicator size={14} />
                ) : (
                  <Text style={styles.unenrollText}>Unenroll</Text>
                )}
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={handleEnroll}
              disabled={enroll.isPending}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: Brand.emerald },
                pressed && styles.pressed,
              ]}
            >
              {enroll.isPending ? (
                <ActivityIndicator size="small" color="#061415" />
              ) : (
                <Text style={styles.primaryButtonText}>Enroll in this course</Text>
              )}
            </Pressable>
          )}

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Lessons</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {course.lessons.filter((l) => l.isCompleted).length} /{' '}
              {course.lessons.length} complete
            </ThemedText>
          </View>

          {course.lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() =>
                router.push({
                  pathname: '/learn/lesson/[slug]',
                  params: { slug: lesson.slug },
                })
              }
              style={({ pressed }) => [
                styles.lessonRow,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText themeColor="textSecondary" style={styles.lessonIndex}>
                {String(lesson.sortOrder).padStart(2, '0')}
              </ThemedText>
              <View style={styles.lessonBody}>
                <ThemedText type="smallBold">{lesson.title}</ThemedText>
                {lesson.description ? (
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {lesson.description}
                  </ThemedText>
                ) : null}
              </View>
              {lesson.isCompleted ? (
                <Ionicons name="checkmark-circle" size={20} color={Brand.emerald} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function StreakCard({
  streak,
  checkedInToday,
  checkingIn,
  onCheckIn,
}: {
  streak: number;
  checkedInToday: boolean;
  checkingIn: boolean;
  onCheckIn: () => void;
}) {
  const theme = useTheme();
  const flameColor = streak > 0 ? Brand.amber : theme.textFaint;

  return (
    <ThemedView type="backgroundElement" style={styles.streakCard}>
      <View style={styles.streakTop}>
        <View style={styles.streakFlameWrap}>
          <Ionicons name="flame" size={34} color={flameColor} />
          <View>
            <ThemedText type="subtitle" style={styles.streakNumber}>
              {streak}
            </ThemedText>
            <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
              day{streak === 1 ? '' : 's'} streak
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onCheckIn}
        disabled={checkedInToday || checkingIn}
        style={({ pressed }) => [
          styles.primaryButton,
          {
            backgroundColor: checkedInToday
              ? 'rgba(18, 60, 62, 0.8)'
              : Brand.emerald,
          },
          pressed && styles.pressed,
        ]}
      >
        {checkingIn ? (
          <ActivityIndicator size="small" color="#061415" />
        ) : (
          <Text
            style={[
              styles.primaryButtonText,
              { color: checkedInToday ? theme.textSecondary : '#061415' },
            ]}
          >
            {checkedInToday ? 'Checked in today ✓' : 'Check in +10 XP'}
          </Text>
        )}
      </Pressable>
    </ThemedView>
  );
}

function toDateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
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
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.three,
    backgroundColor: '#041011',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123C3E',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: Spacing.three,
  },
  description: {
    marginTop: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  streakCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakFlameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  streakNumber: {
    lineHeight: 30,
    fontSize: 28,
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#061415',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
  },
  lessonIndex: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  lessonBody: {
    flex: 1,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  unenrollLink: {
    alignSelf: 'center',
    marginTop: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  unenrollText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.danger,
  },
});