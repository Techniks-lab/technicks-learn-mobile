import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBlogCategories } from '@/hooks/use-blog';
import { useTheme } from '@/hooks/use-theme';

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: PostStatus;
  categoryIds: string[];
}

export interface PostFormHandle {
  submit: (status: PostStatus) => Promise<void>;
}

interface PostFormProps {
  initial?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => Promise<void>;
}

const EXCERPT_LIMIT = 160;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildExcerpt(body: string): string {
  const cleaned = body.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= EXCERPT_LIMIT) return cleaned;
  const cut = cleaned.slice(0, EXCERPT_LIMIT);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
}

export const PostForm = forwardRef<PostFormHandle, PostFormProps>(
  ({ initial, onSubmit }, ref) => {
    const theme = useTheme();
    const { data: categories = [] } = useBlogCategories();

    const [title, setTitle] = useState(initial?.title ?? '');
    const [content, setContent] = useState(initial?.content ?? '');
    const [coverImage, setCoverImage] = useState<string | null>(
      initial?.coverImage ?? null,
    );
    const [categoryIds, setCategoryIds] = useState<string[]>(
      initial?.categoryIds ?? [],
    );
    const [error, setError] = useState<string | null>(null);
    const submittingRef = useRef(false);

    const toggleCategory = (id: string) => {
      setCategoryIds((current) =>
        current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id],
      );
    };

    const pickCoverImage = async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setError('Photo library access is required to pick a cover image.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
          setCoverImage(result.assets[0].uri);
          setError(null);
        }
      } catch (e: any) {
        setError(e?.message ?? 'Could not pick an image.');
      }
    };

    const doSubmit = useCallback(
      async (status: PostStatus) => {
        if (submittingRef.current) return;
        if (!title.trim()) {
          setError('Title is required.');
          return;
        }
        if (!content.trim()) {
          setError('Content is required.');
          return;
        }
        setError(null);
        submittingRef.current = true;
        try {
          await onSubmit({
            title: title.trim(),
            slug: slugify(title),
            excerpt: buildExcerpt(content),
            content,
            coverImage: null,
            status,
            categoryIds,
          });
        } catch (e: any) {
          const message =
            e?.response?.data?.message ?? e?.message ?? 'Something went wrong.';
          const text = Array.isArray(message)
            ? message.join('\n')
            : String(message);
          setError(text);
          submittingRef.current = false;
        }
      },
      [onSubmit, title, content, categoryIds],
    );

    useImperativeHandle(ref, () => ({ submit: doSubmit }), [doSubmit]);

    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.wrapper}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textFaint}
            maxLength={200}
            style={[styles.titleInput, { color: theme.text }]}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Share your knowledge…"
            placeholderTextColor={theme.textFaint}
            style={[styles.bodyInput, { color: theme.text }]}
            textAlignVertical="top"
          />

          {error ? (
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}

          <View
            style={[
              styles.panel,
              { borderTopColor: theme.backgroundSelected },
            ]}
          >
            <ThemedText type="smallBold" style={styles.panelLabel}>
              Cover image
            </ThemedText>
            <Pressable
              onPress={pickCoverImage}
              style={[
                styles.coverPicker,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                },
              ]}
            >
              {coverImage ? (
                <Image
                  source={{ uri: coverImage }}
                  style={styles.coverPreview}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Ionicons
                    name="image-outline"
                    size={22}
                    color={theme.textSecondary}
                  />
                  <ThemedText type="small" themeColor="textSecondary">
                    Tap to add a cover image
                  </ThemedText>
                </View>
              )}
            </Pressable>
            {coverImage ? (
              <Pressable onPress={() => setCoverImage(null)} hitSlop={8}>
                <ThemedText type="small" style={styles.removeCover}>
                  Remove cover image
                </ThemedText>
              </Pressable>
            ) : null}

            {categories.length > 0 && (
              <>
                <ThemedText type="smallBold" style={styles.panelLabel}>
                  Categories
                </ThemedText>
                <View style={styles.categoryRow}>
                  {categories.map((cat) => {
                    const active = categoryIds.includes(cat.id);
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => toggleCategory(cat.id)}
                        style={[
                          styles.categoryChip,
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
                            color: active
                              ? '#061415'
                              : theme.textSecondary,
                            fontWeight: '600',
                          }}
                        >
                          {cat.name}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  panel: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  panelLabel: {
    letterSpacing: 0.3,
  },
  coverPicker: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: 140,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coverPreview: {
    flex: 1,
    width: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  removeCover: {
    color: Brand.danger,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  errorText: {
    color: Brand.danger,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
});

PostForm.displayName = 'PostForm';