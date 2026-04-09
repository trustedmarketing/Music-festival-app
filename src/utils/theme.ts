import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTV = Platform.isTV || Platform.OS === 'web';
export const isTablet = width >= 768;

export const colors = {
  // Gradient backgrounds
  gradientStart: '#1a0533',
  gradientMid: '#2d1b69',
  gradientEnd: '#0d0d2b',

  // Primary palette
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6D28D9',

  // Accent colors
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  surprise: '#EF4444',
  surpriseGlow: '#FCA5A5',

  // Neutrals
  white: '#FFFFFF',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  // Cards / surfaces
  cardBg: 'rgba(139, 92, 246, 0.15)',
  cardBorder: 'rgba(139, 92, 246, 0.3)',
  cardSelected: 'rgba(245, 158, 11, 0.2)',
  cardSelectedBorder: '#F59E0B',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  karaoke: '#EC4899',

  // Budget
  budgetGood: '#10B981',
  budgetWarning: '#F59E0B',
  budgetLow: '#EF4444',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const spacing = {
  xs: isTV ? 8 : 4,
  sm: isTV ? 12 : 8,
  md: isTV ? 20 : 16,
  lg: isTV ? 28 : 24,
  xl: isTV ? 40 : 32,
  xxl: isTV ? 56 : 48,
};

export const fontSize = {
  xs: isTV ? 16 : 12,
  sm: isTV ? 20 : 14,
  md: isTV ? 24 : 16,
  lg: isTV ? 30 : 20,
  xl: isTV ? 40 : 28,
  xxl: isTV ? 52 : 36,
  xxxl: isTV ? 72 : 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
