import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../utils/theme';
import Screen from '../components/Screen';

const SplashScreen = ({ navigation }) => {
  const { state } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.currentUser) {
        const role = state.currentUser.role;
        if (role === 'Student') navigation.replace('StudentDashboard');
        if (role === 'Counselor') navigation.replace('CounselorDashboard');
        if (role === 'HOD') navigation.replace('HODDashboard');
        if (role === 'Security') navigation.replace('SecurityDashboard');
      } else {
        navigation.replace('Login');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [state.currentUser, navigation]);

  return (
    <Screen padded={false} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoWrap}>
        <Image
          source={require('../../assets/SRIT-LOGO.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>GoLeave</Text>
      <Text style={styles.subtitle}>Experience Freedom Live Now</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoWrap: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 46,
    height: 46,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
    maxWidth: 220,
  },
});

export default SplashScreen;
