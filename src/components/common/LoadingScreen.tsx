import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message = 'Loading Attendance System...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandIconBox}>
        <Ionicons name="time" size={36} color={THEME.colors.primary} />
      </View>
      <ActivityIndicator size="large" color={THEME.colors.primary} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  brandIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.md,
  },
  spinner: {
    marginBottom: THEME.spacing.md,
  },
  message: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    fontWeight: '500',
  },
});
