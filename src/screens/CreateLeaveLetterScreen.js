import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import GradientHeader from '../components/GradientHeader';
import { useAppContext } from '../context/AppContext';
import Toast from '../components/Toast';
import { colors, spacing } from '../utils/theme';
import { toISODate } from '../utils/date';
import { assignCounselor } from '../data/dummyData';
import { makeId } from '../utils/helpers';

const CreateLeaveLetterScreen = ({ navigation }) => {
  const { state, dispatch, createRequestPayload } = useAppContext();
  const user = state.currentUser;
  const [leaveDate, setLeaveDate] = useState(toISODate(new Date()));
  const [outTime, setOutTime] = useState('10:00');
  const [inTime, setInTime] = useState('17:00');
  const [reason, setReason] = useState('');
  const [letterMessage, setLetterMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const onSend = () => {
    if (!leaveDate || !outTime || !inTime || !reason || !letterMessage) {
      setToastMessage('Please fill all fields');
      setToastVisible(true);
      return;
    }

    const request = createRequestPayload({
      rollNo: user.rollNo,
      leaveDate,
      outTime,
      inTime,
      reason,
      letterMessage,
    });

    const counselor = assignCounselor(user.rollNo);

    const notification = {
      id: makeId('NOTI'),
      toRole: 'Counselor',
      toUserId: counselor?.id,
      title: 'New Leave Letter',
      message: `New Leave Letter from ${user.rollNo}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'CREATE_REQUEST_AND_NOTIFY_COUNSELOR',
      payload: { request, notification },
    });

    setToastMessage('Leave letter sent successfully');
    setToastVisible(true);
    setTimeout(() => navigation.goBack(), 600);
  };

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader title="Create Leave" subtitle="Fill up the form" />
      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Fill up the form</Text>
          <Text style={styles.subtitle}>Provide accurate information below</Text>

          <Card style={styles.card}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              <Chip label="Personal" tone="info" />
              <Chip label="Medical" tone="warning" />
              <Chip label="Other" tone="default" />
            </View>

            <Text style={styles.label}>Leave Date</Text>
            <TextInput
              style={styles.input}
              value={leaveDate}
              onChangeText={setLeaveDate}
              placeholder="2026-02-05"
              placeholderTextColor={colors.muted}
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Out Time</Text>
                <TextInput
                  style={styles.input}
                  value={outTime}
                  onChangeText={setOutTime}
                  placeholder="10:00"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View style={[styles.rowItem, styles.rowItemRight]}>
                <Text style={styles.label}>In Time</Text>
                <TextInput
                  style={styles.input}
                  value={inTime}
                  onChangeText={setInTime}
                  placeholder="17:00"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <Text style={styles.label}>Reason</Text>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              placeholder="Family function"
              placeholderTextColor={colors.muted}
            />

            <Text style={styles.label}>Letter Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={letterMessage}
              onChangeText={setLetterMessage}
              placeholder="Write a formal letter message..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={6}
            />

            <View style={styles.uploadRow}>
              <View>
                <Text style={styles.uploadTitle}>Upload Document</Text>
                <Text style={styles.uploadSubtitle}>Optional supporting file</Text>
              </View>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Attach</Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label="Continue" onPress={onSend} />
        </View>
      </View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + 64,
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.md,
    width: '100%',
    maxWidth: 520,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
  },
  rowItemRight: {
    marginLeft: spacing.sm,
  },
  primaryButton: {},
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    backgroundColor: colors.page,
  },
  uploadTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  uploadSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.page,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default CreateLeaveLetterScreen;
