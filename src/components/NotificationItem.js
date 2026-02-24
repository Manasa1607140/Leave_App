import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PressableScale from './PressableScale';
import Card from './Card';
import Chip from './Chip';
import { colors, spacing } from '../utils/theme';

const formatRelativeTime = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const formatLongDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusMeta = (item) => {
  const text = `${item?.title || ''} ${item?.message || ''}`.toLowerCase();
  if (text.includes('approved')) return { label: 'Approved', tone: 'success' };
  if (text.includes('rejected')) return { label: 'Denied', tone: 'danger' };
  if (text.includes('recommended')) return { label: 'Pending', tone: 'warning' };
  if (text.includes('pending')) return { label: 'Pending', tone: 'warning' };
  return { label: 'Pending', tone: 'warning' };
};

const NotificationItem = ({ item, onPress }) => {
  const status = getStatusMeta(item);
  return (
    <PressableScale onPress={onPress}>
      <Card style={[styles.card, item.isRead && styles.cardRead]}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{formatLongDate(item.createdAt)}</Text>
          </View>
          <Chip label={status.label} tone={status.tone} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
          <View style={styles.detailButton}>
            <Text style={styles.detailText}>Detail</Text>
          </View>
        </View>
      </Card>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  cardRead: {
    opacity: 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  message: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  time: {
    fontSize: 11,
    color: colors.muted,
  },
  detailButton: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  detailText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default React.memo(NotificationItem);
