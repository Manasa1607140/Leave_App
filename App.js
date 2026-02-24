import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AppProvider } from './src/context/AppContext';
import AnimatedSplashScreen from './src/components/SplashScreen';
import StackNavigator from './src/navigation/StackNavigator';
import { configureNotifications } from './src/utils/notificationUtils';

void ExpoSplashScreen.preventAutoHideAsync();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    configureNotifications();
  }, []);

  const handleSplashFinish = useCallback(async () => {
    await ExpoSplashScreen.hideAsync();
    setIsSplashVisible(false);
  }, []);

  if (isSplashVisible) {
    return <AnimatedSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <StackNavigator />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
