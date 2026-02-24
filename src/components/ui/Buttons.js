import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PressableScale from '../PressableScale';
import { colors, spacing } from '../../utils/theme';

const BaseButton = ({ label, onPress, style, textStyle, variant = 'primary' }) => {
  const variantStyle = stylesByVariant[variant] || stylesByVariant.primary;
  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.button, variantStyle.button, style]}>
        <Text style={[styles.text, variantStyle.text, textStyle]}>{label}</Text>
      </View>
    </PressableScale>
  );
};

const PrimaryButton = (props) => <BaseButton {...props} variant="primary" />;
const SecondaryButton = (props) => <BaseButton {...props} variant="secondary" />;
const DangerButton = (props) => <BaseButton {...props} variant="danger" />;

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

const stylesByVariant = {
  primary: {
    button: { backgroundColor: colors.primary },
    text: { color: '#FFFFFF' },
  },
  secondary: {
    button: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.primary },
    text: { color: colors.primary },
  },
  danger: {
    button: { backgroundColor: colors.danger },
    text: { color: '#FFFFFF' },
  },
};

export { PrimaryButton, SecondaryButton, DangerButton };
