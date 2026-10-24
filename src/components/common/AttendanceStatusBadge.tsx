import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceStatus } from '../../types';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  status: AttendanceStatus;
  size?: 'sm' | 'md';
}

export const AttendanceStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const getConfig = () => {
    switch (status) {
      case 'checked_out':
        return {
          label: 'Completed',
          bgColor: THEME.colors.status.completedBg,
          textColor: THEME.colors.status.completed,
          borderColor: THEME.colors.status.completedBorder,
          icon: 'checkmark-circle-outline' as const,
        };
      case 'checked_in':
        return {
          label: 'In Progress',
          bgColor: THEME.colors.status.inProgressBg,
          textColor: THEME.colors.status.inProgress,
          borderColor: THEME.colors.status.inProgressBorder,
          icon: 'time-outline' as const,
        };
      case 'not_checked_in':
      default:
        return {
          label: 'Not Checked In',
          bgColor: THEME.colors.status.notStartedBg,
          textColor: THEME.colors.status.notStarted,
          borderColor: THEME.colors.status.notStartedBorder,
          icon: 'remove-circle-outline' as const,
        };
    }
  };

  const config = getConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 10,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSm ? 12 : 14}
        color={config.textColor}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: isSm ? 11 : 12,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});
