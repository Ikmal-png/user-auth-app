import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

// `variant="link"` renders a plain text button for "Go to Signup"-style actions.
export default function PrimaryButton({ title, onPress, loading = false, variant = 'solid' }) {
  const isLink = variant === 'link';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        isLink ? styles.link : styles.solid,
        !isLink && pressed && { backgroundColor: colors.primaryPressed },
        isLink && pressed && { opacity: 0.6 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={isLink ? styles.linkText : styles.solidText}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  solid: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  solidText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  linkText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
