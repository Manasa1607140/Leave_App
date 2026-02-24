import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, spacing } from '../utils/theme';

const items = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'notifications', label: 'Notification', icon: 'notifications-outline' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

const BottomNav = ({ activeKey, onSelect }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <PressableScale
            key={item.key}
            onPress={() => (onSelect ? onSelect(item.key) : undefined)}
          >
            <View style={styles.item}>
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.accent : colors.muted}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
              {isActive ? <View style={styles.activeDot} /> : null}
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  label: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
});

export default React.memo(BottomNav);
