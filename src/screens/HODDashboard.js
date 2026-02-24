import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../components/GradientHeader';
import NotificationBell from '../components/NotificationBell';
import PressableScale from '../components/PressableScale';
import TabsPills from '../components/TabsPills';
import LeaveRequestCard from '../components/LeaveRequestCard';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../utils/theme';
import { sortByCreatedAtDesc } from '../utils/helpers';

const HODDashboard = ({ navigation }) => {
  const { state } = useAppContext();
  const user = state.currentUser;
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const tabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  const myRequests = useMemo(() => {
    if (!user) return [];
    return state.leaveRequests
      .filter((r) => r.hodId === user.id)
      .sort(sortByCreatedAtDesc);
  }, [state.leaveRequests, user]);

  const filtered = useMemo(() => {
    if (tab === 'pending') {
      return myRequests.filter(
        (r) => r.counselorStatus === 'Recommended' && r.hodStatus === 'Pending'
      );
    }
    if (tab === 'approved') return myRequests.filter((r) => r.hodStatus === 'Approved');
    if (tab === 'rejected') return myRequests.filter((r) => r.hodStatus === 'Rejected');
    return myRequests;
  }, [myRequests, tab]);

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader
        title="HOD Dashboard"
        subtitle="Pending approvals"
        right={
          <View style={styles.headerActions}>
            <NotificationBell
              onPress={() => navigation.navigate('Notifications')}
              style={styles.iconButton}
            />
            <PressableScale onPress={() => navigation.navigate('Settings')}>
              <View style={styles.iconButton}>
                <Ionicons name="settings-outline" size={18} color={colors.text} />
              </View>
            </PressableScale>
          </View>
        }
      />

      <TabsPills tabs={tabs} activeKey={tab} onChange={setTab} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaveRequestCard
            request={item}
            onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
            actionLabel="Open"
            onAction={() => navigation.navigate('RequestDetails', { requestId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="file-tray-outline"
            title="No requests here"
            subtitle="You're all caught up. New requests will appear in this list."
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  listContent: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: spacing.sm,
  },
});

export default HODDashboard;
