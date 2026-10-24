import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { TextInputField } from '../../components/common/TextInputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DEMO_PRESETS } from '../../data/users';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { resetAllData } = useAttendance();

  // Pre-fill with Staff demo account for quick evaluation
  const [email, setEmail] = useState('staff@test.com');
  const [password, setPassword] = useState('Staff@123');
  const [activeRole, setActiveRole] = useState<'staff' | 'senior_staff' | 'admin' | null>('staff');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.errorMessage || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = (role: 'staff' | 'senior_staff' | 'admin') => {
    const preset = DEMO_PRESETS.find((p) => p.role === role);
    if (preset) {
      setEmail(preset.email);
      setPassword(preset.password);
      setActiveRole(role);
      setErrorMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Select a role or enter your credentials</Text>
        </View>

        {/* 3 Simple Quick Role Buttons */}
        <View style={styles.roleRow}>
          {DEMO_PRESETS.map((preset) => {
            const isSelected = activeRole === preset.role;
            return (
              <TouchableOpacity
                key={preset.role}
                activeOpacity={0.7}
                onPress={() => handleSelectRole(preset.role)}
                style={[styles.rolePill, isSelected && styles.rolePillActive]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    isSelected && styles.rolePillTextActive,
                  ]}
                >
                  {preset.roleLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Error message */}
        {errorMessage ? <ErrorMessage message={errorMessage} /> : null}

        {/* Form Inputs */}
        <View style={styles.form}>
          <TextInputField
            label="Email"
            placeholder="name@company.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setActiveRole(null);
              if (errorMessage) setErrorMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <TextInputField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setActiveRole(null);
              if (errorMessage) setErrorMessage('');
            }}
            isPassword
            icon="lock-closed-outline"
          />

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            size="lg"
            style={styles.signInBtn}
          />

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              Alert.alert(
                'Reset All App Data',
                'This will clear all sessions and restore attendance records back to the fresh initial state. Proceed?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset App',
                    style: 'destructive',
                    onPress: async () => {
                      await resetAllData();
                      Alert.alert('Reset Complete', 'All app data has been reset to brand new state.');
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.resetBtnText}>Reset All Data as New App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  rolePill: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolePillActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  rolePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  signInBtn: {
    marginTop: 8,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 10,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
