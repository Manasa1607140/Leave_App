import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../utils/theme';

const AppHeader = ({ title, subtitle, right, style }) => (
  <LinearGradient
    colors={['#FF7A00', '#FF4D00']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, style]}
  >
    <View style={styles.textBlock}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View style={styles.right}>{right}</View> : null}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textBlock: {
    flex: 1,
  },
  right: {
    marginLeft: spacing.md,
  },
  title: {
    fontSize: typography.titleLg,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: typography.labelSm,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default React.memo(AppHeader);
