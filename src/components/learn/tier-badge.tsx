import { StyleSheet, Text } from 'react-native';

import { Brand } from '@/constants/theme';
import type { CompetitionTier } from '@/lib/gamification-api';

export const TIER_META: Record<
  CompetitionTier,
  { label: string; color: string; bg: string }
> = {
  GOLD: { label: 'Gold', color: Brand.gold, bg: 'rgba(255, 212, 90, 0.12)' },
  SILVER: {
    label: 'Silver',
    color: '#C9D2DA',
    bg: 'rgba(201, 210, 218, 0.10)',
  },
  BRONZE: { label: 'Bronze', color: '#D89A6A', bg: 'rgba(216, 154, 106, 0.12)' },
};

export function TierBadge({ tier }: { tier: CompetitionTier }) {
  const meta = TIER_META[tier];
  return (
    <Text style={[styles.badge, { color: meta.color, backgroundColor: meta.bg }]}>
      {meta.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
});