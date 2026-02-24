import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import NotificationBell from './NotificationBell';
import { colors, spacing } from '../utils/theme';

const HeaderBar = ({ title, subtitle = 'Welcome back', onBellPress, onSettingsPress }) => (
  <LinearGradient
    colors={['#FF7A00', '#FF4D00']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
  >
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.actions}>
      <NotificationBell onPress={onBellPress} style={styles.iconButton} />
      <View style={styles.settings}>
        <PressableScale onPress={onSettingsPress}>
          <View style={styles.iconButton}>
            <Ionicons name="settings-outline" size={18} color={colors.text} />
          </View>
        </PressableScale>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settings: {
    marginLeft: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default React.memo(HeaderBar);
