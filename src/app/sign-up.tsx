import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useLoading } from '@/providers/loading-provider';
import { useToast } from '@/providers/toast-provider';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Refs for focus flow
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const submit = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      const result = await withLoading(async () => {
        const res = await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim() || undefined,
        });
        showToast(
          'Account created — check your email for the verification code',
          { type: 'success' },
        );
        return res;
      }, 'Creating your account…');
      router.replace({
        pathname: '/verify-otp',
        params: { devOtp: result.devOtp ?? '' },
      });
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? e?.message ?? 'Something went wrong.';
      setError(Array.isArray(message) ? message.join('\n') : String(message));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="subtitle">Create your account</ThemedText>
            <ThemedText themeColor="textSecondary">
              Step 1 of 3 — account details
            </ThemedText>
          </View>

          <View style={styles.form}>
            {error && (
              <ThemedText type="small" style={styles.errorText}>
                {error}
              </ThemedText>
            )}

            <Input
              value={fullName}
              onChangeText={setFullName}
              label="Full name"
              placeholder="Jane Doe"
              leadingIcon="person-outline"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <Input
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              label="Email"
              placeholder="you@example.com"
              leadingIcon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <PasswordInput
              ref={passwordRef}
              value={password}
              onChangeText={setPassword}
              label="Password"
              showStrength
              minLength={8}
              textContentType="newPassword"
              autoComplete="password-new"
              returnKeyType="go"
              onSubmitEditing={submit}
            />

            <Pressable
              style={styles.primaryButton}
              onPress={submit}
            >
              <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <ThemedText type="small" style={styles.switchText}>
                Already have an account? Log in
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  header: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  form: {
    gap: Spacing.three,
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
  errorText: {
    color: Brand.danger,
  },
});