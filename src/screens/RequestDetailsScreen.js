import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import Card from '../components/Card';
import TimelineStepper from '../components/TimelineStepper';
import Screen from '../components/Screen';
import SectionTitle from '../components/ui/SectionTitle';
import { useAppContext } from '../context/AppContext';
import StatusChip from '../components/StatusChip';
import Toast from '../components/Toast';
import PrimaryButton from '../components/PrimaryButton';
import DangerButton from '../components/DangerButton';
import { colors, spacing } from '../utils/theme';
import { toReadableDate } from '../utils/date';
import { makeId } from '../utils/helpers';
import { getStudentByRoll } from '../data/dummyData';

const RequestDetailsScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;
  const [remark, setRemark] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const request = useMemo(
    () => state.leaveRequests.find((r) => r.id === requestId),
    [state.leaveRequests, requestId]
  );

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const role = user?.role;
  const canCounselorAct = role === 'Counselor' && request?.counselorStatus === 'Pending';
  const canHodAct =
    role === 'HOD' && request?.counselorStatus === 'Recommended' && request?.hodStatus === 'Pending';

  const parentMobile = useMemo(() => {
    if (!request) return '';
    return getStudentByRoll(request.studentRollNo)?.parentMobile || '';
  }, [request]);

  if (!user) {
    return <View style={styles.container} />;
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Request not found.</Text>
      </View>
    );
  }

  const notify = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const onCounselorRecommend = () => {
    const notification = {
      id: makeId('NOTI'),
      toRole: 'HOD',
      toUserId: request.hodId,
      title: 'Leave Recommended',
      message: `Leave Recommended: ${request.studentRollNo}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'COUNSELOR_RECOMMEND_AND_NOTIFY_HOD',
      payload: {
        requestId: request.id,
        remark: remark || 'Recommended',
        actionAt: new Date().toISOString(),
        hodNotification: notification,
      },
    });

    notify('Recommended to HOD');
    setTimeout(() => navigation.goBack(), 500);
  };

  const onCounselorReject = () => {
    const notification = {
      id: makeId('NOTI'),
      toRole: 'Student',
      toUserId: request.studentRollNo,
      title: 'Rejected by Counselor',
      message: 'Rejected by Counselor',
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'COUNSELOR_REJECT_AND_NOTIFY_STUDENT',
      payload: {
        requestId: request.id,
        remark: remark || 'Rejected',
        actionAt: new Date().toISOString(),
        studentNotification: notification,
      },
    });

    notify('Rejected by Counselor');
    setTimeout(() => navigation.goBack(), 500);
  };

  const onHodApprove = () => {
    const notification = {
      id: makeId('NOTI'),
      toRole: 'Student',
      toUserId: request.studentRollNo,
      title: 'Approved by HOD',
      message: 'Approved by HOD, you may Generate QR',
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'HOD_APPROVE_AND_NOTIFY_STUDENT',
      payload: {
        requestId: request.id,
        remark: remark || 'Approved',
        actionAt: new Date().toISOString(),
        studentNotification: notification,
      },
    });

    notify('Approved by HOD');
    setTimeout(() => navigation.goBack(), 500);
  };

  const onHodReject = () => {
    const notification = {
      id: makeId('NOTI'),
      toRole: 'Student',
      toUserId: request.studentRollNo,
      title: 'Rejected by HOD',
      message: 'Rejected by HOD',
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'HOD_REJECT_AND_NOTIFY_STUDENT',
      payload: {
        requestId: request.id,
        remark: remark || 'Rejected',
        actionAt: new Date().toISOString(),
        studentNotification: notification,
      },
    });

    notify('Rejected by HOD');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader title="Request Details" subtitle="Overview" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card} useGradient accent>
          <View style={styles.detailHeader}>
          <SectionTitle style={styles.cardTitle}>Student</SectionTitle>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{request.hodStatus}</Text>
            </View>
          </View>
          <Text style={styles.text}>{request.studentName}</Text>
          <Text style={styles.text}>{request.studentRollNo}</Text>
          <Text style={styles.text}>{`${request.dept} | Section ${request.section}`}</Text>
        </Card>

        {role === 'Counselor' && parentMobile ? (
          <Card style={styles.card}>
            <SectionTitle style={styles.cardTitle}>Parent Contact</SectionTitle>
            <Text style={styles.contactText} selectable>{`Parent Contact: +91 ${parentMobile}`}</Text>
          </Card>
        ) : null}

        <Card style={styles.card}>
          <SectionTitle style={styles.cardTitle}>Leave Details</SectionTitle>
          <Text style={styles.text}>Leave Date: {toReadableDate(request.leaveDate)}</Text>
          <Text style={styles.text}>Out Time: {request.outTime}</Text>
          <Text style={styles.text}>In Time: {request.inTime}</Text>
          <Text style={styles.text}>Reason: {request.reason}</Text>
        </Card>

        <Card style={styles.card}>
          <SectionTitle style={styles.cardTitle}>Letter Message</SectionTitle>
          <Text style={styles.text}>{request.letterMessage}</Text>
        </Card>

        <Card style={styles.card}>
          <SectionTitle style={styles.cardTitle}>Status Timeline</SectionTitle>
          <TimelineStepper
            steps={[
              { label: 'Sent', status: 'Approved' },
              { label: 'Counselor', status: request.counselorStatus },
              { label: 'HOD', status: request.hodStatus },
              { label: 'QR', status: request.qrStatus },
              { label: 'Gate', status: request.gateStatus },
            ]}
          />
          <View style={styles.statusRow}>
            <StatusChip label={`Counselor: ${request.counselorStatus}`} status={request.counselorStatus} />
            <StatusChip label={`HOD: ${request.hodStatus}`} status={request.hodStatus} />
            <StatusChip label={`QR: ${request.qrStatus}`} status={request.qrStatus} />
            <StatusChip label={`Gate: ${request.gateStatus}`} status={request.gateStatus} />
          </View>
        </Card>

        {(canCounselorAct || canHodAct) && (
          <Card style={styles.card}>
            <SectionTitle style={styles.cardTitle}>Action Remark (optional)</SectionTitle>
            <TextInput
              style={styles.input}
              value={remark}
              onChangeText={setRemark}
              placeholder="Add a short remark"
              placeholderTextColor={colors.muted}
            />

            {canCounselorAct ? (
              <View style={styles.actionRow}>
                <PrimaryButton label="Recommend" onPress={onCounselorRecommend} />
                <View style={styles.buttonSpacer} />
                <DangerButton label="Reject" onPress={onCounselorReject} />
              </View>
            ) : null}

            {canHodAct ? (
              <View style={styles.actionRow}>
                <PrimaryButton label="Approve" onPress={onHodApprove} />
                <View style={styles.buttonSpacer} />
                <DangerButton label="Reject" onPress={onHodReject} />
              </View>
            ) : null}
          </Card>
        )}
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} onHide={() => setToastVisible(false)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.md,
    width: '100%',
    maxWidth: 560,
  },
  cardTitle: {
    marginHorizontal: 0,
    marginBottom: spacing.xs,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  text: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  buttonSpacer: {
    width: spacing.sm,
  },
  empty: {
    padding: spacing.lg,
    color: colors.muted,
  },
});

export default RequestDetailsScreen;
