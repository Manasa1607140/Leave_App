import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../../utils/theme';

const Card = ({ children, style, accent = false }) => (
  <View style={[styles.card, style]}>
    {accent ? <View style={styles.accentStrip} /> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow,
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.primary,
  },
});

export default React.memo(Card);
