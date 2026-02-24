import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import PressableScale from '../components/PressableScale';
import { colors, spacing, radius, shadow } from '../utils/theme';

const roles = ['Student', 'Counselor', 'HOD', 'Security'];

const LoginScreen = ({ navigation }) => {
  const { dispatch, login } = useAppContext();
  const { height } = useWindowDimensions();
  const [role, setRole] = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const placeholder = useMemo(() => {
    if (role === 'Student') return '23CSEA001';
    if (role === 'Counselor') return 'counselor_CSE_A';
    if (role === 'HOD') return 'hod_CSE';
    return 'security1';
  }, [role]);

  const onLogin = () => {
    setError('');
    const user = login(username.trim(), password.trim(), role);
    if (!user) {
      setError('Invalid credentials. Try the predefined format.');
      return;
    }

    dispatch({ type: 'LOGIN', payload: user });

    if (role === 'Student') navigation.replace('StudentDashboard');
    if (role === 'Counselor') navigation.replace('CounselorDashboard');
    if (role === 'HOD') navigation.replace('HODDashboard');
    if (role === 'Security') navigation.replace('SecurityDashboard');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <ImageBackground
            source={require('../../assets/login-illustration.png')}
            style={[styles.heroTop, { height: height * 0.4 }]}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.card, { minHeight: height * 0.6 }, styles.cardLift]}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Welcome back. Please enter your details.</Text>

          <Text style={styles.label}>Role</Text>
          <View style={styles.selectRow}>
            <Ionicons name="person-circle-outline" size={18} color={colors.muted} />
            <Picker
              selectedValue={role}
              onValueChange={(value) => setRole(value)}
              style={styles.picker}
              dropdownIconColor={colors.muted}
            >
              {roles.map((r) => (
                <Picker.Item key={r} label={r} value={r} />
              ))}
            </Picker>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.muted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder={
                  role === 'Student'
                    ? 'student@123'
                    : role === 'Counselor'
                    ? 'counselor@123'
                    : role === 'HOD'
                    ? 'hod@123'
                    : 'security@123'
                }
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <PressableScale onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={colors.muted}
                />
              </PressableScale>
            </View>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PressableScale onPress={onLogin}>
            <View style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>SIGN IN</Text>
            </View>
          </PressableScale>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 0,
    alignItems: 'center',
    backgroundColor: colors.page,
  },
  hero: {
    width: '100%',
  },
  heroTop: {
    width: '100%',
    height: 220,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    paddingTop: spacing.lg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 420,
    width: '100%',
    ...shadow,
    marginTop: 0,
  },
  cardLift: {
    marginTop: -17,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
    height: 48,
  },
  picker: {
    flex: 1,
    height: 48,
    color: colors.text,
    fontSize: 16,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.page,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  helperText: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
  helperLink: {
    color: colors.accentDeep,
    fontWeight: '700',
  },
  helperHint: {
    marginTop: spacing.xs,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: spacing.sm,
    fontSize: 10,
    color: colors.muted,
    fontWeight: '700',
  },
});

export default LoginScreen;
