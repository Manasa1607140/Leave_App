import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../components/GradientHeader';
import NotificationBell from '../components/NotificationBell';
import LeaveRequestCard from '../components/LeaveRequestCard';
import Card from '../components/Card';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { useAppContext } from '../context/AppContext';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { sortByCreatedAtDesc } from '../utils/helpers';

const SecurityDashboard = ({ navigation }) => {
  const { state } = useAppContext();
  const user = state.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const pending = useMemo(() => {
    if (!user) return [];
    return state.leaveRequests
      .filter((r) => r.qrStatus === 'Generated' && r.gateStatus === 'NotScanned')
      .sort(sortByCreatedAtDesc);
  }, [state.leaveRequests, user]);

  const logs = useMemo(() => (user ? state.scanLogs : []), [state.scanLogs, user]);

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader
        title="Security Dashboard"
        subtitle="Gate exit monitoring"
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
        data={pending}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaveRequestCard
            request={item}
            onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
          />
        )}
        ListHeaderComponent={
          <View>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Scan Exit QR</Text>
              <Text style={styles.cardText}>Scan the student QR to validate exit.</Text>
              <PrimaryButton
                label="Open Scanner"
                onPress={() => navigation.navigate('QrScanner')}
                style={styles.primaryButton}
              />
            </Card>
            <Text style={styles.sectionTitle}>Pending Exits</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No pending exits.</Text>}
        ListFooterComponent={
          <View>
            <Text style={styles.sectionTitle}>Recent Scan Logs</Text>
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.logItem}>
                  <View style={styles.logRow}>
                    <Text style={styles.logTitle}>{item.rollNo}</Text>
                    <Text style={styles.logBadge}>Exit</Text>
                  </View>
                  <Text style={styles.logText}>{item.scannedBySecurityName}</Text>
                  <Text style={styles.logTime}>{new Date(item.scannedAt).toLocaleString()}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No scans yet.</Text>}
              scrollEnabled={false}
            />
          </View>
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
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    ...shadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  cardText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  primaryButton: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    marginHorizontal: spacing.md,
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  logItem: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    ...shadow,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  logBadge: {
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  logText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  logTime: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
});

export default SecurityDashboard;
