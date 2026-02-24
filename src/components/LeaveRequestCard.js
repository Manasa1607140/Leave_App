import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from './PressableScale';
import StatusChip from './StatusChip';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { toReadableDate } from '../utils/date';

const getPrimaryStatus = (request) => {
  if (request?.hodStatus && request.hodStatus !== 'Pending') return request.hodStatus;
  if (request?.counselorStatus && request.counselorStatus !== 'Pending') return request.counselorStatus;
  if (request?.qrStatus === 'Generated') return 'QR Ready';
  if (request?.gateStatus === 'Exited') return 'Exited';
  return 'Pending';
};

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = String(name).trim().split(' ').filter(Boolean);
  const first = parts[0]?.[0] || '';
  const second = parts[1]?.[0] || '';
  return (first + second).toUpperCase() || 'ST';
};

const LeaveRequestCard = ({ request, onPress, actionLabel, onAction }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(request.studentName)}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.name}>{request.studentName}</Text>
            <Text style={styles.subtitle}>
              {request.studentRollNo} • {toReadableDate(request.leaveDate)}
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <StatusChip label={getPrimaryStatus(request)} status={getPrimaryStatus(request)} />
        </View>
        <View style={styles.right}>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </View>
      {actionLabel ? (
        <PressableScale onPress={onAction}>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </View>
        </PressableScale>
      ) : null}
    </View>
  </PressableScale>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 335,
    alignSelf: 'center',
    ...shadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accentDeep,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  middle: {
    marginLeft: spacing.sm,
  },
  right: {
    marginLeft: spacing.sm,
  },
  actionButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default React.memo(LeaveRequestCard);
