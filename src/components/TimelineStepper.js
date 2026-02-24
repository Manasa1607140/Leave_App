import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../utils/theme';

const toneByStatus = (status) => {
  if (!status) return colors.muted;
  if (status === 'Approved' || status === 'Recommended' || status === 'Generated') return colors.success;
  if (status === 'Rejected') return colors.danger;
  if (status === 'Exited') return colors.navy;
  if (status === 'Pending' || status === 'NotGenerated' || status === 'NotScanned') return colors.warning;
  return colors.muted;
};

const TimelineStepper = ({ steps }) => (
  <View style={styles.container}>
    {steps.map((step, index) => {
      const color = toneByStatus(step.status);
      const isLast = index === steps.length - 1;
      return (
        <View key={`${step.label}-${index}`} style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.dot, { borderColor: color }]}>
              <View style={[styles.dotInner, { backgroundColor: color }]} />
            </View>
            {!isLast ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>{step.label}</Text>
            <Text style={[styles.status, { color }]}>{step.status || 'Pending'}</Text>
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    width: 18,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  status: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default React.memo(TimelineStepper);
