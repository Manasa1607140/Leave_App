import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import GradientHeader from '../components/GradientHeader';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { useAppContext } from '../context/AppContext';
import { colors, spacing, radius } from '../utils/theme';

const ViewQrScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;
  const request = useMemo(
    () => state.leaveRequests.find((r) => r.id === requestId),
    [state.leaveRequests, requestId]
  );

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  if (!user) {
    return <View style={styles.center} />;
  }

  if (!request) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Request not found.</Text>
      </View>
    );
  }

  const canGenerate =
    request.hodStatus === 'Approved' && request.qrStatus === 'NotGenerated' && user?.role === 'Student';

  const generateQr = () => {
    const payload = JSON.stringify({
      requestId: request.id,
      rollNo: request.studentRollNo,
      dept: request.dept,
      leaveDate: request.leaveDate,
      generatedAt: new Date().toISOString(),
    });

    dispatch({
      type: 'STUDENT_GENERATE_QR',
      payload: { requestId: request.id, qrPayload: payload, generatedAt: new Date().toISOString() },
    });
  };

  return (
    <Screen padded={false} style={styles.container}>
      <GradientHeader title="Leave QR" subtitle="Scan at gate" />
      <View style={styles.content}>
        <Text style={styles.title}>Leave QR</Text>

        <Card style={styles.qrCard}>
          <View style={styles.passHeader}>
            <Text style={styles.passTitle}>Leave Pass</Text>
            <Chip
              label={request.qrStatus === 'Generated' ? 'Valid' : 'Pending'}
              tone={request.qrStatus === 'Generated' ? 'success' : 'warning'}
            />
          </View>
          {request.qrStatus === 'Generated' && request.qrPayload ? (
            <QRCode value={request.qrPayload} size={220} />
          ) : (
            <Text style={styles.text}>QR not generated yet.</Text>
          )}
        </Card>

        <View style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Pass Details</Text>
          <Text style={styles.text}>Roll No: {request.studentRollNo}</Text>
          <Text style={styles.text}>Dept: {request.dept}</Text>
          <Text style={styles.text}>Leave Date: {request.leaveDate}</Text>
        </View>

        {canGenerate ? (
          <PrimaryButton label="Generate QR" onPress={generateQr} style={styles.primaryButton} />
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  passHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  passTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  qrCard: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  text: {
    fontSize: 12,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  primaryButton: {
    marginTop: spacing.lg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ViewQrScreen;
