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

export default function SetUsernameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, setUsername } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();

  const [username, setUsernameValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const valid = USERNAME_REGEX.test(username) && username.length >= 3 && username.length <= 30;
  const checkQuery = useUsernameAvailable(username.toLowerCase(), valid);
  const available = checkQuery.data;

  const onChangeUsername = (value: string) => {
    setUsernameValue(value);
    setError(null);
  };

  const submit = useCallback(async () => {
    if (!valid || available !== true) return;
    setError(null);
    try {
      await withLoading(async () => {
        await setUsername(username.toLowerCase());
        showToast('Username set — welcome!', { type: 'success' });
      }, 'Saving username…');
      router.replace('/profile');
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e?.message ?? 'Could not set username.';
      setError(Array.isArray(message) ? message.join('\n') : String(message));
    }
  }, [username, valid, available, setUsername, withLoading, showToast, router]);

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.backgroundSelected }];

  let hint: React.ReactNode = null;
  if (!valid && username.length > 0) {
    hint = (
      <ThemedText type="small" style={styles.errorText}>
        3-30 characters, letters, numbers, and underscores only.
      </ThemedText>
    );
  } else if (checkQuery.isFetching) {
    hint = <ThemedText type="small" themeColor="textSecondary">Checking availability…</ThemedText>;
  } else if (available === true) {
    hint = <ThemedText type="small" style={styles.availableText}>@{username.toLowerCase()} is available</ThemedText>;
  } else if (available === false) {
    hint = <ThemedText type="small" style={styles.errorText}>That username is taken.</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.body}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Pick your username</ThemedText>
            <ThemedText themeColor="textSecondary">
              Step 3 of 3 — this is how the community will know you{user?.fullName ? `, ${user.fullName}` : ''}.
            </ThemedText>
          </View>

          {error && <ThemedText type="small" style={styles.errorText}>{error}</ThemedText>}

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

          {hint}

          <Pressable
            style={[styles.primaryButton, (!valid || available !== true) && styles.primaryButtonDisabled]}
            onPress={submit}
            disabled={!valid || available !== true}>
            <ThemedText style={styles.primaryButtonText}>Done</ThemedText>
          </Pressable>

          <Pressable onPress={() => router.replace('/profile')}>
            <ThemedText type="small" style={styles.switchText}>
              Skip for now — set it later from your profile
            </ThemedText>
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
    paddingTop: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    paddingBottom: Spacing.one,
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
  switchText: {
    textAlign: 'center',
  },
  errorText: {
    color: Brand.danger,
  },
  availableText: {
    color: Brand.brightGreen,
  },
});