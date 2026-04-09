import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'karaoke' | 'results';
}

export function GradientBackground({ children, variant = 'default' }: GradientBackgroundProps) {
  const gradientColors = {
    default: [colors.gradientStart, colors.gradientMid, colors.gradientEnd] as const,
    karaoke: ['#2d0a3e', '#4a1259', '#1a0533'] as const,
    results: ['#0a2342', '#1a0533', '#0d0d2b'] as const,
  };

  return (
    <LinearGradient
      colors={gradientColors[variant] as unknown as string[]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
