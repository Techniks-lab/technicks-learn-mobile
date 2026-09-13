import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps
  extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string | null;
  /** Optional helper text shown under the input when no error */
  hint?: string;
  /** Optional leading Ionicons icon name */
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  /** Optional trailing icon that acts as a button */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingIconPress?: () => void;
  /** Optional character counter shown on the right (e.g. bio) */
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      onChangeText,
      label,
      error,
      hint,
      leadingIcon,
      trailingIcon,
      onTrailingIconPress,
      showCharacterCount = false,
      maxLength,
      editable = true,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? '#EF4444'
      : focused
        ? theme.text
        : theme.backgroundSelected;

    return (
      <View style={styles.wrapper}>
        {label ? (
          <ThemedText type="smallBold" style={styles.label}>
            {label}
          </ThemedText>
        ) : null}

        <View
          style={[
            styles.inputRow,
            {
              borderColor,
              backgroundColor: theme.background,
              opacity: editable ? 1 : 0.6,
            },
          ]}
        >
          {leadingIcon ? (
            <Ionicons
              name={leadingIcon}
              size={18}
              color={theme.textSecondary}
              style={styles.leadingIcon}
            />
          ) : null}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            editable={editable}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={maxLength}
            {...rest}
          />

          {trailingIcon ? (
            <Pressable
              onPress={onTrailingIconPress}
              hitSlop={10}
              disabled={!onTrailingIconPress}
              style={styles.trailingButton}
            >
              <Ionicons
                name={trailingIcon}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Bottom row: error / hint / character count */}
        {error ? (
          <ThemedText type="small" style={styles.errorText}>
            {error}
          </ThemedText>
        ) : hint ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            {hint}
          </ThemedText>
        ) : null}

        {showCharacterCount && maxLength ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.counter}
          >
            {value.length}/{maxLength}
          </ThemedText>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  leadingIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  trailingButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 6,
  },
  hint: {
    marginTop: 6,
  },
  counter: {
    marginTop: 4,
    textAlign: 'right',
  },
});