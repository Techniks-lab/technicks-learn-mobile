import { Ionicons } from '@expo/vector-icons';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TYPE_ICON: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const TYPE_COLOR: Record<ToastType, string> = {
  success: Brand.emerald,
  error: Brand.danger,
  info: Brand.blueGray,
};

let nextId = 1;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    setToasts((current) => [
      ...current,
      {
        id: nextId++,
        message,
        type: options?.type ?? 'info',
        duration: options?.duration ?? 2600,
      },
    ]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.stack, { top: insets.top + Spacing.two }]}
    >
      {toasts.map((toast) => (
        <ToastView key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

function ToastView({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const theme = useTheme();
  const [progress] = useState(() => new Animated.Value(0));
  const dismissed = useRef(false);

  const exit = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onDismiss(toast.id));
  }, [onDismiss, progress, toast.id]);

  useEffect(() => {
    Animated.spring(progress, {
      toValue: 1,
      damping: 18,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(exit, toast.duration);
    return () => clearTimeout(timer);
  }, [exit, progress, toast.duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });

  const background = theme.backgroundElement;
  const foreground = theme.text;
  const border = theme.backgroundSelected;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: background,
          borderColor: border,
          opacity: progress,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable style={styles.toastInner} onPress={exit} hitSlop={8}>
        <Ionicons name={TYPE_ICON[toast.type]} size={18} color={TYPE_COLOR[toast.type]} />
        <Text
          numberOfLines={2}
          style={[styles.toastText, { color: foreground }]}
        >
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    alignItems: 'center',
    zIndex: 3000,
  },
  toast: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: 'hidden',
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});