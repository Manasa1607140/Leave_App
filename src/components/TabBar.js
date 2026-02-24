import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PressableScale from './PressableScale';
import { colors, spacing } from '../utils/theme';

const TabBar = ({ tabs, activeTab, onChange }) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
        <PressableScale key={tab.key} onPress={() => onChange(tab.key)}>
          <View style={[styles.tab, isActive && styles.tabActive]}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </View>
        </PressableScale>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.xs,
  },
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: colors.accentDeep,
  },
});

export default React.memo(TabBar);
