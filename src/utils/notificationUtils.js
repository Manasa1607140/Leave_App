import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

let notificationsConfigured = false;

const getProjectId = () => {
  const expoConfig = Constants.expoConfig || Constants.manifest;
  const easProjectId = expoConfig?.extra?.eas?.projectId || expoConfig?.eas?.projectId;
  const legacyProjectId = expoConfig?.extra?.projectId || expoConfig?.projectId;
  return easProjectId || legacyProjectId || undefined;
};

export const configureNotifications = async () => {
  if (notificationsConfigured) return;
  notificationsConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Device.isDevice) {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableVibrate: true,
      showBadge: true,
    });
  }

  await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
};

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) return null;

  const permissions = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.status;
  if (finalStatus !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    finalStatus = request.status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = getProjectId();
  const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  return token?.data || null;
};

export const saveUserPushToken = async (db, user) => {
  if (!db || !user?.id) return null;
  const token = await registerForPushNotificationsAsync();
  if (!token) return null;

  const payload = {
    id: user.id,
    userId: user.id,
    role: user.role,
    token,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'pushTokens', user.id), payload, { merge: true });
  return token;
};

const chunkArray = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const fetchTokensForUsers = async (db, userIds) => {
  if (!db || !userIds?.length) return [];
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  const chunks = chunkArray(uniqueIds, 10);
  const tokens = [];

  for (const group of chunks) {
    const q = query(collection(db, 'pushTokens'), where('userId', 'in', group));
    const snap = await getDocs(q);
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data?.token) tokens.push(data.token);
    });
  }

  return Array.from(new Set(tokens));
};

export const sendPushNotificationsToUsers = async (db, userIds, title, body, data = {}) => {
  try {
    const tokens = await fetchTokensForUsers(db, userIds);
    if (!tokens.length) return;

    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    }));

    const messageChunks = chunkArray(messages, 100);
    for (const chunk of messageChunks) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });
    }
  } catch (err) {
    return;
  }
};
