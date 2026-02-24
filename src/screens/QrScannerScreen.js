import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useAppContext } from '../context/AppContext';
import Toast from '../components/Toast';
import { colors, spacing } from '../utils/theme';
import { toISODate, isOnOrAfter } from '../utils/date';
import { makeId } from '../utils/helpers';

const { width } = Dimensions.get('window');
const FRAME_SIZE = Math.min(260, width - 80);

const QrScannerScreen = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [user, navigation]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    let payload;
    try {
      payload = JSON.parse(data);
    } catch (e) {
      showToast('Invalid QR payload');
      setTimeout(() => setScanned(false), 1200);
      return;
    }

    const request = state.leaveRequests.find((r) => r.id === payload.requestId);
    const today = toISODate(new Date());
    const leaveDate = request?.leaveDate || payload?.leaveDate || '';

    const isValid =
      request &&
      request.hodStatus === 'Approved' &&
      request.qrStatus === 'Generated' &&
      request.gateStatus === 'NotScanned' &&
      (leaveDate ? isOnOrAfter(leaveDate, today) : true);

    if (!isValid) {
      showToast('QR not valid for exit');
      setTimeout(() => setScanned(false), 1400);
      return;
    }

    const exitedAt = new Date().toISOString();
    const securityUser = user;

    const studentNotification = {
      id: makeId('NOTI'),
      toRole: 'Student',
      toUserId: request.studentRollNo,
      title: 'Gate Exit Confirmed',
      message: 'Gate Exit Confirmed',
      createdAt: exitedAt,
      isRead: false,
      relatedRequestId: request.id,
    };

    const counselorNotification = {
      id: makeId('NOTI'),
      toRole: 'Counselor',
      toUserId: request.counselorId,
      title: 'Student Exited',
      message: 'Student Exited',
      createdAt: exitedAt,
      isRead: false,
      relatedRequestId: request.id,
    };

    const hodNotification = {
      id: makeId('NOTI'),
      toRole: 'HOD',
      toUserId: request.hodId,
      title: 'Student Exited',
      message: 'Student Exited',
      createdAt: exitedAt,
      isRead: false,
      relatedRequestId: request.id,
    };

    dispatch({
      type: 'SECURITY_SCAN_EXIT_AND_NOTIFY_ALL',
      payload: {
        requestId: request.id,
        securityUser,
        exitedAt,
        studentNotification,
        counselorNotification,
        hodNotification,
      },
    });

    showToast('Exit confirmed');
    setTimeout(() => navigation.goBack(), 800);
  };

  if (!user) {
    return <View style={styles.center} />;
  }

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Camera permission denied.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.maskRow} />
        <View style={styles.maskCenter}>
          <View style={styles.maskSide} />
          <View style={styles.frame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <View style={styles.maskSide} />
        </View>
        <View style={styles.maskRow} />
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hintTitle}>Scan Student QR</Text>
        <Text style={styles.hintText}>Align the QR inside the frame</Text>
      </View>

      <Toast visible={toastVisible} message={toastMessage} onHide={() => setToastVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    color: colors.text,
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskRow: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  maskCenter: {
    flexDirection: 'row',
  },
  maskSide: {
    width: (width - FRAME_SIZE) / 2,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cornerTL: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  hintBox: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDeep,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
  },
  hintTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default QrScannerScreen;
