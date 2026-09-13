import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const BlogCardSkeleton: React.FC = () => {
  const [opacity] = useState(() => new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.header}>
        <View style={styles.subreddit} />
        <View style={styles.meta} />
      </View>
      <View style={styles.title} />
      <View style={styles.titleShort} />
      <View style={styles.bodyRow}>
        <View style={styles.excerptBlock}>
          <View style={styles.excerpt} />
          <View style={styles.excerptShort} />
        </View>
        <View style={styles.thumbnail} />
      </View>
      <View style={styles.footer}>
        <View style={styles.stat} />
        <View style={styles.reading} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#082526',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  subreddit: {
    width: 90,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
  meta: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
  title: {
    width: '92%',
    height: 20,
    borderRadius: 6,
    backgroundColor: '#0E3234',
    marginBottom: 8,
  },
  titleShort: {
    width: '55%',
    height: 20,
    borderRadius: 6,
    backgroundColor: '#0E3234',
    marginBottom: 12,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  excerptBlock: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  excerpt: {
    width: '100%',
    height: 14,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
  excerptShort: {
    width: '70%',
    height: 14,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#0E3234',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#164143',
  },
  stat: {
    width: 110,
    height: 16,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
  reading: {
    width: 70,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0E3234',
  },
});