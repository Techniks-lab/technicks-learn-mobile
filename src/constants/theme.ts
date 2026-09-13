/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Technicks Learn brand theme — a dark, energetic tech-learning palette.
// Deep charcoal + dark teal surfaces, with green as the action colour and
// amber used sparingly for personality.
const brandTheme = {
  text: '#F3F7F5',
  textSecondary: '#91B0C5',
  textFaint: '#687F8A',
  background: '#061415',
  backgroundElement: '#082526',
  backgroundSelected: '#123C3E',
} as const;

export const Colors = {
  light: brandTheme,
  dark: brandTheme,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Brand accents — shared across modes. Green is the primary/action colour;
// amber is reserved for emphasis, icons and personality.
export const Brand = {
  emerald: '#18C978',
  brightGreen: '#39E58A',
  lime: '#A8E84D',
  amber: '#F5B82E',
  gold: '#FFD45A',
  blueGray: '#91B0C5',
  offWhite: '#F3F7F5',
  mutedGray: '#687F8A',
  danger: '#EF4444',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
