import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Brand } from '@/constants/theme';
import { LoadingProvider } from '@/providers/loading-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';

SplashScreen.preventAutoHideAsync();
void SystemUI.setBackgroundColorAsync('#061415');

// The Technicks Learn brand is a fixed dark theme (deep charcoal + dark teal +
// green/amber accents), so navigation chrome always uses it regardless of the
// system scheme.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Brand.emerald,
    background: '#061415',
    card: '#082526',
    text: '#F3F7F5',
    border: '#123C3E',
    notification: Brand.emerald,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navTheme}>
      <AnimatedSplashOverlay />
      <QueryProvider>
        <LoadingProvider>
          <ToastProvider>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: '#061415' },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="blog/[slug]" options={{ headerShown: false }} />
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
              <Stack.Screen name="verify-otp" options={{ title: 'Verify email' }} />
              <Stack.Screen name="set-username" options={{ title: 'Choose a username' }} />
              <Stack.Screen name="manage/blogs" options={{ headerShown: false }} />
              <Stack.Screen name="learn/lesson/[slug]" options={{ headerShown: false }} />
              <Stack.Screen name="learn/course/[slug]" options={{ headerShown: false }} />
              <Stack.Screen name="learn/leaderboard" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
        </LoadingProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}