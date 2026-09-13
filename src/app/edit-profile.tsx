import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth, useUsernameAvailable } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useLoading } from '@/providers/loading-provider';
import { useToast } from '@/providers/toast-provider';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();

  const currentName = user?.fullName ?? '';
  const currentUsername = user?.username ?? '';

  const [displayName, setDisplayName] = useState(currentName);
  const [username, setUsernameValue] = useState(currentUsername);
  const [error, setError] = useState<string | null>(null);

  const nameValid = displayName.trim().length <= 200;
  const usernameChanged =
    username.length > 0 && username.toLowerCase() !== currentUsername.toLowerCase();
  const usernameValid =
    USERNAME_REGEX.test(username) && username.length >= 3 && username.length <= 30;

  const checkQuery = useUsernameAvailable(
    username.toLowerCase(),
    usernameChanged && usernameValid,
  );
  const available = usernameChanged ? checkQuery.data : true;

  const hasChanges = displayName.trim() !== currentName || usernameChanged;
  const canSave =
    hasChanges && nameValid && (!usernameChanged || (usernameValid && available === true));

  const onChangeName = (value: string) => {
    setDisplayName(value);
    setError(null);
  };

  const onChangeUsername = (value: string) => {
    setUsernameValue(value);
    setError(null);
  };

  const submit = useCallback(async () => {
    if (!canSave) return;
    setError(null);
    try {
      await withLoading(async () => {
        const input: { fullName?: string; username?: string } = {};
        if (displayName.trim() !== currentName) {
          input.fullName = displayName.trim();
        }
        if (usernameChanged) {
          input.username = username.toLowerCase();
        }
        if (Object.keys(input).length === 0) return;
        await updateProfile(input);
        showToast('Profile updated.', { type: 'success' });
      }, 'Saving…');
      router.back();
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? e?.message ?? 'Could not update profile.';
      setError(Array.isArray(message) ? message.join('\n') : String(message));
    }
  }, [
    canSave,
    displayName,
    currentName,
    usernameChanged,
    username,
    updateProfile,
    withLoading,
    showToast,
    router,
  ]);

  const inputStyle = [
    styles.input,
    { color: theme.text, borderColor: theme.backgroundSelected },
  ];

  let usernameHint: React.ReactNode = null;
  if (username.length > 0 && !usernameValid) {
    usernameHint = (
      <ThemedText type="small" style={styles.errorText}>
        3-30 characters, letters, numbers, and underscores only.
      </ThemedText>
    );
  } else if (usernameChanged && checkQuery.isFetching) {
    usernameHint = (
      <ThemedText type="small" themeColor="textSecondary">
        Checking availability…
      </ThemedText>
    );
  } else if (usernameChanged && available === true) {
    usernameHint = (
      <ThemedText type="small" style={styles.availableText}>
        @{username.toLowerCase()} is available
      </ThemedText>
    );
  } else if (usernameChanged && available === false) {
    usernameHint = (
      <ThemedText type="small" style={styles.errorText}>
        That username is taken.
      </ThemedText>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </Pressable>
            <ThemedText type="subtitle">Edit profile</ThemedText>
          </View>

          {error && (
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          )}

          <View style={styles.field}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Display name
            </ThemedText>
            <TextInput
              value={displayName}
              onChangeText={onChangeName}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              autoCapitalize="words"
              maxLength={200}
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Username
            </ThemedText>
            <TextInput
              value={username}
              onChangeText={onChangeUsername}
              placeholder="username"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              maxLength={30}
            />
            {usernameHint}
          </View>

          <Pressable
            style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
            onPress={submit}
            disabled={!canSave}
          >
            <ThemedText style={styles.primaryButtonText}>Save changes</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  backButton: {
    padding: Spacing.one,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Brand.emerald,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#061415',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: Brand.danger,
  },
  availableText: {
    color: Brand.brightGreen,
  },
});