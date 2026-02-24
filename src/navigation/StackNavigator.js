import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import StudentDashboard from '../screens/StudentDashboard';
import CreateLeaveLetterScreen from '../screens/CreateLeaveLetterScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import CounselorDashboard from '../screens/CounselorDashboard';
import HODDashboard from '../screens/HODDashboard';
import SecurityDashboard from '../screens/SecurityDashboard';
import QrScannerScreen from '../screens/QrScannerScreen';
import ViewQrScreen from '../screens/ViewQrScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
    <Stack.Screen name="CreateLeaveLetter" component={CreateLeaveLetterScreen} />
    <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
    <Stack.Screen name="CounselorDashboard" component={CounselorDashboard} />
    <Stack.Screen name="HODDashboard" component={HODDashboard} />
    <Stack.Screen name="SecurityDashboard" component={SecurityDashboard} />
    <Stack.Screen name="QrScanner" component={QrScannerScreen} />
    <Stack.Screen name="ViewQr" component={ViewQrScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
