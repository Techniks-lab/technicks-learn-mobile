import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export interface PasswordInputProps extends Omit<
  TextInputProps,
  "secureTextEntry" | "style"
> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string | null;
  /** Show a strength meter under the input (0-4 score) */
  showStrength?: boolean;
  /** Minimum length for validation hint. Default 8 */
  minLength?: number;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    {
      value,
      onChangeText,
      label = "Password",
      error,
      showStrength = false,
      minLength = 8,
      editable = true,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    const strength = useMemo(() => getPasswordStrength(value), [value]);

    const borderColor = error
      ? "#EF4444"
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
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={theme.textSecondary}
            style={styles.leadingIcon}
          />

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            secureTextEntry={!visible}
            editable={editable}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            {...rest}
          />

          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={10}
            style={styles.trailingButton}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        {error ? (
          <ThemedText type="small" style={styles.errorText}>
            {error}
          </ThemedText>
        ) : null}

        {showStrength && value.length > 0 && !error ? (
          <View style={styles.strengthBlock}>
            <View style={styles.strengthBars}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.strengthBar,
                    {
                      backgroundColor:
                        i < strength.score
                          ? strength.color
                          : theme.backgroundSelected,
                    },
                  ]}
                />
              ))}
            </View>
            <ThemedText
              type="small"
              style={[styles.strengthLabel, { color: strength.color }]}
            >
              {strength.label}
            </ThemedText>
          </View>
        ) : null}

        {showStrength && value.length > 0 && value.length < minLength ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.hint}
          >
            At least {minLength} characters
          </ThemedText>
        ) : null}
      </View>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

// ---------- Strength logic ----------

interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): Strength {
  if (!password) {
    return { score: 0, label: "", color: "#687F8A" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const capped = Math.min(score, 4) as Strength["score"];

  const map: Record<Strength["score"], Omit<Strength, "score">> = {
    0: { label: "Too short", color: "#EF4444" },
    1: { label: "Weak", color: "#EF4444" },
    2: { label: "Fair", color: "#F5B82E" },
    3: { label: "Good", color: "#18C978" },
    4: { label: "Strong", color: "#39E58A" },
  };

  return { score: capped, ...map[capped] };
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.two,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#EF4444",
    marginTop: 6,
  },
  strengthBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 50,
    textAlign: "right",
  },
  hint: {
    marginTop: 4,
  },
});
