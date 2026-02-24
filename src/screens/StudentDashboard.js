import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationBell from '../components/NotificationBell';
import GradientHeader from '../components/GradientHeader';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import LeaveRequestCard from '../components/LeaveRequestCard';
import PressableScale from '../components/PressableScale';
import BottomNav from '../components/BottomNav';
import Screen from '../components/Screen';
import SectionTitle from '../components/ui/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../utils/theme';
import { sortByCreatedAtDesc } from '../utils/helpers';

const StudentDashboard = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const myRequests = useMemo(() => {
    if (!user) return [];
    return state.leaveRequests
      .filter((r) => r.studentRollNo === user.rollNo)
      .sort(sortByCreatedAtDesc);
  }, [state.leaveRequests, user]);

  const latest = myRequests[0];

  const monthStats = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleString('en', { month: 'short' }),
        count: 0,
      };
    });
    const indexByKey = months.reduce((acc, m, idx) => {
      acc[m.key] = idx;
      return acc;
    }, {});
    myRequests.forEach((req) => {
      const createdAt = new Date(req.createdAt);
      if (Number.isNaN(createdAt.getTime())) return;
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`;
      const idx = indexByKey[key];
      if (idx !== undefined) months[idx].count += 1;
    });
    return months;
  }, [myRequests]);

  const maxMonthCount = Math.max(1, ...monthStats.map((m) => m.count));

  const createQrPayload = (request) =>
    JSON.stringify({
      requestId: request.id,
      rollNo: request.studentRollNo,
      dept: request.dept,
      leaveDate: request.leaveDate,
      generatedAt: new Date().toISOString(),
    });

  const handleGenerateQr = (request) => {
    const payload = createQrPayload(request);
    dispatch({
      type: 'STUDENT_GENERATE_QR',
      payload: { requestId: request.id, qrPayload: payload, generatedAt: new Date().toISOString() },
    });
    navigation.navigate('ViewQr', { requestId: request.id });
  };

  const renderItem = ({ item }) => {
    const canGenerate = item.hodStatus === 'Approved' && item.qrStatus === 'NotGenerated';
    return (
      <LeaveRequestCard
        request={item}
        onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
        actionLabel={canGenerate ? 'Generate QR' : null}
        onAction={canGenerate ? () => handleGenerateQr(item) : undefined}
      />
    );
  };

  if (!user) {
    return <View style={styles.container} />;
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning,' : hour < 17 ? 'Good Afternoon,' : 'Good Evening,';

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader
        title="Dashboard"
        subtitle="Overview"
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

      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View style={styles.greeting}>
              <Text style={styles.greetingTitle}>{greeting}</Text>
              <Text style={styles.greetingName}>{user.name}</Text>
            </View>

            <Card style={styles.quickCard}>
              <View style={styles.quickRow}>
                <View style={styles.quickText}>
                  <Text style={styles.quickTitle}>Quick Action</Text>
                  <Text style={styles.quickSubtitle}>Create a new leave request</Text>
                </View>
                <PrimaryButton
                  label="Apply Leave"
                  onPress={() => navigation.navigate('CreateLeaveLetter')}
                  style={styles.quickButton}
                />
              </View>
            </Card>

            <Card style={styles.attendanceCard}>
              <View>
                <SectionTitle style={styles.cardTitle}>Attendance</SectionTitle>
                <Text style={styles.attendanceDate}>
                  {new Date().toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.attendanceRow}>
                <View style={styles.attendancePill}>
                  <Text style={styles.attendanceDot}>{'\u2022'}</Text>
                  <Text style={styles.attendanceText}>
                    Time in: {latest?.outTime || '--'}
                  </Text>
                </View>
                <View style={[styles.attendancePill, styles.attendancePillDark]}>
                  <Text style={styles.attendanceTextDark}>
                    Time out: {latest?.inTime || '--'}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.trackCard}>
              <View style={styles.trackHeader}>
                <SectionTitle style={styles.cardTitle}>Track Record</SectionTitle>
              </View>
              <View style={styles.barRow}>
                {monthStats.map((m) => (
                  <View key={m.key} style={styles.barItem}>
                    <View
                      style={[
                        styles.bar,
                        { height: 16 + (50 * m.count) / maxMonthCount },
                      ]}
                    />
                    <Text style={styles.barLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <SectionTitle>My Requests</SectionTitle>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No requests yet.</Text>}
        contentContainerStyle={styles.listContent}
      />
      <BottomNav
        activeKey="home"
        onSelect={(key) => {
          if (key === 'home') return;
          if (key === 'notifications') navigation.navigate('Notifications');
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
  listContent: {
    paddingBottom: spacing.xl,
  },
  greeting: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  greetingTitle: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  greetingName: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  quickCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  quickSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  quickButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  trackCard: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginHorizontal: 0,
    marginBottom: spacing.xs,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  barItem: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  bar: {
    width: 10,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  barLabel: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 6,
  },
  attendanceCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  attendanceDate: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  attendancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginRight: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  attendancePillDark: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  attendanceDot: {
    color: colors.primary,
    marginRight: 6,
    fontSize: 10,
  },
  attendanceText: {
    fontSize: 11,
    color: colors.text,
  },
  attendanceTextDark: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  emptyText: {
    marginHorizontal: spacing.md,
    color: colors.muted,
    fontSize: 12,
  },
});

export default StudentDashboard;

