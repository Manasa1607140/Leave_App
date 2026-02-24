import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import NotificationItem from '../components/NotificationItem';
import TabsPills from '../components/TabsPills';
import BottomNav from '../components/BottomNav';
import Screen from '../components/Screen';
import EmptyState from '../components/EmptyState';
import SecondaryButton from '../components/SecondaryButton';
import { useAppContext } from '../context/AppContext';
import { colors, spacing, radius, shadow } from '../utils/theme';

const NotificationsScreen = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;
  const userId = user?.id || user?.rollNo;
  const [tab, setTab] = useState('status');

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const items = useMemo(() => {
    if (!userId) return [];
    return state.notifications.filter((n) => n.toUserId === userId);
  }, [state.notifications, userId]);

  const markAll = () => {
    dispatch({ type: 'MARK_ALL_READ', payload: { userId } });
  };

  const onOpenNotification = (item) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId: item.id } });
    if (item.relatedRequestId) {
      navigation.navigate('RequestDetails', { requestId: item.relatedRequestId });
    }
  };

  if (!user) {
    return <View style={styles.container} />;
  }

  const tabs = [
    { key: 'status', label: 'Status' },
    { key: 'history', label: 'History' },
  ];

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader
        title="Notification"
        subtitle="Status"
        right={
          <SecondaryButton label="Mark all read" onPress={markAll} style={styles.markAll} />
        }
      />

      <TabsPills tabs={tabs} activeKey={tab} onChange={setTab} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => onOpenNotification(item)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="mail-open-outline"
            title="No Status Report"
            subtitle="You're all caught up. New updates will appear here."
          />
        }
        contentContainerStyle={styles.listContent}
      />
      <BottomNav
        activeKey="notifications"
        onSelect={(key) => {
          if (key === 'notifications') return;
          if (key === 'home') navigation.navigate('StudentDashboard');
          if (key === 'profile') navigation.navigate('Settings');
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  markAll: {
    paddingHorizontal: spacing.sm,
  },
  markAllText: {},
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {},
  emptyTitle: {},
});

export default NotificationsScreen;
