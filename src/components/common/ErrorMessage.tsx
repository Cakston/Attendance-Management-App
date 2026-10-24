import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle"
        size={18}
        color={THEME.colors.status.error}
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.status.errorBg,
    borderColor: THEME.colors.status.errorBorder,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.status.error,
    fontWeight: '500',
  },
});
