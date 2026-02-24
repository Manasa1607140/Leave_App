import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PressableScale from '../PressableScale';
import { colors, spacing } from '../../utils/theme';

const PillTabs = ({ tabs, activeKey, onChange, style }) => (
  <View style={[styles.container, style]}>
    {tabs.map((tab) => {
      const isActive = tab.key === activeKey;
      return (
        <PressableScale key={tab.key} onPress={() => onChange(tab.key)}>
          <View style={[styles.pill, isActive && styles.pillActive]}>
            <Text style={[styles.text, isActive && styles.textActive]}>{tab.label}</Text>
          </View>
        </PressableScale>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pillActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  textActive: {
    color: colors.accentDeep,
  },
});

export default React.memo(PillTabs);
