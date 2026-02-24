import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '../components/PressableScale';
import BottomNav from '../components/BottomNav';
import GradientHeader from '../components/GradientHeader';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../utils/theme';

const SettingsScreen = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const onLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigation.replace('Login');
  };

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader title="Profile" subtitle="Account & preferences" />
      <View style={styles.content}>
        <Card style={styles.profileCard} useGradient accent>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.meta}>{user?.role}</Text>
            {user?.rollNo ? <Text style={styles.meta}>{user.rollNo}</Text> : null}
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="chatbubbles-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Messages</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} style={styles.menuArrow} />
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Information</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} style={styles.menuArrow} />
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="settings-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} style={styles.menuArrow} />
          </View>
        </Card>

        <Card style={styles.logoutCard}>
          <PressableScale onPress={onLogout}>
            <View style={[styles.menuItem, styles.menuItemLast, styles.logoutRow]}>
              <View style={[styles.menuIcon, styles.logoutIcon]}>
                <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              </View>
              <Text style={[styles.menuText, styles.logoutText]}>Log out</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.danger}
                style={styles.menuArrow}
              />
            </View>
          </PressableScale>
        </Card>
      </View>
      <BottomNav
        activeKey="profile"
        onSelect={(key) => {
          if (key === 'profile') return;
          if (key === 'home') navigation.navigate('StudentDashboard');
          if (key === 'notifications') navigation.navigate('Notifications');
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
  menuCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    marginLeft: spacing.sm,
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  menuArrow: {
    marginLeft: spacing.sm,
  },
  logoutCard: {
    padding: spacing.md,
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  logoutIcon: {
    backgroundColor: '#FCE9E9',
  },
  logoutText: {
    color: colors.danger,
  },
});

export default SettingsScreen;
