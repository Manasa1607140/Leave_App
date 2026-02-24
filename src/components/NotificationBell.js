import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import { colors, spacing } from '../utils/theme';
import { useAppContext } from '../context/AppContext';

const NotificationBell = ({ onPress, style }) => {
  const { state } = useAppContext();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const unreadCount = useMemo(() => {
    const userId = state.currentUser?.id || state.currentUser?.rollNo;
    if (!userId) return 0;
    return state.notifications.filter((n) => n.toUserId === userId && !n.isRead).length;
  }, [state.notifications, state.currentUser]);

  useEffect(() => {
    if (unreadCount > 0) {
      opacity.setValue(1);
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.1, useNativeDriver: true, speed: 20 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
    } else {
      opacity.setValue(0);
    }
  }, [unreadCount, scale, opacity]);

  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.container, style]}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
        {unreadCount > 0 && (
          <Animated.View style={[styles.badge, { transform: [{ scale }], opacity }]}> 
            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </Animated.View>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default React.memo(NotificationBell);
