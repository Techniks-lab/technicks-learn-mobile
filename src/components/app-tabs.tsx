import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const ANDROID_TAB_BAR_HEIGHT = 80;

export default function AppTabs() {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View style={styles.flex} collapsable={false}>
      <NativeTabs
        backgroundColor={colors.background}
        tintColor={colors.text}
        iconColor={{ default: colors.textFaint, selected: colors.text }}
        labelStyle={{
          default: { color: colors.textFaint },
          selected: { color: colors.text },
        }}
        disableIndicator
        rippleColor="transparent"
        labelVisibilityMode="labeled"
        shadowColor={colors.backgroundSelected}
        disableTransparentOnScrollEdge
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="rss_feed" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="learn">
          <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="graduationcap.fill" md="school" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="notifications">
          <NativeTabs.Trigger.Label>Notification</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="bell.fill" md="notifications" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="person" />
        </NativeTabs.Trigger>
      </NativeTabs>

      {/* Android's native tab bar has no top hairline — draw one above it.
          iOS uses the `shadowColor` prop on the native bar instead. */}
      {Platform.OS === 'android' && (
        <View
          pointerEvents="none"
          style={[
            styles.tabBarBorder,
            {
              backgroundColor: colors.backgroundSelected,
              bottom: ANDROID_TAB_BAR_HEIGHT + insets.bottom,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tabBarBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
});