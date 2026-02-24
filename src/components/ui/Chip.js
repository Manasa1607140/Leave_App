import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/theme';

const Chip = ({ label, tone = 'default', style }) => {
  const toneStyles = stylesByTone[tone] || stylesByTone.default;
  return (
    <View style={[styles.chip, toneStyles, style]}>
      <Text style={[styles.text, toneStyles.text]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});

const stylesByTone = {
  default: {
    backgroundColor: '#F3F5F7',
    borderColor: colors.border,
    text: { color: colors.text },
  },
  info: {
    backgroundColor: colors.accentSoft,
    borderColor: '#BDECF4',
    text: { color: colors.accentDeep },
  },
  success: {
    backgroundColor: '#E8F9EE',
    borderColor: '#CFF2DC',
    text: { color: colors.success },
  },
  warning: {
    backgroundColor: '#FFF3DF',
    borderColor: '#F9E0B6',
    text: { color: colors.warning },
  },
  danger: {
    backgroundColor: '#FDECEC',
    borderColor: '#F7CFCF',
    text: { color: colors.danger },
  },
};

export default React.memo(Chip);
