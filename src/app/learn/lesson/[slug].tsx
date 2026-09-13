import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
import { useCompleteLesson, useLesson } from '@/hooks/use-learn';
import type { LessonBlock } from '@/lib/learn-api';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/providers/toast-provider';

export default function LessonScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const { data: lesson, isLoading } = useLesson(slug ?? '');
  const completeLesson = useCompleteLesson();

  const handleComplete = useCallback(() => {
    if (!slug) return;
    if (!isAuthenticated) {
      Alert.alert(
        'Sign up to earn XP',
        'Completing lessons and earning XP require an account.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/sign-up') },
        ],
      );
      return;
    }
    completeLesson.mutate(slug, {
      onSuccess: (res) => {
        showToast(
          res.xpAwarded > 0
            ? `Lesson complete! +${res.xpAwarded} XP`
            : 'Lesson already completed',
          { type: res.xpAwarded > 0 ? 'success' : 'info' },
        );
      },
      onError: (error) => {
        const status = (error as { response?: { status?: number } })
          ?.response?.status;
        if (status === 401) {
          showToast('Session expired. Please sign in again.', {
            type: 'error',
          });
        } else if (status === 403) {
          showToast('Enroll in this course to unlock lessons.', {
            type: 'info',
          });
        } else {
          showToast('Could not complete the lesson. Please try again.', {
            type: 'error',
          });
        }
      },
    });
  }, [slug, isAuthenticated, router, completeLesson, showToast]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!lesson) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Lesson not found.</ThemedText>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link" style={{ marginTop: Spacing.two }}>
            Go back
          </ThemedText>
        </Pressable>
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
            Lesson
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="subtitle" style={styles.title}>
            {lesson.title}
          </ThemedText>
          {lesson.description ? (
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {lesson.description}
            </ThemedText>
          ) : null}

          <View style={styles.blocks}>
            {lesson.blocks.map((block) => (
              <LessonBlockView key={block.id} block={block} />
            ))}
          </View>

          <Pressable
            onPress={handleComplete}
            disabled={lesson.isCompleted || completeLesson.isPending}
            style={({ pressed }) => [
              styles.completeButton,
              {
                backgroundColor: lesson.isCompleted
                  ? theme.backgroundSelected
                  : Brand.emerald,
              },
              pressed && styles.pressed,
            ]}
          >
            {completeLesson.isPending ? (
              <ActivityIndicator size="small" color="#061415" />
            ) : lesson.isCompleted ? (
              <Text style={[styles.completeText, { color: theme.textSecondary }]}>
                Completed ✓
              </Text>
            ) : (
              <Text style={styles.completeText}>Mark complete +25 XP</Text>
            )}
          </Pressable>

          {!lesson.isCompleted ? (
            <ThemedText
              type="small"
              themeColor="textFaint"
              style={styles.completeHint}
            >
              Complete the lesson to earn XP and climb the weekly leaderboard.
            </ThemedText>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case 'HEADING':
      return (
        <ThemedText type="subtitle" style={styles.heading}>
          {block.text}
        </ThemedText>
      );
    case 'TEXT':
      return (
        <ThemedText style={styles.paragraph}>{block.text}</ThemedText>
      );
    case 'IMAGE':
      return (
        <View style={styles.mediaBlock}>
          {block.url ? (
            <Image
              source={{ uri: block.url }}
              style={styles.media}
              contentFit="cover"
              transition={300}
              accessibilityLabel={block.caption ?? block.text ?? 'Lesson image'}
            />
          ) : null}
          {block.caption ? (
            <ThemedText type="small" themeColor="textFaint" style={styles.caption}>
              {block.caption}
            </ThemedText>
          ) : null}
        </View>
      );
    case 'VIDEO':
      return <VideoBlock key={block.id} block={block} />;
    default:
      return null;
  }
}

function VideoBlock({ block }: { block: LessonBlock }) {
  const player = useVideoPlayer(block.url ?? '', (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <View style={styles.mediaBlock}>
      {block.url ? (
        <VideoView
          player={player}
          style={styles.media}
          nativeControls
          contentFit="contain"
          surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
        />
      ) : null}
      {block.caption ? (
        <ThemedText type="small" themeColor="textFaint" style={styles.caption}>
          {block.caption}
        </ThemedText>
      ) : null}
    </View>
  );
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
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  description: {
    marginTop: Spacing.two,
  },
  blocks: {
    marginTop: Spacing.four,
  },
  heading: {
    fontSize: 20,
    lineHeight: 28,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  paragraph: {
    marginBottom: Spacing.two,
  },
  mediaBlock: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.two,
    backgroundColor: '#041011',
  },
  caption: {
    marginTop: Spacing.one,
  },
  completeButton: {
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    marginTop: Spacing.four,
  },
  completeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#061415',
  },
  completeHint: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});