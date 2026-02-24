import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../utils/theme';

const colorByStatus = (status) => {
  if (!status) return colors.muted;
  if (status === 'Approved' || status === 'Recommended' || status === 'Generated') return colors.success;
  if (status === 'Rejected') return colors.danger;
  if (status === 'Exited') return colors.navy;
  if (status === 'Pending' || status === 'NotGenerated' || status === 'NotScanned') return colors.warning;
  return colors.muted;
};

const backgroundByStatus = (status) => {
  const color = colorByStatus(status);
  if (color === colors.success) return '#E8F9EE';
  if (color === colors.danger) return '#FDECEC';
  if (color === colors.warning) return '#FFF3DF';
  if (color === colors.navy) return '#EEF2F7';
  return '#F3F5F7';
};

const StatusChip = ({ label, status }) => (
  <View
    style={[
      styles.chip,
      { borderColor: colorByStatus(status), backgroundColor: backgroundByStatus(status) },
    ]}
  >
    <View style={[styles.dot, { backgroundColor: colorByStatus(status) }]} />
    <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default React.memo(StatusChip);
