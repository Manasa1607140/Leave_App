import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  counselors,
  hods,
  students,
  securityUsers,
  assignCounselor,
  getHod,
  getStudentByRoll,
} from '../data/dummyData';
import { db } from '../firebase/firebaseConfig';
import { makeId } from '../utils/helpers';
import { saveUserPushToken, sendPushNotificationsToUsers } from '../utils/notificationUtils';

const AppContext = createContext(null);

const initialState = {
  currentUser: null,
  leaveRequests: [],
  notifications: [],
  scanLogs: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'SET_LEAVE_REQUESTS':
      return { ...state, leaveRequests: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_SCAN_LOGS':
      return { ...state, scanLogs: action.payload };
    default:
      return state;
  }
};

const findStudentUser = (username, password) =>
  students.find((s) => s.username === username && s.password === password) || null;

const findCounselorUser = (username, password) =>
  counselors.find((c) => c.username === username && c.password === password) || null;

const findHodUser = (username, password) =>
  hods.find((h) => h.username === username && h.password === password) || null;

const findSecurityUser = (username, password) =>
  securityUsers.find((s) => s.username === username && s.password === password) || null;

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const leaveQuery = query(collection(db, 'leaveRequests'), orderBy('createdAt', 'desc'));
    const notifQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const scanQuery = query(collection(db, 'scanLogs'), orderBy('scannedAt', 'desc'));

    const unsubLeave = onSnapshot(leaveQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data());
      dispatch({ type: 'SET_LEAVE_REQUESTS', payload: items });
    });

    const unsubNotifs = onSnapshot(notifQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data());
      dispatch({ type: 'SET_NOTIFICATIONS', payload: items });
    });

    const unsubScans = onSnapshot(scanQuery, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data());
      dispatch({ type: 'SET_SCAN_LOGS', payload: items });
    });

    return () => {
      unsubLeave();
      unsubNotifs();
      unsubScans();
    };
  }, []);

  useEffect(() => {
    if (!state.currentUser) return;
    saveUserPushToken(db, state.currentUser);
  }, [state.currentUser]);

  const login = useCallback((username, password, role) => {
    if (!username || !password) return null;

    if (role === 'Student') return findStudentUser(username, password);
    if (role === 'Counselor') return findCounselorUser(username, password);
    if (role === 'HOD') return findHodUser(username, password);
    if (role === 'Security') return findSecurityUser(username, password);

    return null;
  }, []);

  const createRequestPayload = useCallback((formData) => {
    const student = getStudentByRoll(formData.rollNo);
    const counselor = assignCounselor(formData.rollNo);
    const hod = getHod(student.dept);

    return {
      id: makeId('REQ'),
      studentRollNo: student.rollNo,
      studentName: student.name,
      dept: student.dept,
      section: student.section,
      year: student.year,

      counselorId: counselor?.id || null,
      counselorName: counselor?.name || null,
      hodId: hod?.id || null,
      hodName: hod?.name || null,

      leaveDate: formData.leaveDate,
      outTime: formData.outTime,
      inTime: formData.inTime,
      reason: formData.reason,
      letterMessage: formData.letterMessage,

      counselorStatus: 'Pending',
      counselorRemark: '',
      counselorActionAt: null,

      hodStatus: 'Pending',
      hodRemark: '',
      hodActionAt: null,

      qrStatus: 'NotGenerated',
      qrPayload: null,
      qrGeneratedAt: null,

      gateStatus: 'NotScanned',
      exitedAt: null,
      scannedBySecurityId: null,
      scannedBySecurityName: null,

      createdAt: new Date().toISOString(),
    };
  }, []);

  const getRequestById = useCallback(async (requestId) => {
    if (!requestId) return null;
    const snap = await getDoc(doc(db, 'leaveRequests', requestId));
    return snap.exists() ? snap.data() : null;
  }, []);

  const dispatchAction = useCallback(async (action) => {
    switch (action.type) {
      case 'LOGIN':
      case 'LOGOUT':
        dispatch(action);
        return;
      case 'CREATE_REQUEST_AND_NOTIFY_COUNSELOR': {
        const { request, notification } = action.payload;
        await setDoc(doc(db, 'leaveRequests', request.id), request);
        await setDoc(doc(db, 'notifications', notification.id), notification);
        await sendPushNotificationsToUsers(
          db,
          [request.counselorId],
          'New Leave Request',
          `Student ${request.studentRollNo} sent a leave request`,
          { requestId: request.id, role: 'Counselor' }
        );
        return;
      }
      case 'COUNSELOR_RECOMMEND_AND_NOTIFY_HOD': {
        const { requestId, remark, actionAt, hodNotification } = action.payload;
        await updateDoc(doc(db, 'leaveRequests', requestId), {
          counselorStatus: 'Recommended',
          counselorRemark: remark,
          counselorActionAt: actionAt,
          hodStatus: 'Pending',
        });
        await setDoc(doc(db, 'notifications', hodNotification.id), hodNotification);
        const request = await getRequestById(requestId);
        const studentId = request?.studentRollNo;
        await sendPushNotificationsToUsers(
          db,
          [hodNotification?.toUserId, studentId],
          'Leave Recommended',
          `Leave recommended for ${request?.studentRollNo || 'student'}`,
          { requestId, role: 'HOD' }
        );
        return;
      }
      case 'COUNSELOR_REJECT_AND_NOTIFY_STUDENT': {
        const { requestId, remark, actionAt, studentNotification } = action.payload;
        await updateDoc(doc(db, 'leaveRequests', requestId), {
          counselorStatus: 'Rejected',
          counselorRemark: remark,
          counselorActionAt: actionAt,
        });
        await setDoc(doc(db, 'notifications', studentNotification.id), studentNotification);
        const request = await getRequestById(requestId);
        await sendPushNotificationsToUsers(
          db,
          [studentNotification?.toUserId, request?.hodId],
          'Leave Rejected',
          `Counselor rejected ${request?.studentRollNo || 'student'} request`,
          { requestId, role: 'Student' }
        );
        return;
      }
      case 'HOD_APPROVE_AND_NOTIFY_STUDENT': {
        const { requestId, remark, actionAt, studentNotification } = action.payload;
        await updateDoc(doc(db, 'leaveRequests', requestId), {
          hodStatus: 'Approved',
          hodRemark: remark,
          hodActionAt: actionAt,
        });
        await setDoc(doc(db, 'notifications', studentNotification.id), studentNotification);
        await sendPushNotificationsToUsers(
          db,
          [studentNotification?.toUserId],
          'Leave Approved',
          'Your leave is approved. You can generate the QR.',
          { requestId, role: 'Student' }
        );
        return;
      }
      case 'HOD_REJECT_AND_NOTIFY_STUDENT': {
        const { requestId, remark, actionAt, studentNotification } = action.payload;
        await updateDoc(doc(db, 'leaveRequests', requestId), {
          hodStatus: 'Rejected',
          hodRemark: remark,
          hodActionAt: actionAt,
        });
        await setDoc(doc(db, 'notifications', studentNotification.id), studentNotification);
        await sendPushNotificationsToUsers(
          db,
          [studentNotification?.toUserId],
          'Leave Rejected',
          'Your leave is rejected by HOD.',
          { requestId, role: 'Student' }
        );
        return;
      }
      case 'STUDENT_GENERATE_QR': {
        const { requestId, qrPayload, generatedAt } = action.payload;
        await updateDoc(doc(db, 'leaveRequests', requestId), {
          qrStatus: 'Generated',
          qrPayload,
          qrGeneratedAt: generatedAt,
        });
        return;
      }
      case 'SECURITY_SCAN_EXIT_AND_NOTIFY_ALL': {
        const {
          requestId,
          securityUser,
          exitedAt,
          studentNotification,
          counselorNotification,
          hodNotification,
        } = action.payload;

        const batch = writeBatch(db);
        batch.update(doc(db, 'leaveRequests', requestId), {
          gateStatus: 'Exited',
          exitedAt,
          scannedBySecurityId: securityUser.id,
          scannedBySecurityName: securityUser.name,
        });

        const scanLog = {
          id: makeId('scan'),
          requestId,
          rollNo: studentNotification.toUserId,
          scannedAt: exitedAt,
          scannedBySecurityId: securityUser.id,
          scannedBySecurityName: securityUser.name,
        };

        batch.set(doc(db, 'scanLogs', scanLog.id), scanLog);
        batch.set(doc(db, 'notifications', studentNotification.id), studentNotification);
        batch.set(doc(db, 'notifications', counselorNotification.id), counselorNotification);
        batch.set(doc(db, 'notifications', hodNotification.id), hodNotification);
        await batch.commit();
        await sendPushNotificationsToUsers(
          db,
          [
            studentNotification?.toUserId,
            counselorNotification?.toUserId,
            hodNotification?.toUserId,
          ],
          'Gate Exit Confirmed',
          `Exit confirmed for ${studentNotification?.toUserId || 'student'}`,
          { requestId, role: 'Security' }
        );
        return;
      }
      case 'MARK_NOTIFICATION_READ': {
        const { notificationId } = action.payload;
        await updateDoc(doc(db, 'notifications', notificationId), { isRead: true });
        return;
      }
      case 'MARK_ALL_READ': {
        const { userId } = action.payload;
        if (!userId) return;
        const q = query(
          collection(db, 'notifications'),
          where('toUserId', '==', userId),
          where('isRead', '==', false)
        );
        const snap = await getDocs(q);
        if (snap.empty) return;
        const batch = writeBatch(db);
        snap.docs.forEach((d) => {
          batch.update(d.ref, { isRead: true });
        });
        await batch.commit();
        return;
      }
      default:
        return;
    }
  }, [getRequestById]);

  const value = useMemo(
    () => ({
      state,
      dispatch: dispatchAction,
      login,
      createRequestPayload,
    }),
    [state, dispatchAction, login, createRequestPayload]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
};
