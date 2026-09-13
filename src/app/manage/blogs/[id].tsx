import { useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  PostForm,
  PostFormHandle,
  PostFormValues,
} from '@/components/blog/post-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useBlogPost, useUpdatePost } from '@/hooks/use-blog';
import { useToast } from '@/providers/toast-provider';
import { useLoading } from '@/providers/loading-provider';

export default function EditBlogPostScreen() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { showToast } = useToast();
  const { withLoading } = useLoading();
  const updatePost = useUpdatePost();
  const postSlug = typeof slug === 'string' ? slug.trim() : '';
  const { data: post, isLoading, isError } = useBlogPost(
    postSlug,
    postSlug.length > 0,
  );
  const formRef = useRef<PostFormHandle>(null);

  const handleSubmit = async (values: PostFormValues) => {
    await withLoading(
      () => updatePost.mutateAsync({ id, input: values }),
      'Saving post…',
    );
    showToast(
      values.status === 'PUBLISHED' ? 'Post updated.' : 'Draft saved.',
      { type: 'success' },
    );
    router.back();
  };

  const submit = (status: PostFormValues['status']) =>
    formRef.current?.submit(status);

  const renderHeaderButton = (
    label: string,
    status: PostFormValues['status'],
    primary: boolean,
  ) => (
    <Pressable
      onPress={() => submit(status)}
      style={[
        styles.headerButton,
        primary && { backgroundColor: Brand.emerald },
      ]}
    >
      <ThemedText
        type="small"
        style={{
          color: primary ? '#061415' : theme.textSecondary,
          fontWeight: '700',
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  if (!postSlug || isError) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText themeColor="textSecondary">
            Could not load this post.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isLoading || !post) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Brand.emerald} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.backgroundSelected },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: theme.backgroundElement },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Edit post</ThemedText>
          <View style={styles.headerActions}>
            {renderHeaderButton('Draft', 'DRAFT', false)}
            {renderHeaderButton('Save', 'PUBLISHED', true)}
          </View>
        </View>
        <PostForm
          ref={formRef}
          initial={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? '',
            content: post.content,
            coverImage: post.coverImage ?? null,
            status: post.status,
            categoryIds: (post.categories ?? []).map((c) => c.id),
          }}
          onSubmit={handleSubmit}
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
    padding: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});