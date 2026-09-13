import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface LoadingContextValue {
  isLoading: boolean;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(task: () => Promise<T>, text?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

interface LoadingState {
  count: number;
  text?: string;
}

export function LoadingProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<LoadingState>({ count: 0 });

  const showLoading = useCallback((label?: string) => {
    setState((s) => ({ count: s.count + 1, text: label }));
  }, []);

  const hideLoading = useCallback(() => {
    setState((s) => {
      const count = Math.max(0, s.count - 1);
      return { count, text: count === 0 ? undefined : s.text };
    });
  }, []);

  const withLoading = useCallback(
    async <T,>(task: () => Promise<T>, label?: string): Promise<T> => {
      showLoading(label);
      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const isLoading = state.count > 0;

  const value = useMemo(
    () => ({ isLoading, showLoading, hideLoading, withLoading }),
    [isLoading, showLoading, hideLoading, withLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading ? <LoadingOverlay text={state.text} /> : null}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within <LoadingProvider>');
  return ctx;
}

function LoadingOverlay({ text }: { text?: string }) {
  const theme = useTheme();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <ActivityIndicator size="large" color={theme.text} />
        {text ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.text}
          >
            {text}
          </ThemedText>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5000,
  },
  card: {
    borderRadius: 16,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    minWidth: 160,
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    textAlign: 'center',
  },
});