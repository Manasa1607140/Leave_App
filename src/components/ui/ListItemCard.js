import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PressableScale from '../PressableScale';
import Card from './Card';
import Chip from './Chip';
import { colors, spacing } from '../../utils/theme';

const ListItemCard = ({
  left,
  title,
  subtitle,
  meta,
  statusLabel,
  statusTone = 'default',
  actionLabel,
  onAction,
  rightChevron = true,
  footer,
  style,
}) => (
  <Card style={[styles.card, style]}>
    <View style={styles.row}>
      {left ? <View style={styles.leftSlot}>{left}</View> : null}
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
      <View style={styles.right}>
        {statusLabel ? <Chip label={statusLabel} tone={statusTone} /> : null}
        {actionLabel ? (
          onAction ? (
            <PressableScale onPress={onAction}>
              <View style={styles.action}>
                <Text style={styles.actionText}>{actionLabel}</Text>
              </View>
            </PressableScale>
          ) : (
            <View style={styles.action}>
              <Text style={styles.actionText}>{actionLabel}</Text>
            </View>
          )
        ) : null}
        {rightChevron ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null}
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSlot: {
    marginRight: spacing.sm,
  },
  left: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  meta: {
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },
  footer: {
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default React.memo(ListItemCard);
