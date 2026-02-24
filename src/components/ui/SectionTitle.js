import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../utils/theme';

const SectionTitle = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: typography.labelMd,
    fontWeight: '800',
    color: colors.text,
  },
});

export default React.memo(SectionTitle);
