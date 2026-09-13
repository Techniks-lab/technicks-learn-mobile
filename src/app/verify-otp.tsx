import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useLoading } from '@/providers/loading-provider';
import { useToast } from '@/providers/toast-provider';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { devOtp } = useLocalSearchParams<{ devOtp?: string }>();
  const { status, user, verifyEmail, resendCode } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();

  const [otp, setOtp] = useState(devOtp ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'loading' && user?.isVerified) {
      router.replace('/set-username');
    }
  }, [status, user, router]);

  const submit = async () => {
    if (!user) return;
    setError(null);
    try {
      await withLoading(() => verifyEmail(otp.trim()), 'Verifying code…');
      showToast('Email verified — one last step', { type: 'success' });
      router.replace('/set-username');
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e?.message ?? 'Invalid code.';
      setError(Array.isArray(message) ? message.join('\n') : String(message));
    }
  };

  const resend = async () => {
    setError(null);
    try {
      await withLoading(() => resendCode(), 'Sending a new code…');
      showToast('A new code has been sent', { type: 'success' });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not resend the code.');
    }
  };

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.backgroundSelected }];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.body}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Check your email</ThemedText>
            <ThemedText themeColor="textSecondary">
              Step 2 of 3 — enter the 6-digit code sent to{' '}
              <ThemedText type="smallBold">{user?.email ?? 'your email'}</ThemedText>
            </ThemedText>
          </View>

          {error && <ThemedText type="small" style={styles.errorText}>{error}</ThemedText>}

          {devOtp ? (
            <ThemedText type="small" themeColor="textSecondary">
              Development build: your code is {devOtp}
            </ThemedText>
          ) : null}

          {status === 'loading' || !user ? (
            <ActivityIndicator size="large" style={styles.spinner} />
          ) : (
            <>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit code"
                placeholderTextColor={theme.textSecondary}
                style={inputStyle}
                keyboardType="number-pad"
                maxLength={6}
              />

              <Pressable style={styles.primaryButton} onPress={submit} disabled={otp.length < 6}>
                <ThemedText style={styles.primaryButtonText}>Verify</ThemedText>
              </Pressable>

              <Pressable onPress={resend}>
                <ThemedText type="link" style={styles.resendLink}>Resend code</ThemedText>
              </Pressable>
            </>
          )}
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
  spinner: {
    marginTop: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
    letterSpacing: Spacing.two,
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  primaryButton: {
    backgroundColor: Brand.emerald,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#061415',
    fontSize: 16,
    fontWeight: '700',
  },
  resendLink: {
    textAlign: 'center',
  },
  errorText: {
    color: Brand.danger,
  },
});