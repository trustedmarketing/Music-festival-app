import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors, borderRadius } from '../utils/theme';

// Wrapper component for Apple TV / Android TV focus states
// Provides visual focus indicators for remote/controller navigation

interface TVFocusWrapperProps {
  children: ReactNode;
  style?: any;
}

export function TVFocusWrapper({ children, style }: TVFocusWrapperProps) {
  const [isFocused, setIsFocused] = useState(false);

  if (!Platform.isTV) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View
      style={[
        style,
        isFocused && styles.focused,
      ]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  focused: {
    borderWidth: 3,
    borderColor: colors.accentLight,
    borderRadius: borderRadius.lg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
});
