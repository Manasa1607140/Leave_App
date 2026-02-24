import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusChip from './StatusChip';
import { spacing, colors } from '../utils/theme';

const Timeline = ({ request }) => {
  if (!request) return null;
  const steps = [
    { label: 'Sent', status: 'Approved' },
    { label: 'Counselor', status: request.counselorStatus },
    { label: 'HOD', status: request.hodStatus },
    { label: 'QR', status: request.qrStatus },
    { label: 'Gate', status: request.gateStatus },
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View style={styles.step} key={`${step.label}-${index}`}>
          <StatusChip label={step.label} status={step.status} />
          {index < steps.length - 1 ? <Text style={styles.arrow}>-></Text> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginRight: spacing.xs,
    color: colors.muted,
    fontSize: 12,
  },
});

export default React.memo(Timeline);
