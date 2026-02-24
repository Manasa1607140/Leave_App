import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../utils/theme';

const SritInfoStrip = () => (
  <View style={styles.container}>
    <View style={styles.item}>
      <Ionicons name="call-outline" size={12} color={colors.accent} />
      <Text style={styles.text}>+91 8571 29 7777</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.item}>
      <Ionicons name="mail-outline" size={12} color={colors.accent} />
      <Text style={styles.text}>principal@srit.ac.in</Text>
    </View>
    <View style={styles.titleWrap}>
      <Text style={styles.title}>SRIT Leave Portal</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  titleWrap: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '700',
  },
});

export default React.memo(SritInfoStrip);
